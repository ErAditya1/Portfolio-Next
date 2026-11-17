/**
 * AG-UI agent endpoint.
 *
 * Accepts an AG-UI RunAgentInput (POST JSON) and streams AG-UI events back as
 * Server-Sent Events: RUN_STARTED → REASONING_* / TEXT_MESSAGE_* / TOOL_CALL_*
 * → RUN_FINISHED (success, or interrupt for human-in-the-loop approval).
 *
 * LLM: Groq (OpenAI-compatible), model from GROQ_MODEL (openai/gpt-oss-120b).
 */
import { randomUUID } from "crypto";
import { createGroq } from "@ai-sdk/groq";
import { stepCountIs, streamText, type ModelMessage } from "ai";
import { EventType, type BaseEvent, type RunAgentInput } from "@ag-ui/core";
import { RunAgentInputSchema } from "@ag-ui/core/schemas";
import { EventEncoder } from "@ag-ui/encoder";
import { agentTools, contactSchema, CONTACT_TOOL } from "@/lib/agent/tools";
import { createEnquiry } from "@/lib/portfolio-tools";
import { rateLimit } from "@/lib/agent/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_MESSAGES = 40;
const MAX_USER_CHARS = 2000;

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1",
});
const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

const SYSTEM_PROMPT = `You are the AI agent on Aditya Kumar's developer portfolio website (eraditya.vercel.app).
Aditya is a full-stack web developer (Next.js, React, Node.js, MongoDB, AI integrations).

Rules:
- Use your tools to answer questions about Aditya's profile, skills, projects, experience and blogs. Never invent projects, employers, numbers or links. If the tools don't have it, say so.
- The UI already shows tool results as rich cards (projects, profile, experience, blogs). After a tool call, DO NOT list or tabulate the items again. Write 2–4 sentences that highlight what matters for the visitor's question, then offer a next step.
- If the visitor wants to hire, contact or work with Aditya, call ${CONTACT_TOOL} with whatever details you know. The visitor reviews and approves a form before it's sent, so never claim a message was sent unless the tool result says "sent".
- For pricing questions, explain that it depends on scope and offer to send an enquiry.
- Be concise and friendly. Use markdown. Reply in the visitor's language (English, Hindi or Hinglish).
- Only discuss topics related to Aditya, his work, and web development services. Politely decline anything else.`;

const interruptIdFor = (toolCallId: string) => `contact:${toolCallId}`;

/** Convert AG-UI messages into AI SDK model messages. */
function toModelMessages(input: RunAgentInput): ModelMessage[] {
  const out: ModelMessage[] = [];
  const toolNames = new Map<string, string>();
  const answered = new Set<string>();
  const msgs = input.messages.slice(-MAX_MESSAGES);

  for (const m of msgs) if (m.role === "tool") answered.add(m.toolCallId);

  for (const m of msgs) {
    if (m.role === "user") {
      const text =
        typeof m.content === "string"
          ? m.content
          : m.content.map((p) => (p.type === "text" ? p.text : "")).join("\n");
      out.push({ role: "user", content: text.slice(0, MAX_USER_CHARS) });
    } else if (m.role === "assistant") {
      const parts: Exclude<Extract<ModelMessage, { role: "assistant" }>["content"], string> = [];
      if (m.content) parts.push({ type: "text", text: m.content });
      const unanswered: { id: string; name: string }[] = [];
      for (const tc of m.toolCalls ?? []) {
        toolNames.set(tc.id, tc.function.name);
        let args: unknown = {};
        try {
          args = JSON.parse(tc.function.arguments || "{}");
        } catch {}
        parts.push({ type: "tool-call", toolCallId: tc.id, toolName: tc.function.name, input: args });
        if (!answered.has(tc.id)) unanswered.push({ id: tc.id, name: tc.function.name });
      }
      if (parts.length) out.push({ role: "assistant", content: parts });
      // Calls left open (e.g. a contact form the visitor ignored, or one being resumed now)
      // get a placeholder result so the provider accepts the history. Resumed calls are
      // replaced with the real result below.
      for (const u of unanswered) {
        out.push({
          role: "tool",
          content: [
            {
              type: "tool-result",
              toolCallId: u.id,
              toolName: u.name,
              output: { type: "text", value: "Not completed: the visitor moved on without approving." },
            },
          ],
        });
      }
    } else if (m.role === "tool") {
      const name = toolNames.get(m.toolCallId);
      if (!name) continue;
      const value =
        typeof m.content === "string"
          ? m.content
          : m.content.map((p) => (p.type === "text" ? p.text : "")).join("\n");
      out.push({
        role: "tool",
        content: [{ type: "tool-result", toolCallId: m.toolCallId, toolName: name, output: { type: "text", value } }],
      });
    }
  }
  return out;
}

function replaceToolResult(messages: ModelMessage[], toolCallId: string, value: string) {
  for (const m of messages) {
    if (m.role !== "tool") continue;
    for (const part of m.content) {
      if (part.type === "tool-result" && part.toolCallId === toolCallId) {
        part.output = { type: "text", value };
        return;
      }
    }
  }
}

function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local"
  );
}

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return Response.json({ error: "Agent is not configured (GROQ_API_KEY missing)." }, { status: 503 });
  }

  const limited = rateLimit(clientIp(req));
  if (!limited.ok) {
    return Response.json(
      { error: "Too many requests. Please wait a few minutes." },
      { status: 429, headers: { "retry-after": String(limited.retryAfter) } }
    );
  }

  let input: RunAgentInput;
  try {
    input = RunAgentInputSchema.parse(await req.json()) as RunAgentInput;
  } catch {
    return Response.json({ error: "Invalid AG-UI RunAgentInput" }, { status: 400 });
  }

  const encoder = new EventEncoder({ accept: req.headers.get("accept") ?? undefined });
  const { threadId, runId } = input;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const te = new TextEncoder();
      const send = (event: BaseEvent) => {
        try {
          controller.enqueue(te.encode(encoder.encodeSSE(event)));
        } catch {
          /* client disconnected */
        }
      };

      send({ type: EventType.RUN_STARTED, threadId, runId } as BaseEvent);

      try {
        const messages = toModelMessages(input);

        // ── Resume after a human-in-the-loop interrupt ──
        for (const entry of input.resume ?? []) {
          if (!entry.interruptId.startsWith("contact:")) continue;
          const toolCallId = entry.interruptId.slice("contact:".length);
          let resultText: string;
          if (entry.status === "resolved") {
            const parsed = contactSchema.safeParse(entry.payload);
            if (parsed.success) {
              const saved = await createEnquiry(parsed.data);
              resultText = JSON.stringify({ status: "sent", id: saved.id, to: "Aditya Kumar" });
            } else {
              resultText = JSON.stringify({ status: "invalid", issues: parsed.error.issues.map((i) => i.message) });
            }
          } else {
            resultText = JSON.stringify({ status: "cancelled_by_visitor" });
          }
          replaceToolResult(messages, toolCallId, resultText);
          send({
            type: EventType.TOOL_CALL_RESULT,
            messageId: randomUUID(),
            toolCallId,
            content: resultText,
            role: "tool",
          } as BaseEvent);
        }

        const result = streamText({
          model: groq(MODEL),
          system: SYSTEM_PROMPT,
          messages,
          tools: agentTools,
          stopWhen: stepCountIs(6),
          temperature: 0.4,
          maxOutputTokens: 1500,
          abortSignal: req.signal,
          providerOptions: { groq: { reasoningFormat: "parsed", reasoningEffort: "low", parallelToolCalls: false } },
        });

        let textId: string | null = null;
        let reasoningId: string | null = null;
        let lastAssistantId: string = randomUUID();
        const pendingContact: { toolCallId: string; args: unknown }[] = [];

        const closeText = () => {
          if (textId) send({ type: EventType.TEXT_MESSAGE_END, messageId: textId } as BaseEvent);
          textId = null;
        };
        const closeReasoning = () => {
          if (!reasoningId) return;
          send({ type: EventType.REASONING_MESSAGE_END, messageId: reasoningId } as BaseEvent);
          send({ type: EventType.REASONING_END, messageId: reasoningId } as BaseEvent);
          reasoningId = null;
        };

        for await (const part of result.fullStream) {
          switch (part.type) {
            case "start-step":
              lastAssistantId = randomUUID();
              break;
            case "reasoning-delta":
              if (!part.text) break;
              if (!reasoningId) {
                closeText();
                reasoningId = randomUUID();
                send({ type: EventType.REASONING_START, messageId: reasoningId } as BaseEvent);
                send({ type: EventType.REASONING_MESSAGE_START, messageId: reasoningId, role: "reasoning" } as BaseEvent);
              }
              send({ type: EventType.REASONING_MESSAGE_CONTENT, messageId: reasoningId, delta: part.text } as BaseEvent);
              break;
            case "text-delta":
              if (!part.text) break;
              closeReasoning();
              if (!textId) {
                textId = lastAssistantId;
                send({ type: EventType.TEXT_MESSAGE_START, messageId: textId, role: "assistant" } as BaseEvent);
              }
              send({ type: EventType.TEXT_MESSAGE_CONTENT, messageId: textId, delta: part.text } as BaseEvent);
              break;
            case "tool-call": {
              closeReasoning();
              closeText();
              send({
                type: EventType.TOOL_CALL_START,
                toolCallId: part.toolCallId,
                toolCallName: part.toolName,
                parentMessageId: lastAssistantId,
              } as BaseEvent);
              send({ type: EventType.TOOL_CALL_ARGS, toolCallId: part.toolCallId, delta: JSON.stringify(part.input ?? {}) } as BaseEvent);
              send({ type: EventType.TOOL_CALL_END, toolCallId: part.toolCallId } as BaseEvent);
              if (part.toolName === CONTACT_TOOL) pendingContact.push({ toolCallId: part.toolCallId, args: part.input });
              break;
            }
            case "tool-result":
              send({
                type: EventType.TOOL_CALL_RESULT,
                messageId: randomUUID(),
                toolCallId: part.toolCallId,
                content: JSON.stringify(part.output ?? null),
                role: "tool",
              } as BaseEvent);
              break;
            case "tool-error":
              send({
                type: EventType.TOOL_CALL_RESULT,
                messageId: randomUUID(),
                toolCallId: part.toolCallId,
                content: JSON.stringify({ error: "Tool failed" }),
                role: "tool",
              } as BaseEvent);
              break;
            case "finish-step":
              closeReasoning();
              closeText();
              break;
            case "error":
              throw part.error;
          }
        }
        closeReasoning();
        closeText();

        if (pendingContact.length) {
          send({
            type: EventType.RUN_FINISHED,
            threadId,
            runId,
            outcome: {
              type: "interrupt",
              interrupts: pendingContact.map((p) => ({
                id: interruptIdFor(p.toolCallId),
                reason: "approval_required",
                message: "Review your message to Aditya before it's sent.",
                toolCallId: p.toolCallId,
                responseSchema: {
                  type: "object",
                  required: ["name", "email", "message"],
                  properties: {
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    subject: { type: "string" },
                    message: { type: "string" },
                  },
                },
              })),
            },
          } as BaseEvent);
        } else {
          send({ type: EventType.RUN_FINISHED, threadId, runId, outcome: { type: "success" } } as BaseEvent);
        }
      } catch (err) {
        console.error("AG-UI agent error:", err);
        const message =
          err instanceof Error && /rate limit|429/i.test(err.message)
            ? "The AI is busy right now. Please try again in a minute."
            : "Something went wrong while answering. Please try again.";
        send({ type: EventType.RUN_ERROR, message, code: "agent_error" } as BaseEvent);
      } finally {
        try {
          controller.close();
        } catch {}
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": encoder.getContentType(),
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-accel-buffering": "no",
    },
  });
}

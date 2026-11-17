/**
 * Small in-memory sliding-window rate limiter for the public agent endpoint.
 * Per server instance only (good enough to stop casual abuse of the Groq key);
 * use Upstash/Redis if you need a global limit.
 */
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_RUNS = Number(process.env.AGENT_MAX_RUNS_PER_10MIN || 25);

const hits = new Map<string, number[]>();

export function rateLimit(key: string): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_RUNS) {
    hits.set(key, recent);
    return { ok: false, retryAfter: Math.ceil((WINDOW_MS - (now - recent[0])) / 1000) };
  }
  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup so the map can't grow forever.
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return { ok: true };
}

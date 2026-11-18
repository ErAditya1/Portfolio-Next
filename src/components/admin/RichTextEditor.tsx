"use client";

/**
 * Rich-text editor for blog posts and project case studies (TipTap v3).
 *
 * - Saves HTML, which the public pages render with the `.blog-content` styles,
 *   so what you see here is what visitors see.
 * - Grouped toolbar, a floating format menu on text selection, and a floating
 *   image menu (alt text / replace / remove) when an image is selected.
 * - Images: toolbar upload, paste or drag-and-drop anywhere. Files go to
 *   Cloudinary through /api/upload and are inserted where you dropped them.
 * - Visual / HTML modes, and a distraction-free full-screen mode.
 * - Posts with a custom HTML layout (full documents, <section>/<div class=…>,
 *   <style>, <script>) open in HTML mode so their design isn't flattened.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  Bold,
  Code,
  Code2,
  FileCode2,
  Heading2,
  Heading3,
  ImageIcon,
  ImagePlus,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Loader2,
  Maximize2,
  Minimize2,
  Minus,
  PenLine,
  Pilcrow,
  Quote,
  Redo2,
  Strikethrough,
  Trash2,
  Type,
  Underline as UnderlineIcon,
  Undo2,
  UploadCloud,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  /** Cloudinary folder for uploaded images. */
  uploadFolder?: string;
  placeholder?: string;
  /** Minimum height of the writing area in px. */
  minHeight?: number;
}

/** HTML that the visual editor would flatten (layout markup, styles, scripts). */
export function isComplexHtml(html: string) {
  return /<!doctype|<html|<body|<head|<section|<style|<script|<div[^>]*\bclass=|<span[^>]*\bclass=/i.test(html);
}

/** Plain Markdown (no HTML tags) – the visual editor would show it as raw text. */
function looksLikeMarkdown(text: string) {
  return !!text.trim() && !/<[a-z][\s\S]*>/i.test(text) && /(^|\n)(#{1,6} |[-*] |\d+\. |> )|\*\*[^*]+\*\*/.test(text);
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Only image files can be added.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Images must be under 10 MB.");
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file: await readAsDataUrl(file), folder, title: file.name }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
  // Let Cloudinary pick the best format and quality for each browser.
  return String(data.url).replace("/upload/", "/upload/f_auto,q_auto/");
}

const altFromFilename = (name: string) => name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").trim();

// ─── Small UI pieces ─────────────────────────────────────────────────────────

function ToolButton({
  onClick,
  active,
  disabled,
  title,
  children,
  variant = "toolbar",
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  variant?: "toolbar" | "bubble";
}) {
  const base = variant === "bubble" ? "h-8 w-8 rounded-lg" : "h-8 w-8 rounded-lg";
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      // Keep the editor's selection when clicking toolbar buttons.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`${base} flex shrink-0 items-center justify-center transition-all duration-150 disabled:pointer-events-none disabled:opacity-25 ${
        active
          ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-500/30"
          : "text-gray-400 hover:bg-white/[0.08] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5 rounded-xl bg-white/[0.03] p-0.5 ring-1 ring-white/[0.06]">{children}</div>;
}

// ─── Editor actions shared by the toolbar and the floating menu ──────────────

function promptLink(editor: Editor) {
  const prev = editor.getAttributes("link").href as string | undefined;
  const url = window.prompt("Link URL (leave empty to remove)", prev ?? "https://");
  if (url === null) return;
  const clean = url.trim();
  if (!clean || clean === "https://") {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }
  if (/^javascript:/i.test(clean)) {
    toast.error("That link type isn't allowed.");
    return;
  }
  editor.chain().focus().extendMarkRange("link").setLink({ href: clean }).run();
}

function promptImageUrl(editor: Editor) {
  const src = window.prompt("Image URL")?.trim();
  if (!src) return;
  if (!/^https?:\/\//i.test(src)) {
    toast.error("Use an http(s) image URL.");
    return;
  }
  const alt = window.prompt("Describe the image (alt text)", "") ?? "";
  editor.chain().focus().setImage({ src, alt }).run();
}

function useRerenderOnChange(editor: Editor | null) {
  const [, force] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const rerender = () => force((n) => n + 1);
    editor.on("transaction", rerender);
    return () => {
      editor.off("transaction", rerender);
    };
  }, [editor]);
}

function Toolbar({ editor, onPickImage, uploading }: { editor: Editor; onPickImage: () => void; uploading: boolean }) {
  useRerenderOnChange(editor);
  const c = () => editor.chain().focus();
  return (
    <div className="scrollbar-slim flex items-center gap-1.5 overflow-x-auto border-b border-white/[0.06] bg-gray-900/80 px-3 py-2 backdrop-blur-md">
      <Group>
        <ToolButton title="Paragraph" active={editor.isActive("paragraph")} onClick={() => c().setParagraph().run()}>
          <Pilcrow className="h-4 w-4" />
        </ToolButton>
        <ToolButton title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => c().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => c().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="h-4 w-4" />
        </ToolButton>
      </Group>
      <Group>
        <ToolButton title="Bold (Ctrl+B)" active={editor.isActive("bold")} onClick={() => c().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </ToolButton>
        <ToolButton title="Italic (Ctrl+I)" active={editor.isActive("italic")} onClick={() => c().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </ToolButton>
        <ToolButton title="Underline (Ctrl+U)" active={editor.isActive("underline")} onClick={() => c().toggleUnderline().run()}>
          <UnderlineIcon className="h-4 w-4" />
        </ToolButton>
        <ToolButton title="Strikethrough" active={editor.isActive("strike")} onClick={() => c().toggleStrike().run()}>
          <Strikethrough className="h-4 w-4" />
        </ToolButton>
        <ToolButton title="Inline code" active={editor.isActive("code")} onClick={() => c().toggleCode().run()}>
          <Code className="h-4 w-4" />
        </ToolButton>
      </Group>
      <Group>
        <ToolButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => c().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </ToolButton>
        <ToolButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => c().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </ToolButton>
        <ToolButton title="Quote" active={editor.isActive("blockquote")} onClick={() => c().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </ToolButton>
        <ToolButton title="Code block" active={editor.isActive("codeBlock")} onClick={() => c().toggleCodeBlock().run()}>
          <Code2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton title="Divider line" onClick={() => c().setHorizontalRule().run()}>
          <Minus className="h-4 w-4" />
        </ToolButton>
      </Group>
      <Group>
        <ToolButton title="Add / edit link" active={editor.isActive("link")} onClick={() => promptLink(editor)}>
          <Link2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton title="Remove link" disabled={!editor.isActive("link")} onClick={() => c().unsetLink().run()}>
          <Link2Off className="h-4 w-4" />
        </ToolButton>
      </Group>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onPickImage}
        disabled={uploading}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3 text-xs font-semibold text-white shadow-md shadow-violet-600/25 transition hover:brightness-110 disabled:opacity-60"
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        {uploading ? "Uploading…" : "Add image"}
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => promptImageUrl(editor)}
        className="h-9 shrink-0 rounded-xl px-2.5 text-xs font-medium text-gray-400 ring-1 ring-white/[0.06] transition hover:bg-white/[0.06] hover:text-white"
      >
        From URL
      </button>
      <span className="flex-1" />
      <Group>
        <ToolButton title="Undo (Ctrl+Z)" disabled={!editor.can().undo()} onClick={() => c().undo().run()}>
          <Undo2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton title="Redo (Ctrl+Shift+Z)" disabled={!editor.can().redo()} onClick={() => c().redo().run()}>
          <Redo2 className="h-4 w-4" />
        </ToolButton>
      </Group>
    </div>
  );
}

// Module-level so BubbleMenu gets the same function on every render. A new
// function each render makes BubbleMenu reconfigure its plugin, which fires a
// transaction, which re-renders… an infinite loop.
type ShouldShowArgs = { editor: Editor; from: number; to: number };
const showTextMenu = ({ editor, from, to }: ShouldShowArgs) => from !== to && !editor.isActive("image") && !editor.isActive("codeBlock");
const showImageMenu = ({ editor }: ShouldShowArgs) => editor.isActive("image");

/** Medium-style floating menus: formatting for text, alt/replace/remove for images. */
function FloatingMenus({ editor, onReplaceImage }: { editor: Editor; onReplaceImage: () => void }) {
  // Re-render only when these values change (not on every transaction).
  useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      code: e.isActive("code"),
      h2: e.isActive("heading", { level: 2 }),
      quote: e.isActive("blockquote"),
      link: e.isActive("link"),
    }),
  });
  const c = () => editor.chain().focus();
  const shell = "flex items-center gap-0.5 rounded-xl border border-white/10 bg-gray-950/95 p-1 shadow-2xl shadow-black/50 backdrop-blur-md";

  return (
    <>
      <BubbleMenu editor={editor} pluginKey="textMenu" shouldShow={showTextMenu}>
        <div className={shell}>
          <ToolButton variant="bubble" title="Bold" active={editor.isActive("bold")} onClick={() => c().toggleBold().run()}>
            <Bold className="h-4 w-4" />
          </ToolButton>
          <ToolButton variant="bubble" title="Italic" active={editor.isActive("italic")} onClick={() => c().toggleItalic().run()}>
            <Italic className="h-4 w-4" />
          </ToolButton>
          <ToolButton variant="bubble" title="Underline" active={editor.isActive("underline")} onClick={() => c().toggleUnderline().run()}>
            <UnderlineIcon className="h-4 w-4" />
          </ToolButton>
          <ToolButton variant="bubble" title="Inline code" active={editor.isActive("code")} onClick={() => c().toggleCode().run()}>
            <Code className="h-4 w-4" />
          </ToolButton>
          <span className="mx-0.5 h-5 w-px bg-white/10" />
          <ToolButton variant="bubble" title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => c().toggleHeading({ level: 2 }).run()}>
            <Heading2 className="h-4 w-4" />
          </ToolButton>
          <ToolButton variant="bubble" title="Quote" active={editor.isActive("blockquote")} onClick={() => c().toggleBlockquote().run()}>
            <Quote className="h-4 w-4" />
          </ToolButton>
          <ToolButton variant="bubble" title="Link" active={editor.isActive("link")} onClick={() => promptLink(editor)}>
            <Link2 className="h-4 w-4" />
          </ToolButton>
        </div>
      </BubbleMenu>

      <BubbleMenu editor={editor} pluginKey="imageMenu" shouldShow={showImageMenu}>
        <div className={shell}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              const alt = window.prompt("Alt text (describe the image)", (editor.getAttributes("image").alt as string) ?? "");
              if (alt !== null) c().updateAttributes("image", { alt }).run();
            }}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-300 hover:bg-white/[0.08] hover:text-white"
          >
            <Type className="h-3.5 w-3.5" /> Alt text
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onReplaceImage}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-300 hover:bg-white/[0.08] hover:text-white"
          >
            <ImageIcon className="h-3.5 w-3.5" /> Replace
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => c().deleteSelection().run()}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-rose-300 hover:bg-rose-500/15 hover:text-rose-200"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </button>
        </div>
      </BubbleMenu>
    </>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function RichTextEditor({
  value,
  onChange,
  uploadFolder = "portfolio/blogs",
  placeholder = "Start writing your story… Paste or drop images anywhere.",
  minHeight = 460,
}: RichTextEditorProps) {
  const complex = isComplexHtml(value);
  const markdown = looksLikeMarkdown(value);
  const [mode, setMode] = useState<"visual" | "html">(complex || markdown ? "html" : "visual");
  const [uploading, setUploading] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef(false);
  const editorRef = useRef<Editor | null>(null);

  /** Upload files and insert them at `pos` (or the cursor / selected image). */
  const insertFiles = useCallback(
    async (files: File[], pos?: number) => {
      const editor = editorRef.current;
      const images = files.filter((f) => f.type.startsWith("image/"));
      if (!editor || !images.length) return;
      for (const file of images) {
        setUploading((n) => n + 1);
        const id = toast.loading(`Uploading ${file.name}…`);
        try {
          const src = await uploadToCloudinary(file, uploadFolder);
          if (replaceRef.current && editor.isActive("image")) {
            editor.chain().focus().updateAttributes("image", { src }).run();
          } else {
            const alt = window.prompt("Describe this image (alt text, helps SEO and screen readers)", altFromFilename(file.name)) ?? "";
            const chain = editor.chain().focus();
            if (typeof pos === "number") chain.insertContentAt(pos, { type: "image", attrs: { src, alt } }).run();
            else chain.setImage({ src, alt }).run();
          }
          toast.success("Image added", { id });
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Upload failed", { id });
        } finally {
          replaceRef.current = false;
          setUploading((n) => n - 1);
        }
      }
    },
    [uploadFolder]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } },
      }),
      Image.configure({ inline: false, allowBase64: false, HTMLAttributes: { loading: "lazy" } }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content: complex || markdown ? "" : value,
    editorProps: {
      attributes: {
        class: "blog-content rte-content mx-auto w-full max-w-3xl px-6 py-6 focus:outline-none",
        style: `min-height:${minHeight}px`,
        "aria-label": "Content editor",
      },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []);
        if (!files.some((f) => f.type.startsWith("image/"))) return false;
        event.preventDefault();
        void insertFiles(files);
        return true;
      },
      handleDrop: (view, event) => {
        setDragging(false);
        const files = Array.from(event.dataTransfer?.files ?? []);
        if (!files.some((f) => f.type.startsWith("image/"))) return false;
        event.preventDefault();
        const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
        void insertFiles(files, coords?.pos);
        return true;
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
  });

  useEffect(() => {
    editorRef.current = editor ?? null;
  }, [editor]);
  // Word count for the header; re-renders only when the count changes.
  const liveWords = useEditorState({
    editor,
    selector: ({ editor: e }) => (e ? (e.storage.characterCount?.words?.() as number | undefined) ?? 0 : 0),
  });

  // Esc leaves full screen; lock page scroll while it's open.
  useEffect(() => {
    if (!fullscreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFullscreen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [fullscreen]);

  const switchTo = (next: "visual" | "html") => {
    if (next === mode || !editor) return;
    if (next === "visual") {
      if (isComplexHtml(value) && !window.confirm("This content uses a custom HTML layout (sections, classes, styles). The visual editor will simplify it and remove that layout when you save. Continue?")) return;
      if (looksLikeMarkdown(value) && !window.confirm("This content is written in Markdown. The visual editor will show the Markdown symbols as plain text. Continue?")) return;
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    setMode(next);
  };

  const words = mode === "visual" ? liveWords ?? 0 : value.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const imageCount = (value.match(/<img\b/gi) ?? []).length;

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-[100] flex flex-col bg-gray-950"
          : "group/rte relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-gray-900 to-gray-950 shadow-xl shadow-black/20 transition focus-within:border-violet-500/50 focus-within:shadow-violet-500/10"
      }
    >
      {/* Header: mode switch, stats, full screen */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] bg-gradient-to-r from-violet-600/10 via-indigo-600/5 to-transparent px-3 py-2">
        <div className="flex items-center gap-2 pr-1 text-xs font-semibold text-gray-300">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow shadow-violet-500/30">
            <PenLine className="h-3.5 w-3.5" />
          </span>
          <span className="hidden sm:inline">Editor</span>
        </div>
        <div className="inline-flex rounded-xl bg-black/30 p-0.5 text-xs font-semibold ring-1 ring-white/[0.06]" role="tablist" aria-label="Editor mode">
          {(
            [
              ["visual", "Visual", PenLine],
              ["html", "HTML", FileCode2],
            ] as const
          ).map(([m, label, Icon]) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchTo(m)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                mode === m ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>
        <span className="flex-1" />
        <div className="hidden items-center gap-1.5 text-[11px] font-medium text-gray-400 sm:flex">
          <span className="rounded-full bg-white/[0.05] px-2.5 py-1 ring-1 ring-white/[0.06]">{words.toLocaleString()} words</span>
          <span className="rounded-full bg-white/[0.05] px-2.5 py-1 ring-1 ring-white/[0.06]">~{Math.max(1, Math.round(words / 220))} min read</span>
          <span className="rounded-full bg-white/[0.05] px-2.5 py-1 ring-1 ring-white/[0.06]">
            {imageCount} image{imageCount === 1 ? "" : "s"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setFullscreen((f) => !f)}
          title={fullscreen ? "Exit full screen (Esc)" : "Full screen"}
          aria-label={fullscreen ? "Exit full screen" : "Full screen"}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/[0.08] hover:text-white"
        >
          {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>

      {mode === "html" && (complex || markdown) && (
        <div className="flex items-start gap-2 border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs text-amber-200">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {complex
            ? "This content has a custom HTML layout, so it opened in HTML mode to keep its design intact."
            : "This content is written in Markdown, so it opened in source mode. Switch to Visual to rewrite it with the editor."}
        </div>
      )}

      {mode === "visual" && editor && (
        <Toolbar
          editor={editor}
          uploading={uploading > 0}
          onPickImage={() => {
            replaceRef.current = false;
            fileRef.current?.click();
          }}
        />
      )}

      <div
        className={`relative ${fullscreen ? "flex-1 overflow-y-auto scrollbar-slim" : ""} ${mode === "visual" ? "" : "hidden"}`}
        onDragEnter={(e) => e.dataTransfer.types.includes("Files") && setDragging(true)}
        onDragOver={(e) => e.dataTransfer.types.includes("Files") && e.preventDefault()}
        onDragLeave={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setDragging(false)}
      >
        <EditorContent editor={editor} />
        {editor && <FloatingMenus editor={editor} onReplaceImage={() => ((replaceRef.current = true), fileRef.current?.click())} />}
        {dragging && (
          <div className="pointer-events-none absolute inset-3 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-violet-400/70 bg-violet-500/10 text-sm font-semibold text-violet-200 backdrop-blur-[2px]">
            <UploadCloud className="h-8 w-8" />
            Drop to upload and insert here
          </div>
        )}
      </div>

      {mode === "html" && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={fullscreen ? undefined : 22}
          spellCheck={false}
          aria-label="Content HTML source"
          className={`scrollbar-slim block w-full resize-y bg-transparent px-5 py-4 font-mono text-[13px] leading-relaxed text-gray-100 placeholder-gray-600 focus:outline-none ${fullscreen ? "flex-1" : ""}`}
          placeholder="<h2>Heading</h2>&#10;<p>Write your content as HTML…</p>"
        />
      )}

      {/* Footer hints */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/[0.06] px-4 py-2 text-[11px] text-gray-500">
        <span>
          <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono">Ctrl</kbd>+<kbd className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono">B</kbd> bold
        </span>
        <span>Select text for quick formatting</span>
        <span>Click an image to edit alt text or replace it</span>
        {uploading > 0 && (
          <span className="ml-auto inline-flex items-center gap-1.5 text-violet-300">
            <Loader2 className="h-3 w-3 animate-spin" /> Uploading {uploading}…
          </span>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          void insertFiles(replaceRef.current ? files.slice(0, 1) : files);
        }}
      />
    </div>
  );
}

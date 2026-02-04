"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

import { Container } from "@/components/Container";
import { NeonHeading } from "@/components/NeonHeading";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

/* ---------------- Types ---------------- */

type FormValues = {
  title: string;
  slug: string;
  excerpt: string;
  imgFile?: FileList;
  tags: string;
  content: string;
  date?: string;
};

/* ---------------- Utils ---------------- */

function makeSlug(s = "") {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function estimateReadTime(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/* ---------------- Tag Input ---------------- */

function TagInput({
  value = "",
  onChange,
}: {
  value?: string;
  onChange: (v: string) => void;
}) {
  const [input, setInput] = useState("");

  const tags = value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  function addTag() {
    if (!input.trim()) return;
    const merged = Array.from(
      new Set([...tags, ...input.split(",").map((t) => t.trim())]),
    );
    onChange(merged.join(", "));
    setInput("");
  }

  function removeTag(i: number) {
    onChange(tags.filter((_, idx) => idx !== i).join(", "));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((t, i) => (
          <span
            key={t + i}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/6 text-white text-sm"
          >
            {t}
            <button type="button" onClick={() => removeTag(i)}>
              ✕
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          className="flex-1 rounded-md px-3 py-2 bg-white/6 border border-white/8 text-white"
          placeholder="Type tag and press Enter"
        />
        <Button type="button" onClick={addTag}>
          Add
        </Button>
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */

export default function NewBlogPage() {
  const router = useRouter();

  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      tags: "",
      content: "",
      date: new Date().toISOString().slice(0, 10),
    },
  });

  const title = watch("title") || "";
  const content = watch("content") || "";
  const tags = watch("tags") || "";

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [slugLocked, setSlugLocked] = useState(false);
  const [uploading, setUploading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  /* -------- RHF content ref (FIXED) -------- */

  const contentReg = register("content", { required: true });

  const contentRef: UseFormRegisterReturn["ref"] = contentReg.ref;
  const { ref: _omit, ...contentProps } = contentReg;

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    if (!slugLocked) {
      setValue("slug", makeSlug(title));
    }
  }, [title, slugLocked, setValue]);

  /* ---------------- Helpers ---------------- */

  function insertAtCaret(snippet: string) {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = el.value.slice(0, start) + snippet + el.value.slice(end);

    setValue("content", next);

    requestAnimationFrame(() => {
      el.focus();
      const pos = start + snippet.length;
      el.setSelectionRange(pos, pos);
    });
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreviewImage(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function onSubmit(data: FormValues) {
    try {
      setUploading(true);

      const payload = {
        ...data,
        tags: data.tags.split(",").map((t) => t.trim()),
        img: previewImage ?? "/images/blog/default.jpg",
      };

      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");

      const json = await res.json();
      router.push(json.url ?? `/blog/${data.slug}`);
    } finally {
      setUploading(false);
    }
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = estimateReadTime(content);

  /* ---------------- JSX ---------------- */

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <Container>
        <NeonHeading>Create article</NeonHeading>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid md:grid-cols-3 gap-6 mt-6"
        >
          {/* Sidebar */}
          <Card className="p-4 space-y-4">
            <div>
              <Label>Title</Label>
              <Input {...register("title", { required: true })} />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label>Slug</Label>
                <Input {...register("slug", { required: true })} />
              </div>
              <Switch checked={slugLocked} onCheckedChange={setSlugLocked} />
            </div>

            <div>
              <Label>Excerpt</Label>
              <Textarea {...register("excerpt")} rows={3} />
            </div>

            <div>
              <Label>Tags</Label>
              <TagInput value={tags} onChange={(v) => setValue("tags", v)} />
            </div>

            <div>
              <Label>Hero Image</Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
              />
            </div>

            <Separator />

            <div className="text-sm">
              Words: <b>{wordCount}</b>
              <br />
              Read time: <b>{readTime} min</b>
            </div>
          </Card>

          {/* Editor */}
          <Card className="md:col-span-2 p-4">
            <div className="grid lg:grid-cols-2 gap-4">
              <Textarea
                {...contentProps}
                ref={(el: HTMLTextAreaElement | null) => {
                  // RHF only provides a callback ref
                  contentRef(el);

                  // your local ref
                  textareaRef.current = el;
                }}
                placeholder="Write your markdown content here..."
                className="min-h-[520px] resize-none bg-black/30 text-white"
              />

              <div className="prose prose-invert max-w-none p-4 border rounded">
                {content ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                  >
                    {content}
                  </ReactMarkdown>
                ) : (
                  <span className="text-gray-400">
                    Live preview will appear here…
                  </span>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            <Button type="submit" disabled={uploading}>
              {uploading ? "Publishing…" : "Publish"}
            </Button>
          </Card>
        </form>
      </Container>
    </main>
  );
}

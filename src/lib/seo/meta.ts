import type { Metadata } from "next";
import { OWNER_NAME } from "./site";

/**
 * Metadata for a public page with its own canonical (never inherit "/" from the root layout).
 * `title` goes through the root template ("%s · Aditya Kumar") unless `absolute` is set.
 */
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  absolute?: boolean;
  type?: "website" | "profile" | "article";
  images?: { url: string; width?: number; height?: number; alt?: string }[];
}): Metadata {
  const fullTitle = opts.absolute ? opts.title : `${opts.title} · ${OWNER_NAME}`;
  return {
    title: opts.absolute ? { absolute: opts.title } : opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      title: fullTitle,
      description: opts.description,
      url: opts.path,
      siteName: OWNER_NAME,
      locale: "en_IN",
      type: opts.type || "website",
      ...(opts.images && { images: opts.images }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: opts.description,
      ...(opts.images && { images: opts.images.map((i) => i.url) }),
    },
  };
}

/** Clamp a description to ~160 chars on a word boundary. */
export function clampDescription(text: string, max = 160) {
  const clean = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:—-]+$/, "") + "…";
}

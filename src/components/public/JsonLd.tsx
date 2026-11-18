import React from "react";

interface JsonLdProps {
  data: Record<string, unknown>;
}

/** Renders JSON-LD safely: "<" is escaped so content can never close the script tag. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}

"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
  type: "project" | "blog";
  slug: string;
}

export function ViewTracker({ type, slug }: ViewTrackerProps) {
  useEffect(() => {
    // Fire-and-forget analytics ping
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, slug }),
    }).catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

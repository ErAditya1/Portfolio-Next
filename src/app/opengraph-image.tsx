import { ImageResponse } from "next/og";

export const alt = "Aditya Kumar — Full Stack Developer (Next.js, MERN), Lucknow, India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default 1200×630 share card for every page without its own image. */
export default function OpengraphImage() {
  const chips = ["Next.js", "React", "Node.js", "NestJS", "MongoDB", "PostgreSQL"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0b1020 0%, #1e1b4b 55%, #312e81 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#a5b4fc" }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#34d399" }} />
          eraditya.vercel.app
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>Aditya Kumar</div>
          <div style={{ fontSize: 44, fontWeight: 600, color: "#e0e7ff" }}>Full Stack Developer · Lucknow, India</div>
          <div style={{ fontSize: 30, color: "#c7d2fe", maxWidth: 1000 }}>
            Web apps, AI voice calling and WhatsApp automation
          </div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {chips.map((c) => (
            <div
              key={c}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                border: "2px solid rgba(165,180,252,0.5)",
                background: "rgba(99,102,241,0.18)",
                fontSize: 26,
                color: "#e0e7ff",
              }}
            >
              {c}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}

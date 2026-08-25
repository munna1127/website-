import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Aryan Tomar - Security & Systems Engineering";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#020617",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          border: "4px solid #1e293b",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              fontSize: 26,
              background: "rgba(99, 102, 241, 0.15)",
              border: "1px solid rgba(99, 102, 241, 0.4)",
              padding: "8px 24px",
              borderRadius: "9999px",
              color: "#818cf8",
              fontWeight: 600,
            }}
          >
            🛡️ Systems & Security Portfolio
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              fontSize: 68,
              fontWeight: 900,
              color: "#ffffff",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Aryan Tomar
          </h1>
          <p
            style={{
              fontSize: 28,
              color: "#94a3b8",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            Engineering Resilient Software, Threat Telemetry & POSIX Automation
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid #1e293b",
            paddingTop: "24px",
            color: "#64748b",
            fontSize: 22,
          }}
        >
          <span>🚀 Built Native on Mobile POSIX</span>
          <span>Next.js • Neon PostgreSQL • Vercel</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

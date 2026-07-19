import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, color: "white", background: "linear-gradient(135deg,#170d29,#5b21b6 58%,#db2777)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, fontWeight: 700 }}><div style={{ width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 16, background: "rgba(255,255,255,.16)" }}>R</div>ReplyPilot</div>
      <div style={{ display: "flex", flexDirection: "column" }}><div style={{ color: "#decaff", fontSize: 24, fontWeight: 700, letterSpacing: 3 }}>AI SUPPORT · HUMAN APPROVED</div><div style={{ maxWidth: 980, marginTop: 18, fontSize: 68, lineHeight: 1.05, fontWeight: 800, letterSpacing: -3 }}>Customer support that moves fast. Judgment stays human.</div></div>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#eadff5", fontSize: 24 }}><span>Live automation portfolio</span><span>Built by John Venancio</span></div>
    </div>,
    size,
  );
}

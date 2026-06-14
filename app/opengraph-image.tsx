import { ImageResponse } from "next/og";

// Social preview card (LinkedIn/WhatsApp/etc). 1200x630 is the standard OG size.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Pradumna Bajoria — Frontend Engineer";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "70px",
          background: "linear-gradient(180deg,#0b1026 0%,#3a2c54 55%,#e98a4e 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* sun */}
        <div
          style={{
            position: "absolute",
            top: 70,
            right: 130,
            width: 170,
            height: 170,
            borderRadius: 9999,
            display: "flex",
            background:
              "radial-gradient(circle,#ffe3b0 0%,#f4a04c 55%,rgba(244,160,76,0) 72%)",
          }}
        />
        {/* mountain silhouette */}
        <div
          style={{
            position: "absolute",
            left: -40,
            bottom: 0,
            width: 0,
            height: 0,
            borderLeft: "380px solid transparent",
            borderRight: "380px solid transparent",
            borderBottom: "360px solid #1b2146",
          }}
        />
        <div style={{ fontSize: 82, fontWeight: 700, lineHeight: 1 }}>Pradumna Bajoria</div>
        <div style={{ fontSize: 36, marginTop: 18, opacity: 0.92 }}>
          Frontend Engineer · React · TypeScript
        </div>
        <div style={{ fontSize: 26, marginTop: 14, opacity: 0.82 }}>
          Climb to higher ground ↗
        </div>
      </div>
    ),
    { ...size }
  );
}

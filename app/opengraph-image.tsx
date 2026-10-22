import { ImageResponse } from "next/og";
import { SITE_URL, site } from "@/data/site";

export const runtime = "edge";

export const alt = `${site.name} - Premium Construction & Building Services`;
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#111111",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            backgroundColor: "#C9A24B",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "2px",
              border: "2px solid #C9A24B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#C9A24B",
              fontSize: "56px",
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            LM
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontSize: "72px",
                fontWeight: 700,
                letterSpacing: "0.02em",
              }}
            >
              {site.name}
            </div>
            <div
              style={{
                color: "#C9A24B",
                fontSize: "28px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
              }}
            >
              {site.tagline}
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            color: "rgba(255, 255, 255, 0.4)",
            fontSize: "20px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          {SITE_URL.replace("https://", "")}
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}

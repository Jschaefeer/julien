import { ImageResponse } from "next/og";
import { DATA } from "@/data/resume";

export const runtime = "edge";

export const alt = DATA.name;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const RED_950 = "#450a0a";
const ROSE_950 = "#4c0519";
const CARD_GRADIENT = `linear-gradient(135deg, ${RED_950} 0%, #5c1020 45%, ${ROSE_950} 100%)`;

const getFontData = async () => {
  try {
    const [cabinetGrotesk, clashDisplay] = await Promise.all([
      fetch(
        new URL("../../public/fonts/CabinetGrotesk-Medium.ttf", import.meta.url)
      ).then((res) => res.arrayBuffer()),
      fetch(
        new URL("../../public/fonts/ClashDisplay-Semibold.ttf", import.meta.url)
      ).then((res) => res.arrayBuffer()),
    ]);
    return { cabinetGrotesk, clashDisplay };
  } catch (error) {
    console.error("Failed to load fonts:", error);
    return null;
  }
};

export default async function Image() {
  try {
    const fontData = await getFontData();

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            background: CARD_GRADIENT,
            padding: "64px 72px",
          }}
        >
          <div
            style={{
              fontFamily: "Clash Display",
              fontSize: 72,
              fontWeight: 600,
              lineHeight: 1.1,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              marginBottom: 20,
              textAlign: "left",
            }}
          >
            {DATA.name}
          </div>
          <div
            style={{
              fontFamily: "Cabinet Grotesk",
              fontSize: 34,
              fontWeight: 400,
              lineHeight: 1.45,
              color: "rgba(255, 255, 255, 0.78)",
              maxWidth: 920,
              textAlign: "left",
            }}
          >
            {DATA.description}
          </div>
        </div>
      ),
      {
        ...size,
        fonts: fontData
          ? [
              {
                name: "Cabinet Grotesk",
                data: fontData.cabinetGrotesk,
                weight: 400,
                style: "normal",
              },
              {
                name: "Clash Display",
                data: fontData.clashDisplay,
                weight: 600,
                style: "normal",
              },
            ]
          : undefined,
      }
    );
  } catch (error) {
    console.error("Error generating OpenGraph image:", error);
    return new Response(
      `Failed to generate image: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 }
    );
  }
}

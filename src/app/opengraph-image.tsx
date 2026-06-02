import { ImageResponse } from "next/og";

import { getBrandTheme, resolveColorScheme } from "@/lib/brand-theme";
import { getGeistFontData } from "@/lib/og-fonts";
import { SITE } from "@/lib/seo";
import { DATA } from "@/data/resume";

export const alt = SITE.title;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  try {
    const [fontData, colorScheme] = await Promise.all([
      getGeistFontData(),
      resolveColorScheme(),
    ]);
    const theme = getBrandTheme(colorScheme);
    const fontFamily = fontData ? "Geist" : "sans-serif";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            backgroundColor: theme.background,
            padding: "72px 80px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily,
                fontSize: 64,
                fontWeight: 600,
                lineHeight: 1.1,
                color: theme.foreground,
                letterSpacing: "-0.04em",
                marginBottom: 16,
              }}
            >
              {SITE.title}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily,
                fontSize: 32,
                fontWeight: 400,
                lineHeight: 1.35,
                color: theme.mutedForeground,
                marginBottom: 28,
              }}
            >
              {`by ${DATA.name}`}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily,
                fontSize: 26,
                fontWeight: 400,
                lineHeight: 1.55,
                color: theme.mutedForeground,
                maxWidth: 920,
              }}
            >
              {DATA.description}
            </div>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: fontData
          ? [
              {
                name: "Geist",
                data: fontData.regular,
                weight: 400,
                style: "normal",
              },
              {
                name: "Geist",
                data: fontData.semibold,
                weight: 600,
                style: "normal",
              },
            ]
          : undefined,
      },
    );
  } catch (error) {
    console.error("Error generating OpenGraph image:", error);
    return new Response(
      `Failed to generate image: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 },
    );
  }
}

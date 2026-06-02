import { headers } from "next/headers";

export type ColorScheme = "light" | "dark";

/** Hex values aligned with globals.css oklch tokens */
export const BRAND_THEME = {
  light: {
    background: "#ffffff",
    foreground: "#252525",
    mutedForeground: "#737373",
    border: "#ebebeb",
  },
  dark: {
    background: "#2e2e2e",
    foreground: "#fafafa",
    mutedForeground: "#a3a3a3",
    border: "rgba(255, 255, 255, 0.1)",
  },
} as const;

export function getBrandTheme(scheme: ColorScheme = "light") {
  return BRAND_THEME[scheme];
}

export async function resolveColorScheme(): Promise<ColorScheme> {
  try {
    const headersList = await headers();
    const hint = headersList.get("Sec-CH-Prefers-Color-Scheme");

    if (hint === "dark" || hint === "light") {
      return hint;
    }
  } catch {
    // headers() unavailable outside a request context
  }

  return "light";
}

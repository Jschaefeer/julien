import Footer from "@/components/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { createMetadata, SITE } from "@/lib/seo";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./nil-print-sheet.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  ...createMetadata({
    title: SITE.title,
    description: SITE.description,
  }),
  title: {
    default: SITE.title,
    template: `%s | ${DATA.name}`,
  },
  applicationName: SITE.title,
  category: "education",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={cn(
          "min-h-screen overflow-x-hidden bg-background font-sans antialiased relative",
          geist.variable,
          geistMono.variable
        )}
      >
        <TooltipProvider delayDuration={0}>
          <div className="site-shell relative z-0 mx-auto w-full max-w-3xl px-6 py-12 sm:py-24">
            {children}
            <Footer />
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}

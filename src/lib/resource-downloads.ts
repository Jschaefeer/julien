export type ResourceDownload = {
  href: string;
  label: string;
  filename: string;
};

const NIL_FLYER_PDF = "/NIL Flyer.pdf";
const NIL_MONEY_GUIDE_PDF =
  "/What to do with all this money_ _ The NIL Money Management Guide.pdf";

export const HARD_COVER_DRIVE_URL =
  "https://drive.google.com/drive/folders/1cvHAhskve7ntWFaSYXl_dhGYpWnAZ0oi?usp=sharing";

export const RESOURCE_DOWNLOADS: Record<string, readonly ResourceDownload[]> = {
  "nil-dispatch": [
    {
      href: NIL_FLYER_PDF,
      label: "Download flyer",
      filename: "NIL-Flyer.pdf",
    },
  ],
  "what-to-do-with-all-this-money": [
    {
      href: NIL_MONEY_GUIDE_PDF,
      label: "Download guide",
      filename: "NIL-Money-Management-Guide.pdf",
    },
  ],
};

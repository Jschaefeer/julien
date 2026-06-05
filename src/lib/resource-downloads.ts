export type ResourceDownload = {
  href: string;
  label: string;
  filename: string;
};

const NIL_FLYER_PAGE_1 = "/NIL Flyer pg.1.jpg";
const NIL_FLYER_PAGE_2 = "/NIL Flyer pg. 2.jpg";
const NIL_MONEY_GUIDE_PDF =
  "/What to do with all this money_ _ The NIL Money Management Guide.pdf";

export const HARD_COVER_DRIVE_URL =
  "https://drive.google.com/drive/folders/1cvHAhskve7ntWFaSYXl_dhGYpWnAZ0oi?usp=sharing";

export const NIL_FLYER_DOWNLOADS: readonly ResourceDownload[] = [
  {
    href: NIL_FLYER_PAGE_1,
    label: "Download flyer",
    filename: "NIL-Flyer-page-1.jpg",
  },
  {
    href: NIL_FLYER_PAGE_2,
    label: "Download flyer",
    filename: "NIL-Flyer-page-2.jpg",
  },
];

export const RESOURCE_DOWNLOADS: Record<string, readonly ResourceDownload[]> = {
  "what-to-do-with-all-this-money": [
    {
      href: NIL_MONEY_GUIDE_PDF,
      label: "Download guide",
      filename: "NIL-Money-Management-Guide.pdf",
    },
  ],
};

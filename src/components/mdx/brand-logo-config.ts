export const cardLogos = new Set(["amexgold", "bankofamerica-card", "chase-card"]);

export const logoPadding: Record<string, string> = {
  americanexpress: "p-0",
  bankofamerica: "p-0.5",
  fidelity: "p-0.5",
  marcus: "p-0",
  robinhood: "p-1.5",
  wealthfront: "p-1.5",
};


export const logoContainerClass: Record<string, string> = {
  amexgold: "",
  "bankofamerica-card": "",
  "chase-card": "",
  coinbase: "border-[#0052FF] bg-[#0052FF] p-0",
  marcus: "border-[#7399C6] bg-[#7399C6] p-0",
  robinhood: "border-[#00C805] bg-[#00C805]",
};

export const logoSrc: Record<string, string> = {
  americanexpress: "/logos/americanexpress.png",
  amexgold: "/logos/amexgold.png",
  "bankofamerica-card": "/logos/bankofamerica-card.png",
  "chase-card": "/logos/chase-freedom-unlimited.jpg",
  marcus: "/logos/marcus.png",
};

export const logoImgClass: Record<string, string> = {
  marcus: "object-cover object-center",
};

export function isCardLogo(logo: string) {
  return cardLogos.has(logo);
}

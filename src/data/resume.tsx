import { HomeIcon, MailIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Julian Palmer",
  fullName: "Julian Alexander Palmer",
  initials: "JP",
  url: "https://nilmoneyguide.com",
  tags: ["NIL", "Financial Literacy", "Sports Business", "Content"],
  description:
    "Help college athletes understand and protect their money.",
  summary:
    "Julian Palmer creates financial literacy content for college athletes navigating NIL deals, contracts, and sudden income. Through **The NIL Dispatch**, he breaks down money management into clear, actionable guidance so athletes can protect what they earn.",
  avatarUrl: "/profile_pic.jpeg",
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/resources", icon: NotebookIcon, label: "Resources" },
    { href: "mailto:jpalmer413@outlook.com", icon: MailIcon, label: "Contact" },
  ],
  featuredContent: {
    title: "The NIL Dispatch",
    label: "NIL Guide",
    slug: "nil-dispatch",
    cost: "Free",
    audience: "NIL Athletes",
    pillars: "5",
    readTime: "10 min",
  },
  featuredResources: [
    {
      type: "Guide",
      title: "What To Do With All This Money?",
      description:
        "NIL money management: 5 pillars, 10 minutes, no cost",
      slug: "what-to-do-with-all-this-money",
    },
  ],
  contact: {
    email: "jpalmer413@outlook.com",
  },
} as const;

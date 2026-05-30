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
  education: [
    {
      school: "Isenberg School of Management, UMass Amherst",
      degree:
        "Bachelor of Business Administration - BBA, Finance and Financial Management Services",
      start: "Sep 2019",
      end: "May 2023",
      logo: "/logos/isenberg.jpg",
      logoFill: "#881c1c",
    },
  ],
  experience: [
    {
      role: "Corporate Finance - FCM",
      company: "JPMorganChase",
      employmentType: "Full-time",
      start: "Aug 2024",
      end: "Present",
      logo: "/logos/jpmorgan.jpg",
      logoFill: "#2d1a0e",
      description:
        "Support executives with financial and operational analysis to drive strategic decision-making and business performance improvements. Analyze process efficiency, data trends, and performance metrics to identify opportunities for operational optimization. Prepare ad hoc financial reports, KPI analyses, and executive presentations.",
    },
    {
      role: "Mergers and Acquisitions - F&BM",
      company: "J.P. Morgan",
      employmentType: "Full-time",
      start: "Jul 2023",
      end: "Aug 2024",
      logo: "/logos/jpmorgan.jpg",
      logoFill: "#2d1a0e",
      description:
        "Managed daily pipeline updates and produced weekly revenue and forecast reports for M&A senior leadership. Delivered market share, productivity, and competitive analyses using Dealogic across 12 industry sectors. Prepared executive-ready materials for management meetings, business reviews, and planning cycles. Assisted the Global Head of M&A in preparation for board events by creating and facilitating detailed client activity reports.",
    },
  ],
  avatarUrl: "/profile_pic_1.jpeg",
  avatarUrls: ["/profile_pic_1.jpeg", "/profile_pic_2.jpeg"],
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
      audience: "NIL Athletes",
      pillars: "5",
      readTime: "10 min",
      cost: "Free",
    },
  ],
  contact: {
    email: "jpalmer413@outlook.com",
  },
} as const;

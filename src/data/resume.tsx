import { HomeIcon, NotebookIcon, UserIcon } from "lucide-react";

export const DATA = {
  name: "Julian Palmer",
  fullName: "Julian Alexander Palmer",
  initials: "JP",
  url: "https://nilmoneyguide.com",
  tags: ["NIL", "Financial Literacy", "Sports Business", "Content"],
  description:
    "Free NIL financial literacy for college athletes. Guides to manage deals, taxes, and protect your money.",
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
  sports: [
    {
      name: "New York Knicks",
      detail: "Lifelong fan",
      logo: "/logos/knicks.svg",
      logoFill: "#006BB6",
      logoImageClassName: "object-contain scale-90 p-1",
    },
    {
      name: "New York Yankees",
      detail: "Lifelong fan",
      logo: "/logos/yankees.svg",
      logoClassName: "bg-white dark:bg-white",
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
    { href: "/about", icon: UserIcon, label: "About" },
  ],
  featuredContent: {
    title: "The NIL Dispatch",
    label: "Checklist",
    slug: "nil-dispatch",
    description:
      "A step-by-step checklist to track every deal, keep NIL income in a separate account, and set aside 20–30% for taxes before you spend. Covers FDIC insurance, quarterly tax payments, credit basics, and how to vet the CPA, lawyer, and advisor on your team.",
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
        "Walk through five pillars of NIL money management: what's coming in, where it's going, who handles it, tax obligations, and planning beyond your playing career. Learn to spot bad actors and unqualified advice before they cost you—about ten minutes, zero cost.",
      slug: "what-to-do-with-all-this-money",
      audience: "NIL Athletes",
      pillars: "5",
      readTime: "10 min",
      cost: "Free",
    },
  ],
  contact: {
    email: "jpalmer413@outlook.com",
    linkedin: "https://www.linkedin.com/in/julian-palmer/",
    instagram: "https://www.instagram.com/jpalm3r/",
  },
} as const;

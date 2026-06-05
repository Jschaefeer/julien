import { HomeIcon, NotebookIcon } from "lucide-react";
// import { UserIcon } from "lucide-react";

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
    // { href: "/about", icon: UserIcon, label: "About" },
  ],
  featuredContent: {
    title: "The Nil dispatch",
    label: "Checklist",
    slug: "nil-dispatch",
    description:
      "A step-by-step checklist designed to help you, the athlete, empower yourself through financial knowledge. This guide helps you start asking the right questions. Without a basic understanding of your money, you can be manipulated, scammed, or put in financially compromising situations. The goal is simple: to equip you with the awareness, confidence, and tools needed to protect what you've earned and build the future you deserve.",
    cost: "Free",
    audience: "NIL Athletes",
    pillars: "5",
    readTime: "10 min",
  },
  featuredResources: [
    {
      type: "Guide",
      title: "The Money Journey",
      description:
        "This section takes things a step further by providing a deeper look into the core pillars of NIL money management. What's coming in? Where is it going? Who is handling it? What are the tax implications?\n\nThe more you earn, the more important it becomes to understand the systems surrounding your finances. This guide is designed to help you move beyond simply making money and toward managing it with purpose. By developing a clear understanding of cash flow, taxes, budgeting, savings, investments, and your professional support team, you'll be better equipped to make informed decisions, avoid costly mistakes, and turn today's opportunities into long-term financial security.",
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

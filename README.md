# The NIL Dispatch

Personal site and resource hub for **Julian Palmer** — financial literacy content built for college athletes navigating NIL deals, contracts, and sudden income.

**Live:** [nilmoneyguide.com](https://nilmoneyguide.com)

## What's here

- A homepage with bio, experience, and featured guides
- **The NIL Dispatch** — a practical guide to protecting and managing NIL money
- **What To Do With All This Money?** — five pillars of money management in about ten minutes
- A printable NIL checklist for athletes who want something to keep on hand
- MDX-powered articles with expandable tables, code blocks, and rich formatting

## Getting started

Requires Node.js 18+ and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Other useful commands:

```bash
pnpm build    # production build
pnpm start    # serve production build
pnpm lint     # run ESLint
```

## Project structure

```
content/          MDX articles (The NIL Dispatch, guides)
src/app/          Next.js App Router pages
src/components/   UI, sections, and MDX components
src/data/         Site content and metadata
```

## Stack

- [Next.js](https://nextjs.org) 16 · [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) 4
- [content-collections](https://www.content-collections.dev) for MDX
- [Motion](https://motion.dev) for animations
- [Radix UI](https://www.radix-ui.com) + [shadcn/ui](https://ui.shadcn.com) patterns

## Contact

Questions or feedback? Reach Julian at [jpalmer413@outlook.com](mailto:jpalmer413@outlook.com).

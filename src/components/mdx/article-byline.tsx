import { ChecklistPrintButton } from "@/components/checklist-print-button";
import Link from "next/link";
import { DATA } from "@/data/resume";

type ArticleBylineProps = {
  title: string;
  author?: string;
  printChecklist?: boolean;
};

export function ArticleByline({
  title,
  author = DATA.fullName,
  printChecklist = false,
}: ArticleBylineProps) {
  return (
    <div className="not-prose mb-8">
      <p className="flex flex-wrap items-baseline gap-x-1.5 text-sm leading-snug">
        <span className="font-medium text-foreground/90">{title}</span>
        <span className="text-muted-foreground/40" aria-hidden="true">
          ·
        </span>
        <span className="text-muted-foreground/70">
          <span className="font-normal">By </span>
          <Link
            href="/about"
            className="font-medium text-foreground/75 underline decoration-muted-foreground/30 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground/50"
          >
            {author}
          </Link>
        </span>
      </p>
      {printChecklist ? (
        <ChecklistPrintButton className="mt-4 w-full justify-center sm:hidden" />
      ) : null}
    </div>
  );
}

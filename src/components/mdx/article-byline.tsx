import {
  ResourceArticleActions,
  type ResourceArticleActionsVariant,
} from "@/components/resource-article-actions";
// import Link from "next/link";
import { DATA } from "@/data/resume";

type ArticleBylineProps = {
  title: string;
  author?: string;
  actions?: ResourceArticleActionsVariant;
};

export function ArticleByline({
  title,
  author = DATA.fullName,
  actions,
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
          {/* <Link
            href="/about"
            className="font-medium text-money-green underline decoration-money-green/35 underline-offset-4 transition-colors hover:text-money-green hover:decoration-money-green/60"
          >
            {author}
          </Link> */}
          <span className="font-medium text-money-green">{author}</span>
        </span>
      </p>
      {actions ? (
        <div className="sm:hidden">
          <ResourceArticleActions variant={actions} />
        </div>
      ) : null}
    </div>
  );
}

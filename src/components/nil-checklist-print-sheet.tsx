import { MDXContent } from "@content-collections/mdx/react";
import { NilChecklistArticle } from "@/components/nil-checklist-article";
import { NilChecklistInput } from "@/components/mdx/nil-checklist-input";
import { mdxComponents } from "@/mdx-components";

type NilChecklistPrintSheetProps = {
  mdx: string;
};

/** Print-only clone of the live checklist — same MDX + styles as the page. */
export function NilChecklistPrintSheet({ mdx }: NilChecklistPrintSheetProps) {
  return (
    <div className="nil-print-sheet" aria-hidden>
      <NilChecklistArticle className="nil-checklist prose w-full max-w-none text-pretty font-sans leading-relaxed text-muted-foreground mt-0">
        <MDXContent
          code={mdx}
          components={{ ...mdxComponents, input: NilChecklistInput }}
        />
      </NilChecklistArticle>
    </div>
  );
}

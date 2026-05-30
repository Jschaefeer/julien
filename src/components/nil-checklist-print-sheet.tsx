import { MDXContent } from "@content-collections/mdx/react";
import { NilChecklistArticle } from "@/components/nil-checklist-article";
import { NilChecklistInput } from "@/components/mdx/nil-checklist-input";
import { NilPrintSectionGrid } from "@/components/nil-print-section-grid";
import { DATA } from "@/data/resume";
import { mdxComponents } from "@/mdx-components";

type NilChecklistPrintSheetProps = {
  mdx: string;
};

/** Print-only layout — masthead + 2×2 section grid from live MDX. */
export function NilChecklistPrintSheet({ mdx }: NilChecklistPrintSheetProps) {
  return (
    <div className="nil-print-sheet" aria-hidden>
      <header className="nil-print-masthead">
        <div className="nil-print-masthead-grid">
          <div>
            <p className="nil-print-kicker">NIL Athlete Financial Checklist</p>
            <h1 className="nil-print-title">The NIL Dispatch</h1>
          </div>
          <div className="nil-print-masthead-meta">
            <p className="nil-print-author">{DATA.fullName}</p>
            <p className="nil-print-url">{DATA.url.replace(/^https?:\/\//, "")}</p>
          </div>
        </div>
      </header>

      <NilPrintSectionGrid>
        <NilChecklistArticle
          printOnly
          className="nil-checklist--print w-full max-w-none mt-0"
        >
          <MDXContent
            code={mdx}
            components={{ ...mdxComponents, input: NilChecklistInput }}
          />
        </NilChecklistArticle>
      </NilPrintSectionGrid>

      <footer className="nil-print-footer">
        <p>
          Protect what you earn. Ask the right questions. Spot the red flags.
        </p>
      </footer>
    </div>
  );
}

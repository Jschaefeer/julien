import { ChecklistPrintButton } from "@/components/checklist-print-button";
import { ResourceBundleDownloadButton } from "@/components/resource-bundle-download-button";
import { ResourceDownloadButton } from "@/components/resource-download-button";
import { NIL_FLYER_DOWNLOADS, RESOURCE_DOWNLOADS } from "@/lib/resource-downloads";
import { cn } from "@/lib/utils";

export type ResourceArticleActionsVariant =
  | "nil-dispatch"
  | "what-to-do-with-all-this-money";

export function isResourceArticleActionsVariant(
  slug: string,
): slug is ResourceArticleActionsVariant {
  return slug === "nil-dispatch" || slug === "what-to-do-with-all-this-money";
}

type ResourceArticleActionsProps = {
  variant: ResourceArticleActionsVariant;
  className?: string;
};

export function ResourceArticleActions({
  variant,
  className,
}: ResourceArticleActionsProps) {
  const isNilChecklist = variant === "nil-dispatch";
  const downloads = RESOURCE_DOWNLOADS[variant] ?? [];

  return (
    <div
      className={cn(
        "no-print mt-4 flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap",
        className,
      )}
    >
      {isNilChecklist ? (
        <ResourceBundleDownloadButton
          downloads={NIL_FLYER_DOWNLOADS}
          label="Download flyer"
        />
      ) : null}
      {downloads.map((download) => (
        <ResourceDownloadButton key={download.href} download={download} />
      ))}
      {isNilChecklist ? <ChecklistPrintButton /> : null}
    </div>
  );
}

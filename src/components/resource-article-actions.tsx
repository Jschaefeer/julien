import { ResourceDownloadButton } from "@/components/resource-download-button";
import { RESOURCE_DOWNLOADS } from "@/lib/resource-downloads";
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
  const downloads = RESOURCE_DOWNLOADS[variant] ?? [];

  return (
    <div
      className={cn(
        "no-print mt-4 flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap",
        className,
      )}
    >
      {downloads.map((download) => (
        <ResourceDownloadButton key={download.href} download={download} />
      ))}
    </div>
  );
}

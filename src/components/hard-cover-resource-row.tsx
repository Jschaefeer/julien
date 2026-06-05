import { Badge } from "@/components/ui/badge";
import {
  accentListChevron,
  accentListTitle,
  resourcesListIndex,
} from "@/lib/accent-classes";
import { RESOURCE_DOWNLOADS } from "@/lib/resource-downloads";
import { BookOpen, ChevronRight } from "lucide-react";

const hardCoverDownload =
  RESOURCE_DOWNLOADS["what-to-do-with-all-this-money"][0];

export function HardCoverResourceRow() {
  return (
    <a
      href={encodeURI(hardCoverDownload.href)}
      download={hardCoverDownload.filename}
      aria-label="Download Hard cover"
      className="flex items-start gap-x-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <span className={resourcesListIndex} aria-hidden>
        <BookOpen className="size-4 stroke-[2.5]" />
      </span>
      <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
        <p className="tracking-tight text-lg font-medium">
          <span className={accentListTitle}>
            Hard cover
            <ChevronRight className={accentListChevron} aria-hidden />
          </span>
        </p>
        <Badge variant="outline" className="mt-0.5 shrink-0">
          Print edition
        </Badge>
      </div>
    </a>
  );
}

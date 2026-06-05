import {
  accentPillIcon,
  resourceActionButton,
  resourceActionButtonLabel,
} from "@/lib/accent-classes";
import type { ResourceDownload } from "@/lib/resource-downloads";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";

type ResourceDownloadButtonProps = {
  download: ResourceDownload;
  className?: string;
};

export function ResourceDownloadButton({
  download,
  className,
}: ResourceDownloadButtonProps) {
  return (
    <a
      href={encodeURI(download.href)}
      download={download.filename}
      aria-label={download.label}
      className={cn("no-print", resourceActionButton, className)}
    >
      <Download className={cn("size-4", accentPillIcon)} aria-hidden />
      <span className={resourceActionButtonLabel}>{download.label}</span>
    </a>
  );
}

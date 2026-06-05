"use client";

import {
  accentPillIcon,
  resourceActionButton,
  resourceActionButtonLabel,
} from "@/lib/accent-classes";
import type { ResourceDownload } from "@/lib/resource-downloads";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";

type ResourceBundleDownloadButtonProps = {
  downloads: readonly ResourceDownload[];
  label: string;
  className?: string;
};

function triggerDownload({ href, filename }: ResourceDownload) {
  const link = document.createElement("a");
  link.href = encodeURI(href);
  link.download = filename;
  link.click();
}

export function ResourceBundleDownloadButton({
  downloads,
  label,
  className,
}: ResourceBundleDownloadButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn("no-print", resourceActionButton, className)}
      onClick={() => {
        downloads.forEach((download, index) => {
          window.setTimeout(() => triggerDownload(download), index * 300);
        });
      }}
    >
      <Download className={cn("size-4", accentPillIcon)} aria-hidden />
      <span className={resourceActionButtonLabel}>{label}</span>
    </button>
  );
}

import { Badge } from "@/components/ui/badge";

type ResourcesComingSoonRowProps = {
  index: number;
  placeholderTitle?: string;
};

export function ResourcesComingSoonRow({
  index,
  placeholderTitle = "NIL Tax & Quarterly Payments",
}: ResourcesComingSoonRowProps) {
  return (
    <div className="flex items-start gap-x-2">
      <span className="text-xs font-mono tabular-nums font-medium mt-[5px]">
        {String(index).padStart(2, "0")}.
      </span>
      <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
        <p
          className="truncate tracking-tight text-lg font-medium blur-[6px] opacity-40 select-none pointer-events-none"
          aria-hidden="true"
        >
          {placeholderTitle}
        </p>
        <Badge variant="outline" className="mt-0.5 shrink-0">
          Coming soon
        </Badge>
      </div>
    </div>
  );
}

import Link from "next/link";
import type { IssueAnalysis } from "@/types";
import { formatShortTimestamp } from "@/utils/date";

export function AnalysisRow({ item }: { item: IssueAnalysis }) {
  const updated = formatShortTimestamp(item.updatedAt);

  return (
    <Link
      href={`/analyses/${item.id}`}
      className="flex w-full items-start gap-3 rounded-md px-2 py-2 text-left transition-colors duration-150 outline-none hover:bg-hover focus-visible:ring-2 focus-visible:ring-foreground/20"
    >
      <span className="mt-0.5 shrink-0 font-mono text-xs text-muted">
        {item.issueNumber}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm text-foreground">{item.title}</span>
        <span className="mt-0.5 block truncate text-xs text-muted">
          {item.status}
          {updated ? ` · ${updated}` : ""}
        </span>
      </span>
    </Link>
  );
}

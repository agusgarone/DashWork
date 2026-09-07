"use client";

import { Check, Circle, CircleDot } from "lucide-react";
import type { BacklogItem } from "@/types";
import { cn } from "@/utils/cn";

type BacklogRowProps = {
  item: BacklogItem;
  onClick: (id: string) => void;
};

function StatusIcon({ status }: { status: BacklogItem["status"] }) {
  if (status === "Done") {
    return <Check size={14} strokeWidth={1.75} />;
  }
  if (status === "In progress") {
    return <CircleDot size={14} strokeWidth={1.75} />;
  }
  return <Circle size={14} strokeWidth={1.75} />;
}

export function BacklogRow({ item, onClick }: BacklogRowProps) {
  const done = item.status === "Done";
  const preview = item.description?.trim();

  return (
    <button
      type="button"
      onClick={() => onClick(item.id)}
      className="flex w-full items-start gap-3 rounded-md px-2 py-2 text-left transition-colors duration-150 hover:bg-hover"
    >
      <span
        className={cn(
          "mt-0.5 shrink-0 text-muted",
          item.status === "In progress" && "text-foreground",
        )}
      >
        <StatusIcon status={item.status} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span
            className={cn(
              "truncate text-sm text-foreground",
              done && "text-muted",
            )}
          >
            {item.title}
          </span>
          <span className="shrink-0 text-xs text-muted">{item.estimatedTime}</span>
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted">
          {item.category}
          {preview ? ` · ${preview}` : ""}
        </span>
      </span>
    </button>
  );
}

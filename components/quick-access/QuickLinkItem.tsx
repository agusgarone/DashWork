"use client";

import { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { LinkGlyph } from "@/components/quick-access/linkIcons";
import type { QuickLink } from "@/types";
import { cn } from "@/utils/cn";

type QuickLinkItemProps = {
  link: QuickLink;
  onEdit: (link: QuickLink) => void;
  onDelete: (id: string) => void;
  onDragStart: (index: number) => void;
  onDrop: (index: number) => void;
  onDragEnd: () => void;
  index: number;
  isDragging: boolean;
};

export function QuickLinkItem({
  link,
  onEdit,
  onDelete,
  onDragStart,
  onDrop,
  onDragEnd,
  index,
  isDragging,
}: QuickLinkItemProps) {
  const [over, setOver] = useState(false);
  const initial = link.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", String(index));
        onDragStart(index);
      }}
      onDragEnd={onDragEnd}
      onDragOver={(event) => {
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setOver(false);
        onDrop(index);
      }}
      className={cn(
        "group relative flex cursor-grab items-center rounded-md border border-border bg-surface transition-colors duration-150 active:cursor-grabbing",
        isDragging && "opacity-40",
        over && "border-foreground/40 bg-hover",
      )}
    >
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        draggable={false}
        className="flex items-center gap-2 px-2.5 py-1.5 pr-16 text-sm text-foreground"
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border border-border text-[10px] font-medium text-muted">
          <LinkGlyph name={link.icon} fallback={initial} />
        </span>
        <span className="max-w-[140px] truncate">{link.name}</span>
        <span className="text-muted" aria-hidden="true">
          ↗
        </span>
      </a>
      <div className="absolute right-1 flex opacity-100 transition-opacity duration-150 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <IconButton
          label={`Edit ${link.name}`}
          className="h-7 w-7"
          onClick={() => onEdit(link)}
        >
          <Pencil size={13} strokeWidth={1.75} />
        </IconButton>
        <IconButton
          label={`Delete ${link.name}`}
          className="h-7 w-7"
          onClick={() => onDelete(link.id)}
        >
          <Trash size={13} strokeWidth={1.75} />
        </IconButton>
      </div>
    </div>
  );
}

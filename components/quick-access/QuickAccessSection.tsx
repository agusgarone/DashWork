"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { LinkFormDialog } from "@/components/quick-access/LinkFormDialog";
import { QuickLinkItem } from "@/components/quick-access/QuickLinkItem";
import { useLinks, type LinkDraft } from "@/hooks/useLinks";
import type { QuickLink } from "@/types";

export function QuickAccessSection() {
  const { links, addLink, updateLink, deleteLink, reorderLinks } = useLinks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<QuickLink | null>(null);
  const dragIndex = useRef<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (link: QuickLink) => {
    setEditing(link);
    setDialogOpen(true);
  };

  const handleSubmit = (draft: LinkDraft) => {
    if (editing) {
      updateLink(editing.id, draft);
    } else {
      addLink(draft);
    }
  };

  return (
    <Section
      title="Quick Access"
      action={
        <Button size="sm" onClick={openCreate}>
          <Plus size={14} strokeWidth={1.75} />
          Add link
        </Button>
      }
    >
      <div className="flex flex-wrap gap-2">
        {links.map((link, index) => (
          <QuickLinkItem
            key={link.id}
            link={link}
            index={index}
            isDragging={draggingIndex === index}
            onEdit={openEdit}
            onDelete={deleteLink}
            onDragStart={(from) => {
              dragIndex.current = from;
              setDraggingIndex(from);
            }}
            onDrop={(to) => {
              if (dragIndex.current !== null) {
                reorderLinks(dragIndex.current, to);
              }
              dragIndex.current = null;
              setDraggingIndex(null);
            }}
            onDragEnd={() => {
              dragIndex.current = null;
              setDraggingIndex(null);
            }}
          />
        ))}
      </div>
      {dialogOpen ? (
        <LinkFormDialog
          key={editing?.id ?? "new"}
          open
          link={editing}
          onClose={() => {
            setDialogOpen(false);
            setEditing(null);
          }}
          onSubmit={handleSubmit}
        />
      ) : null}
    </Section>
  );
}

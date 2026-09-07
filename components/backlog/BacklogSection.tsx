"use client";

import { Plus } from "lucide-react";
import { BacklogFilters } from "@/components/backlog/BacklogFilters";
import { BacklogItemPanel } from "@/components/backlog/BacklogItemPanel";
import { BacklogRow } from "@/components/backlog/BacklogRow";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import type { BacklogDraft } from "@/hooks/useBacklog";
import type { BacklogItem, BacklogSort } from "@/types";
import type { CategoryFilter, TimeFilter } from "@/utils/backlog";

export type BacklogPanelState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; id: string };

type BacklogSectionProps = {
  items: BacklogItem[];
  visibleItems: BacklogItem[];
  query: string;
  onQueryChange: (value: string) => void;
  timeFilter: TimeFilter;
  onTimeFilterChange: (value: TimeFilter) => void;
  categoryFilter: CategoryFilter;
  onCategoryFilterChange: (value: CategoryFilter) => void;
  sort: BacklogSort;
  onSortChange: (value: BacklogSort) => void;
  onAdd: (draft: BacklogDraft) => void;
  onUpdate: (id: string, draft: BacklogDraft) => void;
  onDelete: (id: string) => void;
  panel: BacklogPanelState;
  onPanelChange: (panel: BacklogPanelState) => void;
};

export function BacklogSection({
  items,
  visibleItems,
  query,
  onQueryChange,
  timeFilter,
  onTimeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sort,
  onSortChange,
  onAdd,
  onUpdate,
  onDelete,
  panel,
  onPanelChange,
}: BacklogSectionProps) {
  const editing =
    panel.mode === "edit"
      ? items.find((item) => item.id === panel.id)
      : undefined;

  return (
    <Section
      title="Backlog"
      action={
        <Button size="sm" onClick={() => onPanelChange({ mode: "create" })}>
          <Plus size={14} strokeWidth={1.75} />
          Add item
        </Button>
      }
    >
      <BacklogFilters
        query={query}
        onQueryChange={onQueryChange}
        timeFilter={timeFilter}
        onTimeFilterChange={onTimeFilterChange}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={onCategoryFilterChange}
        sort={sort}
        onSortChange={onSortChange}
      />
      {visibleItems.length === 0 ? (
        <p className="px-2 py-6 text-sm text-muted">No matching items.</p>
      ) : (
        <div className="flex flex-col">
          {visibleItems.map((item) => (
            <BacklogRow
              key={item.id}
              item={item}
              onClick={(id) => onPanelChange({ mode: "edit", id })}
            />
          ))}
        </div>
      )}
      <BacklogItemPanel
        key={panel.mode === "edit" ? panel.id : panel.mode}
        open={panel.mode !== "closed"}
        mode={panel.mode === "create" ? "create" : "edit"}
        item={editing}
        onClose={() => onPanelChange({ mode: "closed" })}
        onSave={(draft) => {
          if (panel.mode === "edit") {
            onUpdate(panel.id, draft);
          } else {
            onAdd(draft);
          }
        }}
        onDelete={onDelete}
      />
    </Section>
  );
}

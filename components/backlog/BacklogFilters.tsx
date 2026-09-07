"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { BacklogSort } from "@/types";
import {
  BACKLOG_CATEGORIES,
  ESTIMATED_TIMES,
} from "@/types";
import type { CategoryFilter, TimeFilter } from "@/utils/backlog";
import { cn } from "@/utils/cn";

type BacklogFiltersProps = {
  query: string;
  onQueryChange: (value: string) => void;
  timeFilter: TimeFilter;
  onTimeFilterChange: (value: TimeFilter) => void;
  categoryFilter: CategoryFilter;
  onCategoryFilterChange: (value: CategoryFilter) => void;
  sort: BacklogSort;
  onSortChange: (value: BacklogSort) => void;
};

const TIME_CHIPS: TimeFilter[] = ["All", ...ESTIMATED_TIMES];

const SORT_LABELS: Record<BacklogSort, string> = {
  newest: "Newest",
  oldest: "Oldest",
  shortest: "Shortest first",
  longest: "Longest first",
};

export function BacklogFilters({
  query,
  onQueryChange,
  timeFilter,
  onTimeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sort,
  onSortChange,
}: BacklogFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        value={query}
        placeholder="Search..."
        aria-label="Search backlog"
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {TIME_CHIPS.map((chip) => {
            const selected = timeFilter === chip;
            return (
              <Button
                key={chip}
                size="sm"
                variant={selected ? "primary" : "secondary"}
                aria-pressed={selected}
                className={cn(!selected && "font-normal")}
                onClick={() => onTimeFilterChange(chip)}
              >
                {chip === "All" ? "All" : chip.replace(" min", "m").replace(" ", "")}
              </Button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            aria-label="Filter by category"
            value={categoryFilter}
            className="sm:w-44"
            onChange={(event) =>
              onCategoryFilterChange(event.target.value as CategoryFilter)
            }
          >
            <option value="All">All categories</option>
            {BACKLOG_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <Select
            aria-label="Sort backlog"
            value={sort}
            className="sm:w-44"
            onChange={(event) => onSortChange(event.target.value as BacklogSort)}
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}

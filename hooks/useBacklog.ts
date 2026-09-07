"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { backlogStore } from "@/services/storage";
import type {
  BacklogCategory,
  BacklogItem,
  BacklogSort,
  BacklogStatus,
  EstimatedTime,
} from "@/types";
import {
  filterBacklog,
  sortBacklog,
  type CategoryFilter,
  type TimeFilter,
} from "@/utils/backlog";
import { nowIso } from "@/utils/date";
import { createId } from "@/utils/id";

export type BacklogDraft = {
  title: string;
  description?: string;
  category: BacklogCategory;
  estimatedTime: EstimatedTime;
  status: BacklogStatus;
};

export function useBacklog() {
  const items = useSyncExternalStore(
    backlogStore.subscribe,
    backlogStore.getSnapshot,
    backlogStore.getServerSnapshot,
  );
  const [query, setQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("All");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [sort, setSort] = useState<BacklogSort>("newest");

  const persist = useCallback((next: BacklogItem[]) => {
    backlogStore.set(next);
  }, []);

  const addItem = useCallback(
    (draft: BacklogDraft) => {
      const timestamp = nowIso();
      const item: BacklogItem = {
        id: createId(),
        title: draft.title.trim(),
        description: draft.description?.trim() || undefined,
        category: draft.category,
        estimatedTime: draft.estimatedTime,
        status: draft.status,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      persist([item, ...items]);
    },
    [items, persist],
  );

  const updateItem = useCallback(
    (id: string, draft: BacklogDraft) => {
      persist(
        items.map((item) =>
          item.id === id
            ? {
                ...item,
                title: draft.title.trim(),
                description: draft.description?.trim() || undefined,
                category: draft.category,
                estimatedTime: draft.estimatedTime,
                status: draft.status,
                updatedAt: nowIso(),
              }
            : item,
        ),
      );
    },
    [items, persist],
  );

  const deleteItem = useCallback(
    (id: string) => {
      persist(items.filter((item) => item.id !== id));
    },
    [items, persist],
  );

  const visibleItems = useMemo(
    () =>
      sortBacklog(
        filterBacklog(items, query, timeFilter, categoryFilter),
        sort,
      ),
    [items, query, timeFilter, categoryFilter, sort],
  );

  return {
    items,
    visibleItems,
    query,
    setQuery,
    timeFilter,
    setTimeFilter,
    categoryFilter,
    setCategoryFilter,
    sort,
    setSort,
    addItem,
    updateItem,
    deleteItem,
  };
}

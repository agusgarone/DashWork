"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { analysesStore, didAnalysesPersistFail } from "@/services/storage";
import type { AnalysisStatus, IssueAnalysis } from "@/types";
import {
  createAnalysisTemplate,
  filterAnalyses,
  hasDuplicateIssueNumber,
  normalizeIssueNumber,
  normalizeTitle,
  type AnalysisStatusFilter,
} from "@/utils/analysis";
import { nowIso } from "@/utils/date";
import { createId } from "@/utils/id";
import { normalizeUrl } from "@/utils/url";

export type AnalysisDraft = {
  issueNumber: string;
  title: string;
  jiraUrl?: string;
};

export type AnalysisUpdate = {
  issueNumber: string;
  title: string;
  jiraUrl?: string;
  status: AnalysisStatus;
  body: string;
};

export type AnalysisWriteReason = "empty" | "duplicate" | "persist" | "corrupted";

export type AnalysisWriteResult =
  | { ok: true; id?: string }
  | { ok: false; reason: AnalysisWriteReason };

function optionalUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return undefined;
  return normalizeUrl(trimmed);
}

function commit(nextItems: IssueAnalysis[]): boolean {
  const previous = analysesStore.getSnapshot();
  if (previous.corrupted) return false;

  analysesStore.set({ items: nextItems, corrupted: false });
  if (!didAnalysesPersistFail()) return true;

  analysesStore.set(previous);
  return false;
}

export function useAnalyses() {
  const state = useSyncExternalStore(
    analysesStore.subscribe,
    analysesStore.getSnapshot,
    analysesStore.getServerSnapshot,
  );
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AnalysisStatusFilter>("All");

  const addAnalysis = useCallback((draft: AnalysisDraft): AnalysisWriteResult => {
    const current = analysesStore.getSnapshot();
    if (current.corrupted) return { ok: false, reason: "corrupted" };

    const issueNumber = normalizeIssueNumber(draft.issueNumber);
    const title = normalizeTitle(draft.title);
    if (!issueNumber || !title) return { ok: false, reason: "empty" };
    if (hasDuplicateIssueNumber(current.items, issueNumber)) {
      return { ok: false, reason: "duplicate" };
    }

    const timestamp = nowIso();
    const item: IssueAnalysis = {
      id: createId(),
      issueNumber,
      title,
      jiraUrl: optionalUrl(draft.jiraUrl),
      status: "Borrador",
      body: createAnalysisTemplate(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    if (!commit([item, ...current.items])) {
      return { ok: false, reason: "persist" };
    }
    return { ok: true, id: item.id };
  }, []);

  const updateAnalysis = useCallback(
    (id: string, draft: AnalysisUpdate): AnalysisWriteResult => {
      const current = analysesStore.getSnapshot();
      if (current.corrupted) return { ok: false, reason: "corrupted" };

      const existing = current.items.find((item) => item.id === id);
      if (!existing) return { ok: false, reason: "empty" };

      const issueNumber = normalizeIssueNumber(draft.issueNumber);
      const title = normalizeTitle(draft.title);
      if (!issueNumber || !title) return { ok: false, reason: "empty" };
      if (hasDuplicateIssueNumber(current.items, issueNumber, id)) {
        return { ok: false, reason: "duplicate" };
      }

      const jiraUrl = optionalUrl(draft.jiraUrl);
      const unchanged =
        existing.issueNumber === issueNumber &&
        existing.title === title &&
        existing.jiraUrl === jiraUrl &&
        existing.status === draft.status &&
        existing.body === draft.body;

      if (unchanged) return { ok: true, id };

      const next = current.items.map((item) =>
        item.id === id
          ? {
              ...item,
              issueNumber,
              title,
              jiraUrl,
              status: draft.status,
              body: draft.body,
              updatedAt: nowIso(),
            }
          : item,
      );

      if (!commit(next)) return { ok: false, reason: "persist" };
      return { ok: true, id };
    },
    [],
  );

  const deleteAnalysis = useCallback((id: string): AnalysisWriteResult => {
    const current = analysesStore.getSnapshot();
    if (current.corrupted) return { ok: false, reason: "corrupted" };
    if (!commit(current.items.filter((item) => item.id !== id))) {
      return { ok: false, reason: "persist" };
    }
    return { ok: true };
  }, []);

  const visibleItems = useMemo(
    () => filterAnalyses(state.items, query, statusFilter),
    [state.items, query, statusFilter],
  );

  return {
    items: state.items,
    corrupted: state.corrupted,
    visibleItems,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    addAnalysis,
    updateAnalysis,
    deleteAnalysis,
  };
}

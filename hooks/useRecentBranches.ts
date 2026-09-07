"use client";

import { useCallback, useSyncExternalStore } from "react";
import { recentBranchesStore } from "@/services/storage";

const MAX_RECENT = 5;

export function useRecentBranches() {
  const branches = useSyncExternalStore(
    recentBranchesStore.subscribe,
    recentBranchesStore.getSnapshot,
    recentBranchesStore.getServerSnapshot,
  );

  const remember = useCallback((branch: string) => {
    const value = branch.trim();
    if (!value) return;

    const current = recentBranchesStore.getSnapshot();
    const next = [value, ...current.filter((item) => item !== value)].slice(
      0,
      MAX_RECENT,
    );
    recentBranchesStore.set(next);
  }, []);

  return { branches, remember };
}

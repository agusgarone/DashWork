import type {
  BacklogItem,
  IssueAnalysis,
  QuickLink,
  ThemePreference,
} from "@/types";
import { defaultBacklog, defaultLinks } from "@/services/seed";
import { parseAnalyses } from "@/utils/analysis";

/**
 * Local persistence layer.
 *
 * All localStorage access goes through this module so UI components never
 * talk to the browser storage API directly. Swap these functions for a
 * Supabase client later without changing hooks or components.
 */

const PREFIX = "workbench:";

export const STORAGE_KEYS = {
  links: `${PREFIX}links`,
  backlog: `${PREFIX}backlog`,
  recentBranches: `${PREFIX}recent-branches`,
  analyses: `${PREFIX}analyses`,
  theme: `${PREFIX}theme`,
} as const;

type Listener = () => void;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readJson<T>(key: string): T | undefined {
  if (!isBrowser()) return undefined;

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return undefined;
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function createStore<T>(read: () => T, write: (value: T) => void, serverValue: T) {
  let snapshot = serverValue;
  let hydrated = false;
  const listeners = new Set<Listener>();

  const emit = () => {
    listeners.forEach((listener) => listener());
  };

  return {
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot() {
      if (!hydrated && isBrowser()) {
        snapshot = read();
        hydrated = true;
      }
      return snapshot;
    },
    getServerSnapshot() {
      return serverValue;
    },
    set(value: T) {
      snapshot = value;
      hydrated = true;
      write(value);
      emit();
    },
  };
}

export function getLinks(): QuickLink[] {
  return readJson<QuickLink[]>(STORAGE_KEYS.links) ?? defaultLinks;
}

export function saveLinks(links: QuickLink[]): void {
  writeJson(STORAGE_KEYS.links, links);
}

export function getBacklog(): BacklogItem[] {
  return readJson<BacklogItem[]>(STORAGE_KEYS.backlog) ?? defaultBacklog;
}

export function saveBacklog(items: BacklogItem[]): void {
  writeJson(STORAGE_KEYS.backlog, items);
}

export function getRecentBranches(): string[] {
  return readJson<string[]>(STORAGE_KEYS.recentBranches) ?? [];
}

export function saveRecentBranches(branches: string[]): void {
  writeJson(STORAGE_KEYS.recentBranches, branches);
}

export function getThemePreference(): ThemePreference {
  if (!isBrowser()) return "system";
  const value = window.localStorage.getItem(STORAGE_KEYS.theme);
  if (value === "light" || value === "dark" || value === "system") return value;
  return "system";
}

export function saveThemePreference(theme: ThemePreference): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEYS.theme, theme);
}

export const linksStore = createStore(getLinks, saveLinks, defaultLinks);
export const backlogStore = createStore(getBacklog, saveBacklog, defaultBacklog);
export const recentBranchesStore = createStore(
  getRecentBranches,
  saveRecentBranches,
  [] as string[],
);
export const themeStore = createStore(
  getThemePreference,
  saveThemePreference,
  "system" as ThemePreference,
);

export type AnalysesState = {
  items: IssueAnalysis[];
  corrupted: boolean;
};

const emptyAnalyses: AnalysesState = { items: [], corrupted: false };

let analysesPersistFailed = false;

function readAnalysesState(): AnalysesState {
  if (!isBrowser()) return emptyAnalyses;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.analyses);
    if (raw === null) return emptyAnalyses;
    const parsed = parseAnalyses(JSON.parse(raw));
    if (!parsed) return { items: [], corrupted: true };
    return { items: parsed, corrupted: false };
  } catch {
    return { items: [], corrupted: true };
  }
}

function writeAnalysesState(state: AnalysesState): void {
  if (!isBrowser() || state.corrupted) return;

  try {
    writeJson(STORAGE_KEYS.analyses, state.items);
    analysesPersistFailed = false;
  } catch {
    analysesPersistFailed = true;
  }
}

export function didAnalysesPersistFail(): boolean {
  return analysesPersistFailed;
}

export const analysesStore = createStore(
  readAnalysesState,
  writeAnalysesState,
  emptyAnalyses,
);

import type { BacklogItem, QuickLink, ThemePreference } from "@/types";
import { defaultBacklog, defaultLinks } from "@/services/seed";

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

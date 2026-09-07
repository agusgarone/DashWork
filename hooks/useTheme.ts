"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { themeStore } from "@/services/storage";
import type { ThemePreference } from "@/types";

function getSystemDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyTheme(preference: ThemePreference) {
  const dark =
    preference === "dark" || (preference === "system" && getSystemDark());
  document.documentElement.classList.toggle("dark", dark);
}

export function useTheme() {
  const preference = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot,
  );

  useEffect(() => {
    applyTheme(preference);
    if (preference !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [preference]);

  const setTheme = useCallback((next: ThemePreference) => {
    themeStore.set(next);
    applyTheme(next);
  }, []);

  return { preference, setTheme };
}

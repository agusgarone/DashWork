"use client";

import { useEffect, useRef, useState } from "react";
import { Settings } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useTheme } from "@/hooks/useTheme";
import type { ThemePreference } from "@/types";
import { formatHeaderDate } from "@/utils/date";
import { cn } from "@/utils/cn";

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function Header() {
  const { preference, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEscapeKey(open, () => setOpen(false));

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-lg font-medium tracking-tight text-foreground">
          DashWork
        </h1>
        <p className="mt-0.5 text-sm text-muted">Personal workspace</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted">
        <time suppressHydrationWarning>{formatHeaderDate()}</time>
        <div ref={menuRef} className="relative">
          <IconButton
            label="Settings"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-haspopup="menu"
          >
            <Settings size={16} strokeWidth={1.75} />
          </IconButton>
          {open ? (
            <div
              role="menu"
              className="absolute right-0 z-20 mt-1 w-36 rounded-md border border-border bg-surface p-1"
            >
              <p className="px-2 py-1.5 text-[11px] uppercase tracking-wide text-muted">
                Appearance
              </p>
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={preference === option.value}
                  className={cn(
                    "flex w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors duration-150",
                    preference === option.value
                      ? "bg-hover text-foreground"
                      : "text-muted hover:bg-hover hover:text-foreground",
                  )}
                  onClick={() => {
                    setTheme(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

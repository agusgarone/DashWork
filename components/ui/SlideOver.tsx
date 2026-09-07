"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { IconButton } from "@/components/ui/IconButton";

type SlideOverProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function SlideOver({ open, title, onClose, children }: SlideOverProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);

  useEscapeKey(open, onClose);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      const focusable = panelRef.current?.querySelector<HTMLElement>(
        "input, textarea, select, button",
      );
      focusable?.focus();
    }, 0);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close panel"
        className="absolute inset-0 bg-black/40 transition-opacity duration-150"
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-border bg-surface"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h2 id={titleId} className="text-sm font-medium text-foreground">
            {title}
          </h2>
          <IconButton label="Close" onClick={onClose}>
            <X size={16} strokeWidth={1.75} />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </aside>
    </div>,
    document.body,
  );
}

"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { IconButton } from "@/components/ui/IconButton";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ open, title, onClose, children }: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

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
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-16 sm:items-center">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/40 transition-opacity duration-150"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-lg border border-border bg-surface p-5 shadow-none"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id={titleId} className="text-sm font-medium text-foreground">
            {title}
          </h2>
          <IconButton label="Close" onClick={onClose}>
            <X size={16} strokeWidth={1.75} />
          </IconButton>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

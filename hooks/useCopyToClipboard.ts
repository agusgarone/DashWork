"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useCopyToClipboard(resetMs = 1500) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = useCallback(
    async (value: string) => {
      const text = value.trim();
      if (!text) return false;

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (timeoutRef.current !== null) {
          window.clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
          setCopied(false);
        }, resetMs);
        return true;
      } catch {
        return false;
      }
    },
    [resetMs],
  );

  return { copied, copy };
}

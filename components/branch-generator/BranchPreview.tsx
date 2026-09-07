"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

type BranchPreviewProps = {
  branch: string;
  copied: boolean;
  disabled?: boolean;
  onCopy: () => void;
};

export function BranchPreview({
  branch,
  copied,
  disabled,
  onCopy,
}: BranchPreviewProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted">Generated branch</p>
      <div className="flex items-center gap-2 rounded-md bg-[#111111] px-3 py-2.5 dark:bg-black">
        <button
          type="button"
          disabled={disabled}
          onClick={onCopy}
          className={cn(
            "min-w-0 flex-1 truncate text-left font-mono text-[13px] text-[#ededed] outline-none",
            disabled && "cursor-default text-[#ededed]/40",
          )}
        >
          {branch || "Your branch will appear here"}
        </button>
        <Button
          size="sm"
          variant="ghost"
          disabled={disabled}
          onClick={onCopy}
          className="shrink-0 text-[#ededed] hover:bg-white/10 hover:text-white"
        >
          {copied ? (
            <>
              <Check size={13} strokeWidth={1.75} />
              Copied
            </>
          ) : (
            "Copy"
          )}
        </Button>
      </div>
    </div>
  );
}

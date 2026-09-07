import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors duration-150 placeholder:text-muted/80 focus:border-foreground/40",
        className,
      )}
      {...props}
    />
  );
}

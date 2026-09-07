import type { SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-9 w-full rounded-md border border-border bg-surface px-2.5 text-sm text-foreground outline-none transition-colors duration-150 focus:border-foreground/40",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

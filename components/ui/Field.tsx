import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type FieldProps = {
  label: string;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, className, children }: FieldProps) {
  return (
    <label htmlFor={htmlFor} className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-xs text-muted">{label}</span>
      {children}
    </label>
  );
}

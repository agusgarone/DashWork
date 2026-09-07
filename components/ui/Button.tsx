import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-inverse text-inverse-foreground hover:opacity-80 disabled:opacity-40",
  secondary:
    "border border-border bg-surface text-foreground hover:bg-hover disabled:opacity-40",
  ghost: "text-muted hover:bg-hover hover:text-foreground disabled:opacity-40",
  danger: "text-muted hover:bg-hover hover:text-foreground disabled:opacity-40",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-9 px-3 text-sm",
};

export function Button({
  variant = "secondary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

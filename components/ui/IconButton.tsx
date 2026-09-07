import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export function IconButton({
  label,
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-hover hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
        className,
      )}
      {...props}
    />
  );
}

import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type SectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Section({
  title,
  description,
  action,
  children,
  className,
}: SectionProps) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-[15px] font-medium tracking-tight text-foreground">
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 text-sm text-muted">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

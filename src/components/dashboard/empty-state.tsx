import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared empty-state primitive. Every dashboard card uses this instead of
 * placeholder/fake data when the user has nothing yet.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 px-4 py-8 text-center", className)}>
      {icon ? (
        <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
          {icon}
        </div>
      ) : null}
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? (
          <p className="mx-auto max-w-xs text-xs leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

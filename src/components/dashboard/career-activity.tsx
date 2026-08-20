"use client";

import { Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "./empty-state";
import type { ActivityDoc } from "@/lib/dashboard-service";

function formatWhen(value?: { toMillis?: () => number } | null): string {
  const millis = value?.toMillis?.();
  if (!millis) return "";
  return new Date(millis).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function CareerActivity({ activity }: { activity: ActivityDoc[] }) {
  return (
    <Card className="gap-4 rounded-2xl p-5">
      <div className="flex items-center gap-2">
        <Activity className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Career activity</h3>
      </div>

      {activity.length === 0 ? (
        <EmptyState
          icon={<Activity className="size-5" />}
          title="No activity yet"
          description="Your résumé edits, applications and practice sessions will appear here as a timeline."
        />
      ) : (
        <ol className="space-y-3">
          {activity.slice(0, 6).map((item) => (
            <li key={item.id} className="flex gap-3">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{item.title ?? item.type ?? "Activity"}</p>
                <p className="text-xs text-muted-foreground">{formatWhen(item.createdAt)}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

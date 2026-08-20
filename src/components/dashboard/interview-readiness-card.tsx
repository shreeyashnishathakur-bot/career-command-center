"use client";

import { GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "./empty-state";
import type { computeInterviewReadiness } from "@/lib/career-score";

export function InterviewReadinessCard({
  readiness,
}: {
  readiness: ReturnType<typeof computeInterviewReadiness>;
}) {
  return (
    <Card className="gap-4 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">Interview readiness</h3>
        </div>
        {readiness.overall !== null ? (
          <span className="tabular-nums text-sm font-semibold text-primary">{readiness.overall}%</span>
        ) : null}
      </div>

      {!readiness.hasData ? (
        <EmptyState
          icon={<GraduationCap className="size-5" />}
          title="No practice sessions yet"
          description="Interview Prep will score your answers by category and track progress here."
        />
      ) : (
        <div className="space-y-3">
          {readiness.breakdown.map((item) => (
            <div key={item.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="tabular-nums font-medium">{item.hasData ? `${item.value}%` : "No data"}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${item.hasData ? item.value : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

"use client";

import { Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "./empty-state";
import type { JobMatchDoc } from "@/lib/dashboard-service";

export function JobMatchCard({ matches }: { matches: JobMatchDoc[] }) {
  return (
    <Card className="gap-4 rounded-2xl p-5">
      <div className="flex items-center gap-2">
        <Target className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Job match</h3>
      </div>

      {matches.length === 0 ? (
        <EmptyState
          icon={<Target className="size-5" />}
          title="No job matches yet"
          description="Paste a job description in Job Match to see how your résumé scores against it."
        />
      ) : (
        <ul className="space-y-3">
          {matches.slice(0, 3).map((match) => (
            <li key={match.id} className="space-y-2 rounded-xl border border-border p-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate font-medium">{match.jobTitle ?? "Untitled role"}</span>
                <span className="shrink-0 tabular-nums font-semibold text-primary">
                  {typeof match.matchScore === "number" ? `${match.matchScore}%` : "—"}
                </span>
              </div>
              {match.company ? <p className="text-xs text-muted-foreground">{match.company}</p> : null}
              {match.missingSkills?.length ? (
                <p className="text-xs text-muted-foreground">
                  Missing: {match.missingSkills.slice(0, 4).join(", ")}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

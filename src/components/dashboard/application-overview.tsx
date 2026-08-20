"use client";

import { BriefcaseBusiness } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "./empty-state";
import { countByStatus, type ApplicationDoc, type ApplicationStatus } from "@/lib/dashboard-service";

const LABELS: Array<{ key: ApplicationStatus; label: string }> = [
  { key: "saved", label: "Saved" },
  { key: "applied", label: "Applied" },
  { key: "interview", label: "Interview" },
  { key: "offer", label: "Offer" },
  { key: "rejected", label: "Rejected" },
];

export function ApplicationOverview({ applications }: { applications: ApplicationDoc[] }) {
  const counts = countByStatus(applications);

  return (
    <Card className="gap-4 rounded-2xl p-5">
      <div className="flex items-center gap-2">
        <BriefcaseBusiness className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Applications</h3>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={<BriefcaseBusiness className="size-5" />}
          title="No applications tracked yet"
          description="Once you start tracking roles you've applied to, their pipeline shows up here."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {LABELS.map((status) => (
              <div key={status.key} className="rounded-xl border border-border bg-secondary/25 px-3 py-3 text-center">
                <p className="font-display text-xl font-semibold tabular-nums">{counts[status.key]}</p>
                <p className="text-[11px] text-muted-foreground">{status.label}</p>
              </div>
            ))}
          </div>
          <ul className="space-y-2">
            {applications.slice(0, 4).map((application) => (
              <li
                key={application.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2.5 text-sm"
              >
                <span className="min-w-0 truncate">
                  <span className="font-medium">{application.role ?? "Untitled role"}</span>
                  {application.company ? (
                    <span className="text-muted-foreground"> · {application.company}</span>
                  ) : null}
                </span>
                <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[11px] capitalize text-secondary-foreground">
                  {application.status ?? "saved"}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

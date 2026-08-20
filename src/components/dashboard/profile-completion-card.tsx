"use client";

import { Link } from "@tanstack/react-router";
import { Check, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ProfileCompletion } from "@/lib/career-score";
import { cn } from "@/lib/utils";

export function ProfileCompletionCard({ completion }: { completion: ProfileCompletion }) {
  return (
    <Card className="gap-4 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <UserRound className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">Profile completion</h3>
        </div>
        <span className="tabular-nums text-sm font-semibold text-primary">{completion.value}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-700"
          style={{ width: `${completion.value}%` }}
        />
      </div>

      <ul className="grid gap-1.5 sm:grid-cols-2">
        {completion.fields.map((field) => (
          <li key={field.key} className="flex items-center gap-2 text-xs">
            <span
              className={cn(
                "flex size-4 items-center justify-center rounded-full",
                field.complete ? "bg-primary/15 text-primary" : "border border-dashed border-border",
              )}
            >
              {field.complete ? <Check className="size-2.5" /> : null}
            </span>
            <span className={field.complete ? "text-foreground" : "text-muted-foreground"}>{field.label}</span>
          </li>
        ))}
      </ul>

      {completion.value < 100 ? (
        <Button asChild variant="outline" size="sm" className="mt-1 rounded-xl">
          <Link to="/onboarding">Complete profile</Link>
        </Button>
      ) : null}
    </Card>
  );
}

"use client";

import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "./empty-state";
import type { CareerScore, MissingItem } from "@/lib/career-score";

const FACTOR_DESTINATION: Record<string, string> = {
  resume: "/resumes",
  profile: "/onboarding",
  skills: "/onboarding",
  projects: "/onboarding",
  portfolio: "/onboarding",
};

function RecommendationCard({ item }: { item: MissingItem }) {
  const to = FACTOR_DESTINATION[item.factor];

  const body = (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary/25 p-4 transition-colors hover:bg-secondary/50">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Lightbulb className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug">{item.label}</p>
        <p className="mt-0.5 text-xs capitalize text-muted-foreground">{item.factor}</p>
      </div>
      {to ? <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground" /> : null}
    </div>
  );

  return to ? (
    <Link to={to} className="block">
      {body}
    </Link>
  ) : (
    body
  );
}

export function RecommendedForYou({ score }: { score: CareerScore }) {
  const items = score.missing.slice(0, 4);

  return (
    <Card className="gap-4 rounded-2xl p-5">
      <div className="flex items-center gap-2">
        <Lightbulb className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Recommended for you</h3>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="size-5" />}
          title="Nothing outstanding"
          description="Your profile and résumé look complete. Keep them fresh as you gain experience."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <RecommendationCard key={item.key} item={item} />
          ))}
        </div>
      )}
    </Card>
  );
}

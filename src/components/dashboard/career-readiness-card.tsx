"use client";

import { Gauge } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "./empty-state";
import type { CareerScore } from "@/lib/career-score";

function ScoreRing({ value }: { value: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  return (
    <div className="relative size-[136px] shrink-0">
      <svg viewBox="0 0 128 128" className="size-full -rotate-90">
        <circle cx="64" cy="64" r={radius} fill="none" strokeWidth="12" className="stroke-secondary" />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          strokeWidth="12"
          strokeLinecap="round"
          className="stroke-primary transition-[stroke-dashoffset] duration-700"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-semibold tabular-nums">{value}</span>
        <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">of 100</span>
      </div>
    </div>
  );
}

export function CareerReadinessCard({ score }: { score: CareerScore }) {
  return (
    <Card className="gap-5 rounded-2xl p-5">
      <div className="flex items-center gap-2">
        <Gauge className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Career readiness</h3>
      </div>

      {score.insufficientData || score.overall === null ? (
        <EmptyState
          icon={<Gauge className="size-5" />}
          title="Not enough data yet"
          description="Complete your profile to calculate your career readiness."
        />
      ) : (
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <ScoreRing value={score.overall} />
          <div className="w-full space-y-3">
            {score.factors.map((factor) => (
              <div key={factor.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{factor.label}</span>
                  <span className="tabular-nums font-medium">
                    {factor.hasData ? `${factor.value}%` : "No data"}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-700"
                    style={{ width: `${factor.hasData ? factor.value : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

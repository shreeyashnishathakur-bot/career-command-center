"use client";

import { Link } from "@tanstack/react-router";
import { FilePlus2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

function greetingFor(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function GreetingSection({ name, hour }: { name: string; hour: number }) {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5">
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {greetingFor(hour)}, {name} <span aria-hidden>👋</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Here's where your career stands today — and the next step worth taking.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" className="rounded-xl">
          <Link to="/resumes">
            <FilePlus2 className="size-4" /> My resumes
          </Link>
        </Button>
        <Button asChild className="rounded-xl">
          <Link to="/onboarding">
            <Sparkles className="size-4" /> Improve profile
          </Link>
        </Button>
      </div>
    </section>
  );
}

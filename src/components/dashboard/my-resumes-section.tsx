"use client";

import { Link } from "@tanstack/react-router";
import { FilePlus2, FileText, PencilLine, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "./empty-state";
import type { ResumeDocument } from "@/lib/resume-service";

function formatUpdated(value?: { toMillis?: () => number } | null): string {
  const millis = value?.toMillis?.();
  if (!millis) return "Not saved yet";
  return `Updated ${new Date(millis).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

function ResumeCard({ resume }: { resume: ResumeDocument }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-secondary/20 p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{resume.title || "Untitled résumé"}</p>
          <p className="text-xs text-muted-foreground">{formatUpdated(resume.updatedAt)}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline" className="flex-1 rounded-lg">
          <Link to="/resumes/$resumeId/editor" params={{ resumeId: resume.id }}>
            <PencilLine className="size-3.5" /> Edit
          </Link>
        </Button>
        <Button asChild size="sm" variant="ghost" className="flex-1 rounded-lg">
          <Link to="/resumes/$resumeId/check" params={{ resumeId: resume.id }}>
            <ShieldCheck className="size-3.5" /> Check
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function MyResumesSection({ resumes }: { resumes: ResumeDocument[] }) {
  return (
    <Card className="gap-4 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">My resumes</h3>
        </div>
        <Button asChild size="sm" variant="ghost" className="rounded-xl">
          <Link to="/resumes">View all</Link>
        </Button>
      </div>

      {resumes.length === 0 ? (
        <EmptyState
          icon={<FilePlus2 className="size-5" />}
          title="No résumés yet"
          description="Create your first résumé to unlock readiness scoring and job matching."
          action={
            <Button asChild size="sm" className="rounded-xl">
              <Link to="/resumes">Create résumé</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {resumes.slice(0, 6).map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
    </Card>
  );
}

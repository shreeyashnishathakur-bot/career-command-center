import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { GreetingSection } from "@/components/dashboard/greeting-section";
import { CareerAIInput } from "@/components/dashboard/career-ai-input";
import { CareerReadinessCard } from "@/components/dashboard/career-readiness-card";
import { ProfileCompletionCard } from "@/components/dashboard/profile-completion-card";
import { InterviewReadinessCard } from "@/components/dashboard/interview-readiness-card";
import { RecommendedForYou } from "@/components/dashboard/recommended-for-you";
import { MyResumesSection } from "@/components/dashboard/my-resumes-section";
import { ApplicationOverview } from "@/components/dashboard/application-overview";
import { JobMatchCard } from "@/components/dashboard/job-match-card";
import { CareerActivity } from "@/components/dashboard/career-activity";
import { useDashboardData } from "@/hooks/use-dashboard-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Career Dashboard — CareerGPT" },
      {
        name: "description",
        content:
          "Track your career readiness score, résumés, applications, job matches and interview prep in one dashboard.",
      },
      { property: "og:title", content: "Career Dashboard — CareerGPT" },
      {
        property: "og:description",
        content:
          "Track your career readiness score, résumés, applications, job matches and interview prep in one dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardRoute,
});

function DashboardRoute() {
  return (
    <ProtectedRoute>
      <DashboardLayout title="Dashboard">
        <DashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const {
    user,
    loading,
    profile,
    resumes,
    applications,
    jobMatches,

    activity,
    score,
    profileCompletion,
    interviewReadiness,
  } = useDashboardData();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const name = profile?.name ?? user?.displayName ?? user?.email?.split("@")[0] ?? "there";

  return (
    <div className="flex flex-col gap-6">
      <GreetingSection name={name} hour={new Date().getHours()} />

      <CareerAIInput
        context={{
          name,
          readinessScore: score.overall,
          resumeCount: resumes.length,
          ...(profile?.targetRole ? { targetRole: profile.targetRole } : {}),
          ...(profile?.skills ? { skills: profile.skills } : {}),
        }}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CareerReadinessCard score={score} />
        </div>
        <div className="flex flex-col gap-6">
          <ProfileCompletionCard completion={profileCompletion} />
          <InterviewReadinessCard readiness={interviewReadiness} />
        </div>
      </div>

      <MyResumesSection resumes={resumes} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ApplicationOverview applications={applications} />
        <JobMatchCard matches={jobMatches} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecommendedForYou score={score} />
        <CareerActivity activity={activity} />
      </div>

    </div>
  );
}

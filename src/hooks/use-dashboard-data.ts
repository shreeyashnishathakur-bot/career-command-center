"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getUserResumes } from "@/lib/resume-service";
import {
  getUserActivity,
  getUserApplications,
  getUserInterviewSessions,
  getUserJobMatches,
  getUserProfile,
} from "@/lib/dashboard-service";
import {
  computeCareerScore,
  computeInterviewReadiness,
  computeProfileCompletion,
} from "@/lib/career-score";

/**
 * All dashboard reads live behind TanStack Query, keyed by uid. A 5-minute
 * `staleTime` keeps navigating back to the dashboard from re-hitting Firestore.
 */
const STALE_TIME = 5 * 60 * 1000;

export function useDashboardData() {
  const { user, loading: authLoading } = useAuth();
  const uid = user?.uid;
  const enabled = Boolean(uid);

  const profileQuery = useQuery({
    queryKey: ["dashboard", "profile", uid],
    queryFn: () => getUserProfile(uid!),
    enabled,
    staleTime: STALE_TIME,
  });

  const resumesQuery = useQuery({
    queryKey: ["dashboard", "resumes", uid],
    queryFn: () => getUserResumes(uid!),
    enabled,
    staleTime: STALE_TIME,
  });

  const applicationsQuery = useQuery({
    queryKey: ["dashboard", "applications", uid],
    queryFn: () => getUserApplications(uid!),
    enabled,
    staleTime: STALE_TIME,
  });

  const jobMatchesQuery = useQuery({
    queryKey: ["dashboard", "jobMatches", uid],
    queryFn: () => getUserJobMatches(uid!),
    enabled,
    staleTime: STALE_TIME,
  });

  const interviewsQuery = useQuery({
    queryKey: ["dashboard", "interviewSessions", uid],
    queryFn: () => getUserInterviewSessions(uid!),
    enabled,
    staleTime: STALE_TIME,
  });

  const activityQuery = useQuery({
    queryKey: ["dashboard", "activity", uid],
    queryFn: () => getUserActivity(uid!),
    enabled,
    staleTime: STALE_TIME,
  });

  const profile = profileQuery.data ?? null;
  const resumes = resumesQuery.data ?? [];
  const applications = applicationsQuery.data ?? [];
  const jobMatches = jobMatchesQuery.data ?? [];
  const interviewSessions = interviewsQuery.data ?? [];
  const activity = activityQuery.data ?? [];

  const score = computeCareerScore({ profile, resumes, interviewSessions });
  const profileCompletion = computeProfileCompletion(profile, resumes);
  const interviewReadiness = computeInterviewReadiness(interviewSessions);

  const loading =
    authLoading ||
    (enabled &&
      (profileQuery.isLoading ||
        resumesQuery.isLoading ||
        applicationsQuery.isLoading ||
        jobMatchesQuery.isLoading ||
        interviewsQuery.isLoading ||
        activityQuery.isLoading));

  return {
    user,
    loading,
    profile,
    resumes,
    applications,
    jobMatches,
    interviewSessions,
    activity,
    score,
    profileCompletion,
    interviewReadiness,
    refetchResumes: resumesQuery.refetch,
  };
}

export type DashboardData = ReturnType<typeof useDashboardData>;

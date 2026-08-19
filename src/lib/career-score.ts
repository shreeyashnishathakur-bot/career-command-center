import type { ResumeDocument } from "@/lib/resume-service";
import type { ResumeData } from "@/features/resume-builder/types";

/**
 * Pure career-readiness scoring. No Firebase, no React — everything is derived
 * from data the app already stores (the `users/{uid}` profile doc, the user's
 * résumés, and the optional new dashboard collections).
 *
 * Nothing here invents numbers: when a factor has no underlying data its score
 * is 0 and it is reported as `hasData: false`, so the UI can show an empty
 * state instead of a fake statistic.
 */

export interface UserProfileDoc {
  uid?: string;
  name?: string;
  email?: string | null;
  photoURL?: string | null;
  headline?: string;
  location?: string;
  targetRole?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  skills?: string[];
  education?: unknown[];
  experience?: unknown[];
  certifications?: unknown[];
  preferences?: Record<string, unknown>;
}

export interface InterviewSessionDoc {
  id: string;
  uid: string;
  category?: "technical" | "projects" | "hr" | "communication" | string;
  score?: number;
  createdAt?: { toMillis?: () => number } | null;
}

export type ScoreFactorKey =
  | "resume"
  | "profile"
  | "skills"
  | "projects"
  | "interview"
  | "portfolio";

export interface ScoreFactor {
  key: ScoreFactorKey;
  label: string;
  /** 0-100 */
  value: number;
  hasData: boolean;
  weight: number;
}

export interface MissingItem {
  key: string;
  label: string;
  /** Which factor this gap belongs to. */
  factor: ScoreFactorKey;
}

export interface CareerScore {
  /** 0-100 overall readiness, or null when there is nothing to score. */
  overall: number | null;
  insufficientData: boolean;
  factors: ScoreFactor[];
  missing: MissingItem[];
}

function pct(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((part / total) * 100)));
}

function nonEmpty(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return Boolean(value);
}

/** Latest résumé wins for "which résumé represents the user". */
function primaryResume(resumes: ResumeDocument[]): ResumeDocument | undefined {
  return resumes[0];
}

function resumeCompleteness(data: ResumeData | undefined): { value: number; missing: MissingItem[] } {
  const missing: MissingItem[] = [];
  if (!data) return { value: 0, missing };

  const checks: Array<{ key: string; label: string; ok: boolean }> = [
    { key: "personal", label: "Contact details on your résumé", ok: nonEmpty(data.personal?.fullName) && nonEmpty(data.personal?.email) },
    { key: "summary", label: "A professional summary", ok: nonEmpty(data.summary) },
    { key: "experience", label: "Work or internship experience", ok: nonEmpty(data.experience) },
    { key: "education", label: "Education history", ok: nonEmpty(data.education) },
    { key: "skills", label: "Skills grouped by category", ok: (data.skills ?? []).some((g) => g.items?.length) },
    { key: "projects", label: "At least two projects", ok: (data.projects ?? []).length >= 2 },
    {
      key: "achievements",
      label: "Measurable achievements in your bullet points",
      ok: (data.experience ?? []).some((e) => (e.bullets ?? []).some((b) => /\d/.test(b))),
    },
  ];

  for (const check of checks) {
    if (!check.ok) missing.push({ key: `resume:${check.key}`, label: check.label, factor: "resume" });
  }

  return { value: pct(checks.filter((c) => c.ok).length, checks.length), missing };
}

export interface ProfileCompletion {
  value: number;
  hasData: boolean;
  fields: Array<{ key: string; label: string; complete: boolean }>;
}

/**
 * Profile completeness merges the `users/{uid}` doc with whatever the user
 * already filled in on their most recent résumé — that data is real and
 * shouldn't be counted as missing just because it lives in another document.
 */
export function computeProfileCompletion(
  profile: UserProfileDoc | null,
  resumes: ResumeDocument[],
): ProfileCompletion {
  const resume = primaryResume(resumes);
  const data = resume?.resumeData;
  const answers = resume?.questionnaireAnswers;

  const fields = [
    { key: "name", label: "Name", complete: nonEmpty(profile?.name) || nonEmpty(data?.personal.fullName) },
    { key: "education", label: "Education", complete: nonEmpty(profile?.education) || nonEmpty(data?.education) },
    {
      key: "skills",
      label: "Skills",
      complete: nonEmpty(profile?.skills) || (data?.skills ?? []).some((g) => g.items?.length),
    },
    { key: "projects", label: "Projects", complete: nonEmpty(profile?.experience) || nonEmpty(data?.projects) },
    { key: "experience", label: "Experience", complete: nonEmpty(profile?.experience) || nonEmpty(data?.experience) },
    {
      key: "certifications",
      label: "Certifications",
      complete: nonEmpty(profile?.certifications) || nonEmpty(data?.certifications),
    },
    { key: "github", label: "GitHub", complete: nonEmpty(profile?.github) || nonEmpty(data?.personal.github) },
    { key: "linkedin", label: "LinkedIn", complete: nonEmpty(profile?.linkedin) || nonEmpty(data?.personal.linkedin) },
    {
      key: "portfolio",
      label: "Portfolio",
      complete: nonEmpty(profile?.portfolio) || nonEmpty(data?.personal.website),
    },
    {
      key: "preferences",
      label: "Career preferences",
      complete: nonEmpty(profile?.targetRole) || nonEmpty(answers?.targetRole) || nonEmpty(answers?.careerGoal),
    },
  ];

  const complete = fields.filter((f) => f.complete).length;
  return { value: pct(complete, fields.length), hasData: complete > 0, fields };
}

export function computeInterviewReadiness(sessions: InterviewSessionDoc[]) {
  const categories: Array<{ key: string; label: string }> = [
    { key: "technical", label: "Technical" },
    { key: "projects", label: "Projects" },
    { key: "hr", label: "HR" },
    { key: "communication", label: "Communication" },
  ];

  const breakdown = categories.map((category) => {
    const matching = sessions.filter((s) => s.category === category.key && typeof s.score === "number");
    const value = matching.length
      ? Math.round(matching.reduce((sum, s) => sum + (s.score ?? 0), 0) / matching.length)
      : 0;
    return { ...category, value, hasData: matching.length > 0 };
  });

  const scored = breakdown.filter((b) => b.hasData);
  return {
    breakdown,
    overall: scored.length ? Math.round(scored.reduce((sum, b) => sum + b.value, 0) / scored.length) : null,
    hasData: scored.length > 0,
  };
}

export interface CareerScoreInput {
  profile: UserProfileDoc | null;
  resumes: ResumeDocument[];
  interviewSessions: InterviewSessionDoc[];
}

export function computeCareerScore({ profile, resumes, interviewSessions }: CareerScoreInput): CareerScore {
  const missing: MissingItem[] = [];
  const resume = primaryResume(resumes);
  const data = resume?.resumeData;

  const resumeResult = resumeCompleteness(data);
  if (!resume) {
    missing.push({ key: "resume:create", label: "Create your first résumé", factor: "resume" });
  } else {
    missing.push(...resumeResult.missing);
  }

  const profileCompletion = computeProfileCompletion(profile, resumes);
  for (const field of profileCompletion.fields) {
    if (!field.complete) {
      missing.push({ key: `profile:${field.key}`, label: `Add your ${field.label.toLowerCase()}`, factor: "profile" });
    }
  }

  const skillCount =
    (profile?.skills?.length ?? 0) + (data?.skills ?? []).reduce((sum, g) => sum + (g.items?.length ?? 0), 0);
  const projectCount = data?.projects?.length ?? 0;
  const interview = computeInterviewReadiness(interviewSessions);

  const portfolioLinks = [
    profile?.github ?? data?.personal.github,
    profile?.linkedin ?? data?.personal.linkedin,
    profile?.portfolio ?? data?.personal.website,
  ].filter(nonEmpty);

  const factors: ScoreFactor[] = [
    { key: "resume", label: "Resume", value: resumeResult.value, hasData: Boolean(resume), weight: 0.25 },
    { key: "profile", label: "Profile", value: profileCompletion.value, hasData: profileCompletion.hasData, weight: 0.2 },
    // 12+ listed skills reads as a complete skill section.
    { key: "skills", label: "Skills", value: pct(Math.min(skillCount, 12), 12), hasData: skillCount > 0, weight: 0.15 },
    // 3 solid projects is the target for early-career profiles.
    { key: "projects", label: "Projects", value: pct(Math.min(projectCount, 3), 3), hasData: projectCount > 0, weight: 0.15 },
    { key: "interview", label: "Interview", value: interview.overall ?? 0, hasData: interview.hasData, weight: 0.15 },
    { key: "portfolio", label: "Portfolio", value: pct(portfolioLinks.length, 3), hasData: portfolioLinks.length > 0, weight: 0.1 },
  ];

  const withData = factors.filter((f) => f.hasData);
  if (withData.length === 0) {
    return { overall: null, insufficientData: true, factors, missing };
  }

  // Re-normalise weights across the factors we actually have data for, so a
  // user with no interview history isn't punished for a feature they haven't
  // used — the gap surfaces as a recommendation instead.
  const totalWeight = withData.reduce((sum, f) => sum + f.weight, 0);
  const overall = Math.round(withData.reduce((sum, f) => sum + f.value * f.weight, 0) / totalWeight);

  return { overall, insufficientData: false, factors, missing };
}

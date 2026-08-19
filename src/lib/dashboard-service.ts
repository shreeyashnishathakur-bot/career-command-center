import { collection, doc, getDoc, getDocs, limit, query, where, type Timestamp } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { InterviewSessionDoc, UserProfileDoc } from "@/lib/career-score";

/**
 * Read-only Firestore access for the dashboard.
 *
 * The applications / job-match / interview / activity collections don't exist
 * in the product yet. Reading a collection that has no documents is not an
 * error in Firestore, but a missing security rule is — so every read here is
 * best-effort and resolves to an empty result instead of breaking the whole
 * dashboard. No writes and no rules changes happen from this module.
 */

async function safe<T>(work: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await work();
  } catch (error) {
    console.warn(`[dashboard] ${label} unavailable:`, error);
    return fallback;
  }
}

export type ApplicationStatus = "saved" | "applied" | "interview" | "offer" | "rejected";

export interface ApplicationDoc {
  id: string;
  uid: string;
  role?: string;
  company?: string;
  status?: ApplicationStatus;
  updatedAt?: Timestamp | null;
}

export interface JobMatchDoc {
  id: string;
  uid: string;
  jobTitle?: string;
  company?: string;
  matchScore?: number;
  matchingSkills?: string[];
  missingSkills?: string[];
  createdAt?: Timestamp | null;
}

export interface ActivityDoc {
  id: string;
  uid: string;
  type?: string;
  title?: string;
  createdAt?: Timestamp | null;
}

function millis(value?: { toMillis?: () => number } | null): number {
  return value?.toMillis?.() ?? 0;
}

export async function getUserProfile(uid: string): Promise<UserProfileDoc | null> {
  return safe(
    async () => {
      const snap = await getDoc(doc(getFirebaseDb(), "users", uid));
      return snap.exists() ? (snap.data() as UserProfileDoc) : null;
    },
    null,
    "user profile",
  );
}

async function listByUid<T>(collectionName: string, uid: string, max = 50): Promise<T[]> {
  return safe(
    async () => {
      const snap = await getDocs(
        query(collection(getFirebaseDb(), collectionName), where("uid", "==", uid), limit(max)),
      );
      const rows: T[] = [];
      snap.forEach((docSnap) => rows.push({ ...(docSnap.data() as T), id: docSnap.id }));
      return rows;
    },
    [],
    collectionName,
  );
}

export async function getUserApplications(uid: string): Promise<ApplicationDoc[]> {
  const rows = await listByUid<ApplicationDoc>("applications", uid);
  return rows.sort((a, b) => millis(b.updatedAt) - millis(a.updatedAt));
}

export async function getUserJobMatches(uid: string): Promise<JobMatchDoc[]> {
  const rows = await listByUid<JobMatchDoc>("jobMatches", uid);
  return rows.sort((a, b) => millis(b.createdAt) - millis(a.createdAt));
}

export async function getUserInterviewSessions(uid: string): Promise<InterviewSessionDoc[]> {
  const rows = await listByUid<InterviewSessionDoc>("interviewSessions", uid);
  return rows.sort((a, b) => millis(b.createdAt) - millis(a.createdAt));
}

export async function getUserActivity(uid: string): Promise<ActivityDoc[]> {
  const rows = await listByUid<ActivityDoc>("activity", uid, 20);
  return rows.sort((a, b) => millis(b.createdAt) - millis(a.createdAt));
}

export function countByStatus(applications: ApplicationDoc[]): Record<ApplicationStatus, number> {
  const counts: Record<ApplicationStatus, number> = {
    saved: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  };
  for (const app of applications) {
    const status = app.status;
    if (status && status in counts) counts[status] += 1;
  }
  return counts;
}

/**
 * Career AI entry point for the dashboard's "Ask Career AI" input.
 *
 * This deliberately reuses the existing OpenRouter setup (same env key as
 * `ai-service.ts`) instead of inventing a new backend. If the key isn't set,
 * `isCareerAIConfigured()` is false and the UI says so plainly rather than
 * failing silently or faking an answer.
 */

const OPENROUTER_API_KEY = import.meta.env["VITE_OPENROUTER_API_KEY"] as string | undefined;
const MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free";
const BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

export function isCareerAIConfigured(): boolean {
  return Boolean(OPENROUTER_API_KEY);
}

export interface CareerAIContext {
  name?: string;
  targetRole?: string;
  readinessScore?: number | null;
  resumeCount?: number;
  skills?: string[];
}

function buildSystemPrompt(context: CareerAIContext): string {
  const lines = [
    "You are Career AI inside Career Launchpad, an AI career platform.",
    "Give direct, practical, encouraging career advice in at most 6 short sentences or bullets.",
    "Never invent facts about the user; if information is missing, say what they should add.",
  ];
  if (context.name) lines.push(`The user's name is ${context.name}.`);
  if (context.targetRole) lines.push(`Their target role is ${context.targetRole}.`);
  if (typeof context.readinessScore === "number") {
    lines.push(`Their career readiness score is ${context.readinessScore}/100.`);
  }
  if (typeof context.resumeCount === "number") lines.push(`They have ${context.resumeCount} résumé(s) saved.`);
  if (context.skills?.length) lines.push(`Listed skills: ${context.skills.slice(0, 20).join(", ")}.`);
  return lines.join("\n");
}

export async function askCareerAI(question: string, context: CareerAIContext = {}): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("Career AI isn't connected yet. Add VITE_OPENROUTER_API_KEY to your .env file.");
  }

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": window.location.origin,
      "X-Title": "Career Launchpad",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 600,
      temperature: 0.6,
      messages: [
        { role: "system", content: buildSystemPrompt(context) },
        { role: "user", content: question },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Career AI request failed (${res.status}).`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Career AI returned an empty response.");
  return text;
}

export const CAREER_AI_EXAMPLES = [
  "How can I improve my resume?",
  "Am I ready for a backend internship?",
  "What skills should I learn next?",
];

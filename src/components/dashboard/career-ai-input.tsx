"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CAREER_AI_EXAMPLES, askCareerAI, isCareerAIConfigured, type CareerAIContext } from "@/lib/career-ai";

export function CareerAIInput({ context }: { context: CareerAIContext }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const configured = isCareerAIConfigured();

  const ask = async (value: string) => {
    const text = value.trim();
    if (!text || pending) return;
    setPending(true);
    setError(null);
    setAnswer(null);
    try {
      setAnswer(await askCareerAI(text, context));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Career AI is unavailable right now.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Card className="gap-4 rounded-2xl p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Ask Career AI</h3>
      </div>

      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          void ask(question);
        }}
      >
        <Input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask anything about your career…"
          className="h-11 rounded-xl"
          aria-label="Ask Career AI"
        />
        <Button type="submit" className="h-11 rounded-xl sm:w-32" disabled={pending || !question.trim()}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : "Ask"}
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {CAREER_AI_EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => {
              setQuestion(example);
              void ask(example);
            }}
            className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {example}
          </button>
        ))}
      </div>

      {!configured ? (
        <p className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
          Career AI isn't connected yet. Add <code>VITE_OPENROUTER_API_KEY</code> to your .env to enable it.
        </p>
      ) : null}

      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      {answer ? (
        <div className="whitespace-pre-wrap rounded-xl border border-border bg-secondary/30 p-4 text-sm leading-relaxed">
          {answer}
        </div>
      ) : null}
    </Card>
  );
}

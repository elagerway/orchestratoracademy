"use client";

import { useState } from "react";
import { Terminal, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LabChallenge } from "@/lib/types/lab-challenges";

interface LabChallengeProps {
  challenge: LabChallenge;
  lessonId: string;
}

interface VerifyResult {
  verified: boolean;
  feedback: string;
  xp_earned: number;
  achievements: string[];
}

export function LabChallengeCard({ challenge, lessonId }: LabChallengeProps) {
  const [evidence, setEvidence] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);

  async function handleSubmit() {
    if (!evidence.trim() || submitting) return;
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/verify-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson_id: lessonId,
          lab_type: challenge.labType,
          evidence: evidence.trim(),
        }),
      });

      if (res.ok) {
        setResult(await res.json());
      } else {
        setResult({ verified: false, feedback: "Submission failed. Try again.", xp_earned: 0, achievements: [] });
      }
    } catch {
      setResult({ verified: false, feedback: "Network error. Try again.", xp_earned: 0, achievements: [] });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-border">
      <div className="flex items-center gap-2 bg-neutral-800 px-5 py-3">
        <Terminal className="size-4 text-emerald-400" />
        <span className="text-sm font-medium text-neutral-300">Hands-On Lab</span>
        <span className="ml-auto rounded-full bg-emerald-accent/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-accent">
          +{challenge.xpReward} XP
        </span>
      </div>

      <div className="bg-neutral-950 p-5">
        <h4 className="font-medium text-white">{challenge.title}</h4>
        <p className="mt-2 text-sm text-neutral-400">{challenge.instructions}</p>

        <textarea
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
          placeholder="Paste your output here..."
          className="mt-4 min-h-[100px] w-full resize-none rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 font-mono text-sm text-white outline-none placeholder:text-neutral-600 focus:border-emerald-accent/50"
          spellCheck={false}
          disabled={submitting}
        />

        <div className="mt-2 text-xs text-neutral-600">{challenge.hint}</div>

        <div className="mt-4 flex items-center gap-3">
          <Button
            onClick={handleSubmit}
            disabled={!evidence.trim() || submitting}
            className="bg-emerald-accent text-emerald-accent-foreground hover:bg-emerald-accent/90"
            size="sm"
          >
            {submitting ? "Verifying..." : "Submit"}
          </Button>

          {result && (
            <div className={`flex items-center gap-1.5 text-sm ${result.verified ? "text-emerald-400" : "text-red-400"}`}>
              {result.verified ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
              {result.feedback}
            </div>
          )}
        </div>

        {result?.xp_earned ? (
          <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-emerald-accent">
            <Sparkles className="size-4" />
            +{result.xp_earned} XP earned!
          </div>
        ) : null}

        {result?.achievements.map((a) => (
          <div key={a} className="mt-1 text-sm text-amber-400">
            🏆 Achievement unlocked: {a}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";

interface LessonCompleteButtonProps {
  lessonId: string;
  isCompleted: boolean;
}

export function LessonCompleteButton({
  lessonId,
  isCompleted: initialCompleted,
}: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isLoading, setIsLoading] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleToggleComplete() {
    setIsLoading(true);
    setXpEarned(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      if (isCompleted) {
        const { error } = await supabase
          .from("user_progress")
          .update({ completed: false, completed_at: null })
          .eq("user_id", user.id)
          .eq("lesson_id", lessonId);

        if (error) throw error;
        setIsCompleted(false);
      } else {
        const { error } = await supabase.from("user_progress").upsert(
          {
            user_id: user.id,
            lesson_id: lessonId,
            completed: true,
            completed_at: new Date().toISOString(),
          },
          { onConflict: "user_id,lesson_id" }
        );

        if (error) throw error;
        setIsCompleted(true);

        // Award XP
        try {
          const res = await fetch("/api/gamification/lesson-xp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lesson_id: lessonId }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.xpEarned > 0) {
              setXpEarned(data.xpEarned);
              setTimeout(() => setXpEarned(null), 3000);
            }
          }
        } catch {
          // XP is bonus, don't fail the completion
        }
      }

      router.refresh();
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative inline-block">
      <Button
        onClick={handleToggleComplete}
        disabled={isLoading}
        variant={isCompleted ? "secondary" : "default"}
        size="lg"
        className={isCompleted ? "" : "bg-emerald-accent text-emerald-accent-foreground hover:bg-emerald-accent/90"}
      >
        {isCompleted ? (
          <>
            <CheckCircle2 className="size-4 text-green-600" />
            Completed
          </>
        ) : (
          <>
            <Circle className="size-4" />
            Mark as Complete
          </>
        )}
      </Button>
      {xpEarned && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="rounded-lg bg-emerald-accent px-3 py-1.5 text-xs font-bold text-white shadow-lg">
            <Sparkles className="mr-1 inline size-3" />
            +{xpEarned} XP
          </div>
          <div className="mx-auto h-0 w-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-emerald-accent" />
        </div>
      )}
    </div>
  );
}

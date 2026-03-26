"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";

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
  const router = useRouter();
  const supabase = createClient();

  async function handleToggleComplete() {
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      if (isCompleted) {
        // Mark as incomplete
        await supabase
          .from("user_progress")
          .update({ completed: false, completed_at: null })
          .eq("user_id", user.id)
          .eq("lesson_id", lessonId);

        setIsCompleted(false);
      } else {
        // Mark as complete - upsert
        await supabase.from("user_progress").upsert(
          {
            user_id: user.id,
            lesson_id: lessonId,
            completed: true,
            completed_at: new Date().toISOString(),
          },
          { onConflict: "user_id,lesson_id" }
        );

        setIsCompleted(true);
      }

      router.refresh();
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleToggleComplete}
      disabled={isLoading}
      variant={isCompleted ? "secondary" : "default"}
      size="lg"
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
  );
}

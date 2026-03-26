"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { PlayCircle, Loader2 } from "lucide-react";

interface EnrollButtonProps {
  courseId: string;
  firstLessonUrl: string;
}

export function EnrollButton({ courseId, firstLessonUrl }: EnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleEnroll() {
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Redirect to login if not authenticated
        router.push("/auth/login");
        return;
      }

      const { error } = await supabase.from("user_enrollments").insert({
        user_id: user.id,
        course_id: courseId,
      });

      if (error) {
        // If already enrolled (unique constraint), just navigate
        if (error.code === "23505") {
          router.push(firstLessonUrl);
          return;
        }
        console.error("Error enrolling:", error);
        return;
      }

      router.push(firstLessonUrl);
    } catch (error) {
      console.error("Error enrolling:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button onClick={handleEnroll} disabled={isLoading} size="lg">
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Enrolling...
        </>
      ) : (
        <>
          <PlayCircle className="size-4" />
          Start Course
        </>
      )}
    </Button>
  );
}

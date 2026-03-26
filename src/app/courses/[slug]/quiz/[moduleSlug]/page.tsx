import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ModuleQuiz } from "@/components/gamification/module-quiz";
import { ChevronLeft, Trophy, Lock, BookOpen } from "lucide-react";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import type { ModuleQuiz as ModuleQuizType, CourseWithModules } from "@/lib/types/database";

interface QuizPageProps {
  params: Promise<{ slug: string; moduleSlug: string }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { slug, moduleSlug } = await params;
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/courses/${slug}/quiz/${moduleSlug}`);
  }

  // Fetch course with modules and lessons
  const { data: course } = await supabase
    .from("courses")
    .select("*, modules(*, lessons(*))")
    .eq("slug", slug)
    .single();

  if (!course) notFound();

  const typedCourse = course as CourseWithModules;
  typedCourse.modules = typedCourse.modules
    .sort((a, b) => a.order - b.order)
    .map((mod) => ({
      ...mod,
      lessons: mod.lessons.sort((a, b) => a.order - b.order),
    }));

  // Find the module
  const currentModule = typedCourse.modules.find((m) => m.slug === moduleSlug);
  if (!currentModule) notFound();

  // Check enrollment
  const { data: enrollment } = await supabase
    .from("user_enrollments")
    .select("id")
    .eq("course_id", typedCourse.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!enrollment) {
    redirect(`/courses/${slug}`);
  }

  // Check all lessons in this module are completed
  const lessonIds = currentModule.lessons.map((l) => l.id);
  const { data: progress } = await supabase
    .from("user_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("completed", true)
    .in("lesson_id", lessonIds);

  const completedIds = new Set((progress ?? []).map((p) => p.lesson_id));
  const completedCount = lessonIds.filter((id) => completedIds.has(id)).length;
  const allLessonsComplete = completedCount === lessonIds.length;

  // Fetch the quiz
  const { data: quiz } = await supabase
    .from("module_quizzes")
    .select("*")
    .eq("module_id", currentModule.id)
    .maybeSingle();

  if (!quiz) notFound();

  // Check if already passed
  const { data: result } = await supabase
    .from("module_quiz_results")
    .select("passed, score, total, xp_earned")
    .eq("module_quiz_id", quiz.id)
    .eq("user_id", user.id)
    .maybeSingle();

  const alreadyPassed = result?.passed ?? false;

  // Find the next module for "Continue" link
  const currentModuleIndex = typedCourse.modules.findIndex((m) => m.id === currentModule.id);
  const nextModule = typedCourse.modules[currentModuleIndex + 1];
  const nextLessonUrl = nextModule?.lessons?.[0]
    ? `/courses/${slug}/lessons/${nextModule.lessons[0].slug}`
    : `/courses/${slug}`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-8">
      {/* Back link */}
      <Link
        href={`/courses/${slug}`}
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Back to {typedCourse.title}
      </Link>

      {!allLessonsComplete ? (
        <div className="text-center">
          <Lock className="mx-auto size-12 text-muted-foreground" />
          <h1 className="mt-4 font-heading text-2xl font-bold">Complete the lessons first</h1>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Finish all lessons in <strong>{currentModule.title}</strong> to unlock this quiz.
          </p>
          <div className="mx-auto mt-6 max-w-xs">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">{completedCount} of {lessonIds.length} lessons</span>
              <span className="font-medium">{Math.round((completedCount / lessonIds.length) * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-emerald-accent transition-all"
                style={{ width: `${(completedCount / lessonIds.length) * 100}%` }}
              />
            </div>
          </div>
          {(() => {
            const firstIncomplete = currentModule.lessons.find((l) => !completedIds.has(l.id));
            return firstIncomplete ? (
              <div className="mt-8">
                <Link href={`/courses/${slug}/lessons/${firstIncomplete.slug}`}>
                  <Button size="lg">
                    <BookOpen className="size-4" />
                    Continue Learning
                  </Button>
                </Link>
              </div>
            ) : null;
          })()}
        </div>
      ) : alreadyPassed ? (
        <div className="text-center">
          <Trophy className="mx-auto size-16 text-amber-500" />
          <h1 className="mt-4 font-heading text-3xl font-bold">Quiz Complete!</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            You scored {result?.score}/{result?.total} on the {currentModule.title} quiz
          </p>
          <p className="mt-1 font-semibold text-emerald-accent">+{result?.xp_earned || quiz.xp_reward} XP earned</p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href={nextLessonUrl}>
              <Button size="lg" className="bg-emerald-accent text-emerald-accent-foreground hover:bg-emerald-accent/90">
                {nextModule ? "Continue to Next Module" : "Back to Course"}
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <ModuleQuiz
            quiz={quiz as ModuleQuizType}
            moduleTitle={currentModule.title}
            courseSlug={slug}
          />
        </div>
      )}
    </div>
  );
}

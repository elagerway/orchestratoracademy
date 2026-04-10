import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LessonCompleteButton } from "@/components/courses/lesson-complete-button";
import { LessonContent } from "@/components/courses/lesson-content";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  PlayCircle,
  FileText,
  Zap,
  HelpCircle,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  CourseWithModules,
  Lesson,
  UserProgress,
} from "@/lib/types/database";

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>;
}

function getContentTypeIcon(type: Lesson["content_type"]) {
  switch (type) {
    case "video":
      return <PlayCircle className="size-4" />;
    case "text":
      return <FileText className="size-4" />;
    case "interactive":
      return <Zap className="size-4" />;
    case "quiz":
      return <HelpCircle className="size-4" />;
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params;
  const supabase = await createClient();

  // Fetch course with all modules and lessons for sidebar nav
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("*, modules(*, lessons(*))")
    .eq("slug", slug)
    .single();

  if (courseError || !course) {
    notFound();
  }

  const typedCourse = course as CourseWithModules;

  // Sort modules and lessons
  typedCourse.modules = typedCourse.modules
    .sort((a, b) => a.order - b.order)
    .map((mod) => ({
      ...mod,
      lessons: mod.lessons.sort((a, b) => a.order - b.order),
    }));

  // Find current lesson and its module
  let currentLesson: Lesson | null = null;
  let currentModuleTitle: string = "";
  let currentModuleId: string = "";
  let currentModuleSlug: string = "";
  let isLastLessonInModule = false;
  for (const mod of typedCourse.modules) {
    const found = mod.lessons.find((l) => l.slug === lessonSlug);
    if (found) {
      currentLesson = found;
      currentModuleTitle = mod.title;
      currentModuleId = mod.id;
      currentModuleSlug = mod.slug;
      const lastLesson = mod.lessons[mod.lessons.length - 1];
      isLastLessonInModule = lastLesson?.id === found.id;
      break;
    }
  }

  if (!currentLesson) {
    notFound();
  }

  // Build flat ordered list of lessons for prev/next navigation
  const allLessons = typedCourse.modules.flatMap((mod) => mod.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson!.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Check auth and enrollment
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/courses/${slug}/lessons/${lessonSlug}`);
  }

  // Verify user is enrolled in this course
  const { data: enrollment } = await supabase
    .from("user_enrollments")
    .select("id")
    .eq("course_id", typedCourse.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!enrollment) {
    redirect(`/courses/${slug}`);
  }

  let completedLessonIds: Set<string> = new Set();
  let isCurrentLessonComplete = false;

  {
    const allLessonIds = allLessons.map((l) => l.id);

    const { data: progress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("completed", true)
      .in("lesson_id", allLessonIds);

    if (progress) {
      completedLessonIds = new Set(
        (progress as UserProgress[]).map((p) => p.lesson_id)
      );
    }

    isCurrentLessonComplete = completedLessonIds.has(currentLesson.id);
  }

  // Fetch all module quizzes for sidebar display
  const allModuleIds = typedCourse.modules.map((m) => m.id);
  const { data: allModuleQuizzes } = await supabase
    .from("module_quizzes")
    .select("id, module_id")
    .in("module_id", allModuleIds);

  const sidebarQuizByModule = new Map<string, string>();
  const sidebarPassedQuizIds = new Set<string>();
  if (allModuleQuizzes) {
    for (const q of allModuleQuizzes) {
      sidebarQuizByModule.set(q.module_id, q.id);
    }
    const quizIds = allModuleQuizzes.map((q) => q.id);
    const { data: quizResults } = await supabase
      .from("module_quiz_results")
      .select("module_quiz_id")
      .eq("user_id", user.id)
      .eq("passed", true)
      .in("module_quiz_id", quizIds);
    if (quizResults) {
      for (const r of quizResults) {
        sidebarPassedQuizIds.add(r.module_quiz_id);
      }
    }
  }

  // Fetch module quiz if this is the last lesson in the module
  let moduleQuiz = null;
  let quizAlreadyPassed = false;
  if (isLastLessonInModule) {
    const { data: quiz } = await supabase
      .from("module_quizzes")
      .select("*")
      .eq("module_id", currentModuleId)
      .maybeSingle();

    if (quiz) {
      moduleQuiz = quiz;
      const { data: result } = await supabase
        .from("module_quiz_results")
        .select("passed")
        .eq("module_quiz_id", quiz.id)
        .eq("user_id", user.id)
        .maybeSingle();
      quizAlreadyPassed = result?.passed ?? false;
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="hidden w-72 shrink-0 overflow-y-auto border-r bg-muted/30 p-4 lg:block">
        <Link
          href={`/courses/${slug}`}
          className="mb-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to course
        </Link>

        <h3 className="mb-3 text-sm font-semibold">{typedCourse.title}</h3>

        <nav className="space-y-4">
          {typedCourse.modules.map((mod) => (
            <div key={mod.id}>
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {mod.title}
              </p>
              <ul className="space-y-0.5">
                {mod.lessons.map((lesson) => {
                  const isActive = lesson.id === currentLesson!.id;
                  const isComplete = completedLessonIds.has(lesson.id);
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/courses/${slug}/lessons/${lesson.slug}`}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                          isActive
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {isComplete ? (
                          <CheckCircle2 className="size-3.5 shrink-0 text-green-600" />
                        ) : (
                          <BookOpen className="size-3.5 shrink-0" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </Link>
                    </li>
                  );
                })}
                {sidebarQuizByModule.has(mod.id) && (() => {
                  const quizId = sidebarQuizByModule.get(mod.id)!;
                  const isPassed = sidebarPassedQuizIds.has(quizId);
                  return (
                    <li>
                      <Link
                        href={`/courses/${slug}/quiz/${mod.slug}`}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {isPassed ? (
                          <Trophy className="size-3.5 shrink-0 text-amber-500" />
                        ) : (
                          <Zap className="size-3.5 shrink-0 text-emerald-accent" />
                        )}
                        <span className="truncate font-medium">Quiz</span>
                      </Link>
                    </li>
                  );
                })()}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href={`/courses/${slug}`} className="hover:text-foreground">
              {typedCourse.title}
            </Link>
            <ChevronRight className="size-3" />
            <span>{currentModuleTitle}</span>
            <ChevronRight className="size-3" />
            <span className="text-foreground">{currentLesson.title}</span>
          </div>

          {/* Lesson header */}
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-3">
              <Badge variant="outline">
                {getContentTypeIcon(currentLesson.content_type)}
                <span className="ml-1">{currentLesson.content_type}</span>
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {(() => {
                  const words = (currentLesson.content ?? "").split(/\s+/).length;
                  const readMin = Math.ceil(words / 200);
                  const total = currentLesson.content_type === "video" ? 3 + readMin : readMin;
                  return `${total} min`;
                })()}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {currentLesson.title}
            </h1>
          </div>

          {/* Lesson content */}
          <LessonContent
            content={currentLesson.content}
            videoUrl={currentLesson.video_url}
            contentType={currentLesson.content_type}
            lessonSlug={currentLesson.slug}
            lessonTitle={currentLesson.title}
            courseSlug={slug}
            nextLessonSlug={nextLesson?.slug}
            nextLessonTitle={nextLesson?.title}
          />

          {/* Mark complete + navigation */}
          <div className="border-t pt-6">
            <div className="mb-6">
              <LessonCompleteButton
                lessonId={currentLesson.id}
                isCompleted={isCurrentLessonComplete}
              />
            </div>

            {!isCurrentLessonComplete ? (
              <p className="text-sm text-muted-foreground">
                Mark this lesson as complete to continue.
              </p>
            ) : (
              <div className="flex items-center justify-between">
                {prevLesson ? (
                  <Link href={`/courses/${slug}/lessons/${prevLesson.slug}`}>
                    <Button variant="outline" size="lg">
                      <ChevronLeft className="size-4" />
                      Previous
                    </Button>
                  </Link>
                ) : (
                  <div />
                )}
                {isLastLessonInModule && moduleQuiz && !quizAlreadyPassed ? (
                  <Link href={`/courses/${slug}/quiz/${currentModuleSlug}`}>
                    <Button size="lg" className="bg-emerald-accent text-emerald-accent-foreground hover:bg-emerald-accent/90">
                      <Zap className="size-4" />
                      Take Module Quiz
                    </Button>
                  </Link>
                ) : nextLesson ? (
                  <Link href={`/courses/${slug}/lessons/${nextLesson.slug}`}>
                    <Button size="lg">
                      Next
                      <ChevronRight className="size-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/courses/${slug}`}>
                    <Button size="lg">
                      Back to Course
                      <ChevronRight className="size-4" />
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

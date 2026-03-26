import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { EnrollButton } from "@/components/courses/enroll-button";
import { PaywallBanner } from "@/components/courses/paywall-banner";
import { BookOpen, CheckCircle2, ChevronRight, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseWithModules, UserProgress } from "@/lib/types/database";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: course, error } = await supabase
    .from("courses")
    .select("*, modules(*, lessons(*))")
    .eq("slug", slug)
    .single();

  if (error || !course) {
    notFound();
  }

  const typedCourse = course as CourseWithModules;

  // Sort modules and lessons by order
  typedCourse.modules = typedCourse.modules
    .sort((a, b) => a.order - b.order)
    .map((mod) => ({
      ...mod,
      lessons: mod.lessons.sort((a, b) => a.order - b.order),
    }));

  const totalLessons = typedCourse.modules.reduce(
    (sum, mod) => sum + mod.lessons.length,
    0
  );

  // Check if user is authenticated and enrolled
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isEnrolled = false;
  let completedLessonIds: Set<string> = new Set();
  let firstLessonSlug: string | null = null;
  let nextLessonSlug: string | null = null;
  let nextLessonCourseSlug: string = slug;
  let hasActiveSubscription = false;

  // Find first lesson
  if (typedCourse.modules.length > 0 && typedCourse.modules[0].lessons.length > 0) {
    firstLessonSlug = typedCourse.modules[0].lessons[0].slug;
  }

  if (user) {
    // Check subscription status for paid courses
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .in("plan", ["pro", "team"])
      .eq("status", "active")
      .maybeSingle();

    hasActiveSubscription = !!subscription;

    const { data: enrollment } = await supabase
      .from("user_enrollments")
      .select("*")
      .eq("course_id", typedCourse.id)
      .eq("user_id", user.id)
      .maybeSingle();

    isEnrolled = !!enrollment;

    if (isEnrolled) {
      // Get all lesson IDs for this course
      const allLessonIds = typedCourse.modules.flatMap((mod) =>
        mod.lessons.map((l) => l.id)
      );

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

      // Find next incomplete lesson
      for (const mod of typedCourse.modules) {
        for (const lesson of mod.lessons) {
          if (!completedLessonIds.has(lesson.id)) {
            nextLessonSlug = lesson.slug;
            break;
          }
        }
        if (nextLessonSlug) break;
      }
    }
  }

  const completedCount = completedLessonIds.size;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Show paywall for paid courses when user has no active pro/team subscription
  const showPaywall = !typedCourse.is_free && !hasActiveSubscription;

  if (showPaywall) {
    return (
      <div className="container mx-auto px-4 py-12">
        {/* Course header (visible even behind paywall) */}
        <div className="mb-4 max-w-3xl">
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="default">
              {`$${typedCourse.price ?? ""}`}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{typedCourse.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{typedCourse.description}</p>
        </div>

        <PaywallBanner courseName={typedCourse.title} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Course header */}
      <div className="mb-8 max-w-3xl">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant={typedCourse.is_free ? "secondary" : "default"}>
            {typedCourse.is_free ? "Free" : `$${typedCourse.price ?? ""}`}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{typedCourse.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{typedCourse.description}</p>

        <div className="mt-6">
          {isEnrolled ? (
            <div className="space-y-4">
              <Progress value={progressPercent}>
                <ProgressLabel>Course Progress</ProgressLabel>
                <ProgressValue>
                  {() => `${completedCount}/${totalLessons} lessons`}
                </ProgressValue>
              </Progress>
              {nextLessonSlug ? (
                <Link
                  href={`/courses/${slug}/lessons/${nextLessonSlug}`}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                >
                  <PlayCircle className="size-4" />
                  Continue Learning
                </Link>
              ) : (
                <p className="text-sm font-medium text-green-600">
                  <CheckCircle2 className="mr-1 inline size-4" />
                  Course completed!
                </p>
              )}
            </div>
          ) : (
            <EnrollButton
              courseId={typedCourse.id}
              firstLessonUrl={
                firstLessonSlug
                  ? `/courses/${slug}/lessons/${firstLessonSlug}`
                  : `/courses/${slug}`
              }
            />
          )}
        </div>
      </div>

      {/* Module list */}
      <div className="max-w-3xl space-y-4">
        <h2 className="text-xl font-semibold">Course Content</h2>
        {typedCourse.modules.map((mod, modIndex) => {
          const modLessonIds = mod.lessons.map((l) => l.id);
          const modCompleted = modLessonIds.filter((id) =>
            completedLessonIds.has(id)
          ).length;

          return (
            <Card key={mod.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Module {modIndex + 1}: {mod.title}
                  </CardTitle>
                  {isEnrolled && (
                    <span className="text-xs text-muted-foreground">
                      {modCompleted}/{mod.lessons.length} complete
                    </span>
                  )}
                </div>
                {mod.description && (
                  <p className="text-sm text-muted-foreground">{mod.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {mod.lessons.map((lesson) => {
                    const isComplete = completedLessonIds.has(lesson.id);
                    return (
                      <li key={lesson.id}>
                        {isEnrolled ? (
                          <Link
                            href={`/courses/${slug}/lessons/${lesson.slug}`}
                            className={cn(
                              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                              isComplete && "text-muted-foreground"
                            )}
                          >
                            {isComplete ? (
                              <CheckCircle2 className="size-4 shrink-0 text-green-600" />
                            ) : (
                              <BookOpen className="size-4 shrink-0 text-muted-foreground" />
                            )}
                            <span className="flex-1">{lesson.title}</span>
                            <Badge variant="outline" className="text-[10px]">
                              {lesson.content_type}
                            </Badge>
                            <ChevronRight className="size-4 text-muted-foreground" />
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground">
                            <BookOpen className="size-4 shrink-0" />
                            <span className="flex-1">{lesson.title}</span>
                            <Badge variant="outline" className="text-[10px]">
                              {lesson.content_type}
                            </Badge>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

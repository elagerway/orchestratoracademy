import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  PlayCircle,
  Trophy,
} from "lucide-react";
import type {
  CourseWithModules,
  UserProgress,
} from "@/lib/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Single query: enrollments with full course → modules → lessons
  const { data: enrollments } = await supabase
    .from("user_enrollments")
    .select("*, courses(*, modules(*, lessons(*)))")
    .eq("user_id", user.id);

  // Fetch all completed progress for this user
  const { data: completedProgress } = await supabase
    .from("user_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("completed", true);

  const completedLessonIds = new Set(
    ((completedProgress as Pick<UserProgress, "lesson_id">[] | null) ?? []).map(
      (p) => p.lesson_id
    )
  );

  // Process enrollments — no additional queries needed
  const enrolledCourses: Array<{
    course: CourseWithModules;
    totalLessons: number;
    completedLessons: number;
    progressPercent: number;
    nextLessonSlug: string | null;
  }> = [];

  if (enrollments) {
    for (const enrollment of enrollments) {
      const course = (enrollment as Record<string, unknown>)
        .courses as CourseWithModules | null;
      if (!course) continue;

      // Sort modules and lessons
      course.modules = (course.modules ?? [])
        .sort((a, b) => a.order - b.order)
        .map((mod) => ({
          ...mod,
          lessons: (mod.lessons ?? []).sort((a, b) => a.order - b.order),
        }));

      const allLessons = course.modules.flatMap((mod) => mod.lessons);
      const totalLessons = allLessons.length;
      const completedLessons = allLessons.filter((l) =>
        completedLessonIds.has(l.id)
      ).length;

      // Find next incomplete lesson
      let nextLessonSlug: string | null = null;
      for (const lesson of allLessons) {
        if (!completedLessonIds.has(lesson.id)) {
          nextLessonSlug = lesson.slug;
          break;
        }
      }

      enrolledCourses.push({
        course,
        totalLessons,
        completedLessons,
        progressPercent:
          totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0,
        nextLessonSlug,
      });
    }
  }

  // Overall stats — scoped to enrolled courses only
  const totalCoursesEnrolled = enrolledCourses.length;
  const totalLessonsOverall = enrolledCourses.reduce(
    (sum, c) => sum + c.totalLessons,
    0
  );
  const totalLessonsCompleted = enrolledCourses.reduce(
    (sum, c) => sum + c.completedLessons,
    0
  );
  const overallPercent =
    totalLessonsOverall > 0
      ? Math.round((totalLessonsCompleted / totalLessonsOverall) * 100)
      : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Track your learning progress
        </p>
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCoursesEnrolled}</p>
              <p className="text-sm text-muted-foreground">Courses Enrolled</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
              <CheckCircle2 className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalLessonsCompleted}</p>
              <p className="text-sm text-muted-foreground">Lessons Completed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Trophy className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overallPercent}%</p>
              <p className="text-sm text-muted-foreground">
                Overall Completion
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled courses */}
      <h2 className="mb-4 text-xl font-semibold">My Courses</h2>

      {enrolledCourses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <BookOpen className="size-12 text-muted-foreground" />
            <div>
              <p className="font-medium">No courses yet</p>
              <p className="text-sm text-muted-foreground">
                Browse the catalog to find your first course
              </p>
            </div>
            <Link href="/courses">
              <Button>Browse Courses</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map(
            ({
              course,
              totalLessons,
              completedLessons,
              progressPercent,
              nextLessonSlug,
            }) => (
              <Card key={course.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="leading-snug">
                      {course.title}
                    </CardTitle>
                    {progressPercent === 100 && (
                      <Badge variant="secondary">
                        <CheckCircle2 className="mr-1 size-3" />
                        Done
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto space-y-4">
                  <Progress value={progressPercent}>
                    <ProgressLabel className="text-xs">Progress</ProgressLabel>
                    <ProgressValue>
                      {() => `${completedLessons}/${totalLessons}`}
                    </ProgressValue>
                  </Progress>

                  {nextLessonSlug ? (
                    <Link
                      href={`/courses/${course.slug}/lessons/${nextLessonSlug}`}
                    >
                      <Button className="w-full" size="lg">
                        <PlayCircle className="size-4" />
                        Continue
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/courses/${course.slug}`}>
                      <Button variant="outline" className="w-full" size="lg">
                        Review Course
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )
          )}
        </div>
      )}
    </div>
  );
}

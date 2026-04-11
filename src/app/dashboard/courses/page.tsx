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
import { CourseProgress } from "@/components/courses/course-progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  CheckCircle2,
  PlayCircle,
  Plus,
} from "lucide-react";
import type {
  CourseWithModules,
  UserProgress,
} from "@/lib/types/database";

export default async function MyCoursesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: enrollments } = await supabase
    .from("user_enrollments")
    .select("*, courses(*, modules(*, lessons(*)))")
    .eq("user_id", user.id);

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

  // Fetch all courses for recommendations (exclude hidden)
  const { data: allCourses } = await supabase
    .from("courses")
    .select("id, title, slug, description, is_free, order")
    .eq("active", true)
    .order("order");

  const enrolledCourseIds = new Set(
    (enrollments ?? []).map((e) => (e as Record<string, unknown>).course_id as string)
  );

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

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">My Courses</h1>
          <p className="mt-1 text-muted-foreground">
            {enrolledCourses.length} course{enrolledCourses.length !== 1 ? "s" : ""} enrolled
          </p>
        </div>
        <Link href="/courses">
          <Button variant="outline" size="sm">
            <Plus className="size-4" />
            Browse Courses
          </Button>
        </Link>
      </div>

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
                  <CourseProgress
                    value={progressPercent}
                    label="Progress"
                    display={`${completedLessons}/${totalLessons}`}
                  />

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

      {/* Recommended courses */}
      {(() => {
        const recommended = (allCourses ?? []).filter(
          (c) => !enrolledCourseIds.has(c.id)
        );
        if (recommended.length === 0) return null;
        return (
          <div className="mt-10">
            <h2 className="mb-4 text-xl font-semibold">Recommended Next</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommended.map((course) => (
                <Card key={course.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="leading-snug">
                        {course.title}
                      </CardTitle>
                      {course.is_free ? (
                        <Badge variant="secondary" className="bg-emerald-accent/10 text-emerald-accent">
                          Free
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pro</Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Link href={`/courses/${course.slug}`}>
                      <Button variant="outline" className="w-full" size="lg">
                        View Course
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

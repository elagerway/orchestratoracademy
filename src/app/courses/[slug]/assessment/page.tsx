import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AssessmentQuiz } from "@/components/assessment/assessment-quiz";
import { CheckCircle2, BookOpen, Clock, Award } from "lucide-react";
import type { Assessment, CourseWithModules, UserProgress } from "@/lib/types/database";

interface AssessmentPageProps {
  params: Promise<{ slug: string }>;
}

export default async function AssessmentPage({ params }: AssessmentPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch course with modules and lessons
  const { data: course, error } = await supabase
    .from("courses")
    .select("*, modules(*, lessons(*))")
    .eq("slug", slug)
    .single();

  if (error || !course) {
    notFound();
  }

  const typedCourse = course as CourseWithModules;

  // Check enrollment
  const { data: enrollment } = await supabase
    .from("user_enrollments")
    .select("*")
    .eq("course_id", typedCourse.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!enrollment) {
    redirect(`/courses/${slug}`);
  }

  // Check if all lessons are completed
  const allLessonIds = typedCourse.modules.flatMap((mod) =>
    mod.lessons.map((l) => l.id)
  );

  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("completed", true)
    .in("lesson_id", allLessonIds);

  const completedLessonIds = new Set(
    ((progress as UserProgress[]) ?? []).map((p) => p.lesson_id)
  );

  const allLessonsCompleted =
    allLessonIds.length > 0 && allLessonIds.every((id) => completedLessonIds.has(id));

  if (!allLessonsCompleted) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <BookOpen className="size-12 text-muted-foreground" />
            <div>
              <h1 className="text-xl font-semibold font-heading">
                Complete All Lessons First
              </h1>
              <p className="mt-2 text-muted-foreground">
                You need to complete all lessons in this course before taking the
                assessment. You have completed {completedLessonIds.size} of{" "}
                {allLessonIds.length} lessons.
              </p>
            </div>
            <Link href={`/courses/${slug}`}>
              <Button>
                <BookOpen className="size-4" />
                Back to Course
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user already has a certificate for this course
  const { data: existingCert } = await supabase
    .from("certificates")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", typedCourse.id)
    .maybeSingle();

  if (existingCert) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-emerald-accent/10">
              <Award className="size-8 text-emerald-accent" />
            </div>
            <div>
              <h1 className="text-xl font-semibold font-heading">
                You&apos;ve Already Passed!
              </h1>
              <p className="mt-2 text-muted-foreground">
                Congratulations! You scored {existingCert.assessment_score}% on this
                assessment and earned your certificate.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href={`/certificates/${existingCert.certificate_number}`}>
                <Button>
                  <Award className="size-4" />
                  View Certificate
                </Button>
              </Link>
              <Link href={`/courses/${slug}`}>
                <Button variant="outline">Back to Course</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch the assessment
  const { data: assessment } = await supabase
    .from("assessments")
    .select("*")
    .eq("course_id", typedCourse.id)
    .maybeSingle();

  if (!assessment) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <Clock className="size-12 text-muted-foreground" />
            <div>
              <h1 className="text-xl font-semibold font-heading">
                Assessment Coming Soon
              </h1>
              <p className="mt-2 text-muted-foreground">
                The assessment for this course is currently being prepared. Check back
                soon!
              </p>
            </div>
            <Link href={`/courses/${slug}`}>
              <Button variant="outline">Back to Course</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const typedAssessment = assessment as Assessment;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <AssessmentQuiz assessment={typedAssessment} courseSlug={slug} />
    </div>
  );
}

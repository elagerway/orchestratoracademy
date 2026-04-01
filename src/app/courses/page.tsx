import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import type { Course } from "@/lib/types/database";

export default async function CourseCatalogPage() {
  const supabase = await createClient();

  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .order("order");

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-destructive">Failed to load courses.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Course Catalog</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Master AI orchestration with hands-on courses
        </p>
      </div>

      {(!courses || courses.length === 0) ? (
        <p className="text-center text-muted-foreground">No courses available yet. Check back soon!</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          {(courses as Course[]).map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`} className="group">
              <Card className="h-full overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="aspect-video bg-muted">
                  {course.thumbnail_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen className="size-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardHeader className="pt-5">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {course.title}
                    </CardTitle>
                    <Badge variant={course.is_free ? "secondary" : "default"} className="shrink-0">
                      {course.is_free ? "Free" : `$${course.price ?? ""}`}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2 text-sm">
                    {course.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

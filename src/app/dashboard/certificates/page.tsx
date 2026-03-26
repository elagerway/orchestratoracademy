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
import { Badge } from "@/components/ui/badge";
import { Award, ExternalLink, BookOpen, Share2 } from "lucide-react";

export default async function CertificatesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: certificates } = await supabase
    .from("certificates")
    .select("*, courses(*)")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false });

  const certs = certificates ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-heading">
          My Certificates
        </h1>
        <p className="mt-1 text-muted-foreground">
          Certificates earned from completed assessments
        </p>
      </div>

      {certs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <Award className="size-12 text-muted-foreground" />
            <div>
              <p className="font-medium">No certificates yet</p>
              <p className="text-sm text-muted-foreground">
                Complete course assessments to earn certificates
              </p>
            </div>
            <Link href="/courses">
              <Button>
                <BookOpen className="size-4" />
                Browse Courses
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {certs.map((cert) => {
            const course = cert.courses as {
              title: string;
              slug: string;
            } | null;

            const issuedDate = new Date(cert.issued_at).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            );

            const certUrl = `/certificates/${cert.certificate_number}`;
            const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              `https://orchestratoracademy.com${certUrl}`
            )}`;

            return (
              <Card key={cert.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Award className="size-5 text-emerald-accent" />
                      <CardTitle className="leading-snug">
                        {course?.title ?? "Course"}
                      </CardTitle>
                    </div>
                    <Badge className="shrink-0 bg-emerald-accent text-emerald-accent-foreground">
                      {cert.assessment_score}%
                    </Badge>
                  </div>
                  <CardDescription>
                    Issued {issuedDate}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs font-mono text-muted-foreground">
                    {cert.certificate_number}
                  </p>
                  <div className="flex gap-2">
                    <Link href={certUrl} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        <ExternalLink className="size-3" />
                        View
                      </Button>
                    </Link>
                    <a
                      href={linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full" size="sm">
                        <Share2 className="size-3" />
                        Share on LinkedIn
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

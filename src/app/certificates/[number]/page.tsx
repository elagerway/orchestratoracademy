import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle2 } from "lucide-react";

interface CertificatePageProps {
  params: Promise<{ number: string }>;
}

export default async function CertificatePage({ params }: CertificatePageProps) {
  const { number } = await params;
  const supabase = await createClient();

  // Fetch certificate with user profile and course data
  const { data: certificate, error } = await supabase
    .from("certificates")
    .select("*, profiles(*), courses(*)")
    .eq("certificate_number", number)
    .single();

  if (error || !certificate) {
    notFound();
  }

  const profile = certificate.profiles as {
    full_name: string;
    avatar_url: string | null;
  } | null;
  const course = certificate.courses as {
    title: string;
    slug: string;
  } | null;

  const issuedDate = new Date(certificate.issued_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <Card className="overflow-hidden">
        {/* Emerald top border */}
        <div className="h-2 bg-emerald-accent" />

        <CardContent className="p-8 sm:p-12">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="size-8 text-emerald-accent" />
              <span className="text-xl font-bold font-heading tracking-tight">
                OA
              </span>
            </div>
            <Badge className="gap-1 bg-emerald-accent text-emerald-accent-foreground">
              <CheckCircle2 className="size-3" />
              Verified
            </Badge>
          </div>

          {/* Certificate body */}
          <div className="space-y-6 text-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-muted-foreground">
                Certificate of Completion
              </p>
              <h1 className="mt-2 text-3xl font-bold font-heading sm:text-4xl">
                {course?.title ?? "Course"}
              </h1>
            </div>

            <div className="mx-auto h-px w-24 bg-border" />

            <div>
              <p className="text-sm text-muted-foreground">
                This certifies that
              </p>
              <p className="mt-1 text-2xl font-semibold font-heading">
                {profile?.full_name ?? "Student"}
              </p>
            </div>

            <p className="text-muted-foreground">
              has successfully completed the course assessment with a score of{" "}
              <span className="font-semibold text-emerald-accent">
                {certificate.assessment_score}%
              </span>
            </p>

            <div className="mx-auto h-px w-24 bg-border" />

            {/* Footer details */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Date Issued
                </p>
                <p className="mt-1 text-sm font-medium">{issuedDate}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Certificate No.
                </p>
                <p className="mt-1 text-sm font-medium font-mono">
                  {certificate.certificate_number}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Issued By
                </p>
                <p className="mt-1 text-sm font-medium">
                  AI Orchestrator Academy
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Verify this certificate at{" "}
        <span className="font-mono">
          orchestratoracademy.com/certificates/{certificate.certificate_number}
        </span>
      </p>
    </div>
  );
}

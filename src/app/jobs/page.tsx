import { createClient } from "@supabase/supabase-js";
import { Briefcase, MapPin, Building2, DollarSign, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60; // re-fetch every minute

export const metadata: Metadata = {
  title: "Jobs for AI Orchestrators | Orchestrator Academy",
  description: "Hand-picked roles for AI orchestrators, AI engineers, and agent builders.",
};

type Job = {
  id: string;
  title: string;
  company_name: string;
  company_logo_url: string | null;
  company_url: string | null;
  location: string | null;
  remote: boolean;
  employment_type: string;
  seniority: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  description: string;
  apply_url: string;
  posted_at: string;
};

function formatSalary(job: Job): string | null {
  if (!job.salary_min && !job.salary_max) return null;
  const fmt = (n: number) => `${(n / 1000).toFixed(0)}k`;
  const currency = job.salary_currency || "USD";
  if (job.salary_min && job.salary_max) return `${currency} ${fmt(job.salary_min)}–${fmt(job.salary_max)}`;
  if (job.salary_min) return `${currency} ${fmt(job.salary_min)}+`;
  if (job.salary_max) return `Up to ${currency} ${fmt(job.salary_max!)}`;
  return null;
}

function formatType(t: string) {
  return t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function timeAgo(iso: string) {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const days = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1 month ago";
  return `${months} months ago`;
}

export default async function JobsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("active", true)
    .order("posted_at", { ascending: false })
    .limit(100);

  const list: Job[] = jobs ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-10">
        <h1 className="font-heading text-4xl font-bold">Jobs for AI Orchestrators</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Hand-picked roles for the people building and running AI systems. Updated as we find them.
        </p>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <Briefcase className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">No open roles right now.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Check back soon — we add listings as we find good fits for orchestrators.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((job) => {
            const salary = formatSalary(job);
            return (
              <article
                key={job.id}
                className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-emerald-accent/40"
              >
                <div className="flex items-start gap-4">
                  {job.company_logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={job.company_logo_url}
                      alt={`${job.company_name} logo`}
                      className="size-12 flex-shrink-0 rounded-lg bg-muted object-cover"
                    />
                  ) : (
                    <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Building2 className="size-6 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h2 className="font-heading text-lg font-semibold">
                        <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-accent">
                          {job.title}
                        </a>
                      </h2>
                      <span className="text-xs text-muted-foreground">{timeAgo(job.posted_at)}</span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                      {job.company_url ? (
                        <a href={job.company_url} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-emerald-accent">
                          {job.company_name}
                        </a>
                      ) : (
                        <span className="font-medium text-foreground">{job.company_name}</span>
                      )}
                      {job.location && (
                        <>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="size-3.5" />
                            {job.location}
                          </span>
                        </>
                      )}
                      {job.remote && (
                        <>
                          <span>·</span>
                          <span className="rounded-full bg-emerald-accent/10 px-2 py-0.5 text-xs font-medium text-emerald-accent">
                            Remote
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                        {formatType(job.employment_type)}
                      </span>
                      {job.seniority && (
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize">
                          {job.seniority}
                        </span>
                      )}
                      {salary && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                          <DollarSign className="size-3" />
                          {salary}
                        </span>
                      )}
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                      {job.description}
                    </p>

                    <div className="mt-4">
                      <a
                        href={job.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-emerald-accent hover:underline"
                      >
                        Apply
                        <ExternalLink className="size-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-12 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Hiring AI orchestrators?{" "}
        <a
          href="mailto:hello@orchestratoracademy.com?subject=Job%20board%20submission"
          className="font-medium text-emerald-accent hover:underline"
        >
          Email us
        </a>{" "}
        — we post curated roles here.
      </div>
    </div>
  );
}

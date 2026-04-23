"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Turnstile, type TurnstileHandle } from "@/components/turnstile";
import { CheckCircle2, Briefcase } from "lucide-react";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

type Seniority = "" | "junior" | "mid" | "senior" | "staff" | "principal" | "director";
type EmploymentType = "full_time" | "contract" | "freelance" | "part_time" | "internship";

export default function JobsSubmitPage() {
  const turnstileRef = useRef<TurnstileHandle>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [remote, setRemote] = useState(false);
  const [employmentType, setEmploymentType] = useState<EmploymentType>("full_time");
  const [seniority, setSeniority] = useState<Seniority>("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [description, setDescription] = useState("");
  const [applyUrl, setApplyUrl] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (TURNSTILE_SITE_KEY && !captchaToken) {
      setError("Please complete the captcha.");
      return;
    }
    setSubmitting(true);

    const payload = {
      turnstile_token: captchaToken ?? "",
      submitter_name: submitterName,
      submitter_email: submitterEmail,
      company_name: companyName,
      company_url: companyUrl || null,
      title,
      location: location || null,
      remote,
      employment_type: employmentType,
      seniority: seniority || null,
      salary_min: salaryMin ? Number(salaryMin) : null,
      salary_max: salaryMax ? Number(salaryMax) : null,
      description,
      apply_url: applyUrl,
    };

    try {
      const res = await fetch("/api/jobs/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not submit. Try again.");
        turnstileRef.current?.reset();
        setCaptchaToken(null);
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Could not submit. Try again.");
      turnstileRef.current?.reset();
      setCaptchaToken(null);
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-emerald-accent/10">
          <CheckCircle2 className="size-7 text-emerald-accent" />
        </div>
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Submission received
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Thanks. We review every submission for fit before it goes live on the job board.
          If we have questions, we&rsquo;ll reach out to{" "}
          <span className="font-medium text-foreground">{submitterEmail}</span>.
        </p>
        <div className="mt-8">
          <Link
            href="/jobs"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
          >
            Back to the job board
          </Link>
        </div>
      </div>
    );
  }

  const inputCls = "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-emerald-accent/50";
  const labelCls = "text-sm font-medium";
  const hintCls = "mt-1 text-xs text-muted-foreground";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-accent/30 bg-emerald-accent/10 px-3 py-1 text-sm font-medium text-emerald-accent">
          <Briefcase className="size-4" />
          Post a role
        </div>
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Hiring AI orchestrators?
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Tell us about the role. We curate every submission for fit before it goes live on the
          <Link href="/jobs" className="font-medium text-emerald-accent hover:underline"> job board</Link>.
          Submissions are free. No account needed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Who's asking */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-semibold">Your details</h2>
          <p className={hintCls}>So we can follow up before publishing.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Your name<span className="text-emerald-accent"> *</span></label>
              <input
                type="text"
                required
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
                className={inputCls}
                maxLength={120}
              />
            </div>
            <div>
              <label className={labelCls}>Your email<span className="text-emerald-accent"> *</span></label>
              <input
                type="email"
                required
                value={submitterEmail}
                onChange={(e) => setSubmitterEmail(e.target.value)}
                className={inputCls}
                maxLength={200}
              />
            </div>
          </div>
        </section>

        {/* Company */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-semibold">Company</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Company name<span className="text-emerald-accent"> *</span></label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={inputCls}
                maxLength={200}
              />
            </div>
            <div>
              <label className={labelCls}>Company URL</label>
              <input
                type="url"
                placeholder="https://"
                value={companyUrl}
                onChange={(e) => setCompanyUrl(e.target.value)}
                className={inputCls}
                maxLength={500}
              />
            </div>
          </div>
        </section>

        {/* Role */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-semibold">Role</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className={labelCls}>Job title<span className="text-emerald-accent"> *</span></label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AI Orchestrator, Senior"
                className={inputCls}
                maxLength={200}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Vancouver, Remote"
                  className={inputCls}
                  maxLength={200}
                />
              </div>
              <label className="mt-6 flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={remote}
                  onChange={(e) => setRemote(e.target.checked)}
                  className="size-4 accent-emerald-accent"
                />
                Open to remote
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Employment type</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                  className={inputCls}
                >
                  <option value="full_time">Full-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                  <option value="part_time">Part-time</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Seniority</label>
                <select
                  value={seniority}
                  onChange={(e) => setSeniority(e.target.value as Seniority)}
                  className={inputCls}
                >
                  <option value="">—</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                  <option value="staff">Staff</option>
                  <option value="principal">Principal</option>
                  <option value="director">Director</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Salary range (USD)</label>
              <div className="mt-1 grid gap-2 sm:grid-cols-2">
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  placeholder="Min"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-accent/50"
                />
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  placeholder="Max"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-accent/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Description + apply */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-semibold">Description &amp; how to apply</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className={labelCls}>Description<span className="text-emerald-accent"> *</span></label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                maxLength={8000}
                placeholder="What they'll do, what you're looking for, what the team is like."
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-accent/50"
              />
              <p className={hintCls}>Plain text or light markdown — we tidy the formatting before publishing.</p>
            </div>
            <div>
              <label className={labelCls}>Apply URL<span className="text-emerald-accent"> *</span></label>
              <input
                type="url"
                required
                placeholder="https://..."
                value={applyUrl}
                onChange={(e) => setApplyUrl(e.target.value)}
                className={inputCls}
                maxLength={500}
              />
              <p className={hintCls}>Where should candidates apply? An ATS link or dedicated email mailto: both work.</p>
            </div>
          </div>
        </section>

        {/* Captcha + submit */}
        <div className="space-y-4">
          {TURNSTILE_SITE_KEY && (
            <Turnstile
              ref={turnstileRef}
              siteKey={TURNSTILE_SITE_KEY}
              onToken={setCaptchaToken}
              onExpire={() => setCaptchaToken(null)}
            />
          )}
          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting || (!!TURNSTILE_SITE_KEY && !captchaToken)}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-accent px-6 text-sm font-medium text-emerald-accent-foreground transition-colors hover:bg-emerald-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit for review"}
            </button>
            <p className="text-xs text-muted-foreground">
              We&rsquo;ll email you if we need anything.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarClock, Zap, Shield, CheckCircle2, CreditCard } from "lucide-react";

function CanceledBanner() {
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled") === "1";
  if (!canceled) return null;
  return (
    <p className="mt-4 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
      Checkout canceled. Try again when you&rsquo;re ready — no charge was made.
    </p>
  );
}

function PayCTA() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/book-checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Could not start checkout. Try again.");
        setLoading(false);
      }
    } catch {
      setError("Could not start checkout. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 text-center">
      <p className="text-sm font-medium text-muted-foreground">Reserve your session</p>
      <p className="mt-2 font-heading text-3xl font-bold tracking-tight">
        $220 <span className="text-base font-normal text-muted-foreground">/ 1 hour</span>
      </p>
      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-accent px-6 text-sm font-medium text-emerald-accent-foreground transition-colors hover:bg-emerald-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <CreditCard className="size-4" />
        {loading ? "Redirecting to Stripe…" : "Pay $220 — then pick a slot"}
      </button>
      <p className="mt-3 text-xs text-muted-foreground">
        You&rsquo;ll be taken to a secure Stripe checkout. After paying you land on the scheduling page.
      </p>

      <Suspense fallback={null}>
        <CanceledBanner />
      </Suspense>
      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default function BookPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-accent/30 bg-emerald-accent/10 px-3 py-1 text-sm font-medium text-emerald-accent">
          <CalendarClock className="size-4" />
          1:1 consultation
        </div>
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Book a 1-hour session with our team
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          One hour, focused on your project. We work through your specific AI orchestration
          challenge — model choice, agent design, pipeline architecture, production
          rollout — and leave with an actionable plan.
        </p>
      </div>

      {/* Value summary */}
      <div className="mx-auto mb-10 grid max-w-4xl gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-emerald-accent/10">
            <CalendarClock className="size-4 text-emerald-accent" />
          </div>
          <p className="text-sm font-semibold">60 minutes</p>
          <p className="mt-1 text-xs text-muted-foreground">
            One focused hour, video call, no filler.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-emerald-accent/10">
            <Zap className="size-4 text-emerald-accent" />
          </div>
          <p className="text-sm font-semibold">$220 per session</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Paid up front. Scheduling unlocks immediately after checkout.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-emerald-accent/10">
            <Shield className="size-4 text-emerald-accent" />
          </div>
          <p className="text-sm font-semibold">Available this week</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Slots open for the next 7 days. Pick what works right after you pay.
          </p>
        </div>
      </div>

      {/* Pay CTA */}
      <PayCTA />

      {/* What we'll cover */}
      <div className="mx-auto mt-12 max-w-3xl">
        <h2 className="font-heading text-xl font-semibold">What we can cover</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          {[
            "Designing an agent or multi-agent system for your use case",
            "Choosing the right model, framework, and infrastructure",
            "Reviewing an existing AI workflow and finding its weak points",
            "Setting up monitoring, self-healing, or production rollout",
            "Turning a napkin sketch into a concrete 2-week build plan",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
          Not sure yet? Work through the{" "}
          <Link href="/courses" className="font-medium text-emerald-accent hover:underline">
            free courses
          </Link>{" "}
          first — they&rsquo;ll give you the vocabulary and mental models that make a 1:1
          session most productive.
        </div>
      </div>
    </div>
  );
}

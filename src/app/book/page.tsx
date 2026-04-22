"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Cal, { getCalApi } from "@calcom/embed-react";
import { CalendarClock, Zap, Shield, CheckCircle2 } from "lucide-react";

const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK || "erik-lagerway/consult";

export default function BookPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    (async () => {
      const cal = await getCalApi({});
      cal("ui", {
        theme: "auto",
        cssVarsPerTheme: {
          light: { "cal-brand": "#22c55e" },
          dark: { "cal-brand": "#34d399" },
        },
        hideEventTypeDetails: false,
      });
    })();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-accent/30 bg-emerald-accent/10 px-3 py-1 text-sm font-medium text-emerald-accent">
          <CalendarClock className="size-4" />
          1:1 consultation
        </div>
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Book a 1-hour session with Erik
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
            Paid at booking via Cal.com + Stripe. No surprise invoices.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-emerald-accent/10">
            <Shield className="size-4 text-emerald-accent" />
          </div>
          <p className="text-sm font-semibold">Available this week</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Slots open for the next 7 days. Pick what works, book in one step.
          </p>
        </div>
      </div>

      {/* Cal.com inline booking */}
      <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-border bg-card">
        {mounted ? (
          <Cal
            namespace="consult"
            calLink={CAL_LINK}
            style={{ width: "100%", height: "720px", overflow: "scroll" }}
            config={{
              layout: "month_view",
            }}
          />
        ) : (
          <div className="flex h-[720px] items-center justify-center text-sm text-muted-foreground">
            Loading booking calendar…
          </div>
        )}
      </div>

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
          first — they'll give you the vocabulary and mental models that make a 1:1
          session most productive.
        </div>
      </div>
    </div>
  );
}

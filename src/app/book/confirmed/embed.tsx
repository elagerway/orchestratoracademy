"use client";

import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK || "robotfood/consult";

export function BookConfirmedEmbed({ customerEmail }: { customerEmail: string | null }) {
  const [mounted, setMounted] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    setMounted(true);
    (async () => {
      const cal = await getCalApi({ namespace: "consult-paid" });
      cal("ui", {
        theme: "auto",
        cssVarsPerTheme: {
          light: { "cal-brand": "#22c55e" },
          dark: { "cal-brand": "#34d399" },
        },
        hideEventTypeDetails: false,
      });
      cal("on", {
        action: "bookingSuccessfulV2",
        callback: () => setBooked(true),
      });
      cal("on", {
        action: "bookingSuccessful",
        callback: () => setBooked(true),
      });
    })();
  }, []);

  return (
    <>
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-accent/30 bg-emerald-accent/10 px-3 py-1 text-sm font-medium text-emerald-accent">
          {booked ? "Session booked" : "Payment received"}
        </div>
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          {booked ? "See you then" : "You’re in — now pick a slot"}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {booked ? (
            <>
              Calendar invite sent{customerEmail ? ` to ${customerEmail}` : ""}. Check your inbox
              for the Google Meet link. If anything comes up, use the reschedule or cancel link in
              the confirmation email.
            </>
          ) : (
            <>
              Thanks{customerEmail ? `, ${customerEmail}` : ""}. Your 1-hour session is paid.
              Pick any time below and you&rsquo;ll get the calendar invite instantly.
            </>
          )}
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        {mounted ? (
          <Cal
            namespace="consult-paid"
            calLink={CAL_LINK}
            style={{ width: "100%" }}
            config={{
              layout: "month_view",
            }}
          />
        ) : (
          <div className="flex h-[480px] items-center justify-center text-sm text-muted-foreground">
            Loading scheduler…
          </div>
        )}
      </div>
    </>
  );
}

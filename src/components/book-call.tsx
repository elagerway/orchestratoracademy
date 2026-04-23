import Link from "next/link";
import { CalendarClock } from "lucide-react";

type Variant = "button" | "inline" | "card";

// Internal route — renders the Cal.com embed inline at /book
const BOOK_PATH = "/book";

export function BookCallButton({
  variant = "button",
  label,
  subtitle,
}: {
  variant?: Variant;
  label?: string;
  subtitle?: string;
}) {
  if (variant === "card") {
    return (
      <Link
        href={BOOK_PATH}
        className="group block rounded-xl border border-border bg-card p-4 transition-colors hover:border-emerald-accent/40"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-accent/10">
            <CalendarClock className="size-4 text-emerald-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {label || "1:1 Coaching"}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {subtitle || "1-hour paid consult — $220"}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "inline") {
    return (
      <Link
        href={BOOK_PATH}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-accent hover:underline"
      >
        <CalendarClock className="size-3.5" />
        {label || "Book a call"}
      </Link>
    );
  }

  return (
    <Link
      href={BOOK_PATH}
      className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-accent px-4 text-sm font-medium text-emerald-accent-foreground transition-colors hover:bg-emerald-accent/90"
    >
      <CalendarClock className="size-4" />
      {label || "Book a 1-hour call — $220"}
    </Link>
  );
}

import { Coffee } from "lucide-react";

const BMAC_URL = process.env.NEXT_PUBLIC_BMAC_URL || "https://buymeacoffee.com/orchestratoracademy";

type Variant = "button" | "inline" | "card";

export function BuyMeCoffeeButton({
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
      <a
        href={BMAC_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-xl border border-border bg-card p-4 transition-colors hover:border-amber-500/40"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
            <Coffee className="size-4 text-amber-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {label || "Buy Team a Coffee"}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {subtitle || "Help keep the lessons free"}
            </p>
          </div>
        </div>
      </a>
    );
  }

  if (variant === "inline") {
    return (
      <a
        href={BMAC_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-500 hover:underline"
      >
        <Coffee className="size-3.5" />
        {label || "Buy us a coffee"}
      </a>
    );
  }

  return (
    <a
      href={BMAC_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 text-sm font-medium text-amber-500 transition-colors hover:bg-amber-500/20"
    >
      <Coffee className="size-4" />
      {label || "Buy us a coffee"}
    </a>
  );
}

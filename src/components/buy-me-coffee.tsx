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
        className="group block rounded-xl border border-border bg-card p-5 transition-colors hover:border-amber-500/40"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
            <Coffee className="size-5 text-amber-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">
              {label || "Found this useful?"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {subtitle || "The Academy is free. If it helped, buy us a coffee."}
            </p>
          </div>
          <span className="text-xs font-medium text-amber-500 group-hover:underline">
            Tip &rarr;
          </span>
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

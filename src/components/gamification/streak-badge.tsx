"use client";

interface StreakBadgeProps {
  days: number;
}

export function StreakBadge({ days }: StreakBadgeProps) {
  if (days <= 0) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-all ${
        days >= 1
          ? "bg-amber-500/10 text-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
          : "bg-muted text-muted-foreground"
      }`}
    >
      <span className="text-base" role="img" aria-label="fire">
        🔥
      </span>
      <span>{days} day streak</span>
    </div>
  );
}

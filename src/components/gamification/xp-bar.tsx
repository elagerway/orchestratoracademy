"use client";

import { Zap } from "lucide-react";

const THRESHOLDS = [0, 100, 250, 500, 850, 1300, 1900, 2600, 3500, 4600, 5900, 7400, 9200, 11300, 13800, 16800, 20400, 24700, 29800, 35800];

function getLevel(xp: number): number {
  for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

function getLevelProgress(xp: number): { current: number; next: number; progress: number } {
  const level = getLevel(xp);
  const currentThreshold = THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = THRESHOLDS[level] ?? currentThreshold + 1000;
  const progress = ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return { current: currentThreshold, next: nextThreshold, progress: Math.min(progress, 100) };
}

interface XpBarProps {
  xp: number;
  level: number;
}

export function XpBar({ xp }: XpBarProps) {
  const level = getLevel(xp);
  const { current, next, progress } = getLevelProgress(xp);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 rounded-full bg-emerald-accent/10 px-3 py-1">
        <Zap className="size-4 text-emerald-accent" fill="currentColor" />
        <span className="text-sm font-bold text-emerald-accent">Lvl {level}</span>
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="h-2.5 w-full min-w-[120px] overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-emerald-accent transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {xp - current} / {next - current} XP to Level {level + 1}
        </span>
      </div>
    </div>
  );
}

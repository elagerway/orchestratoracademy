"use client";

import { useEffect, useState } from "react";
import { Trophy, Star, Flame, BookOpen, Zap, Award, Target, type LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  trophy: Trophy,
  star: Star,
  flame: Flame,
  "book-open": BookOpen,
  zap: Zap,
  award: Award,
  target: Target,
};

interface AchievementToastProps {
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  onDismiss?: () => void;
}

export function AchievementToast({ title, description, icon, xpReward, onDismiss }: AchievementToastProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Slide in
    const showTimer = setTimeout(() => setVisible(true), 50);
    // Start exit
    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 4500);
    // Remove
    const removeTimer = setTimeout(() => {
      onDismiss?.();
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [onDismiss]);

  const IconComponent = ICON_MAP[icon] || Trophy;

  return (
    <div
      className={`fixed right-4 top-4 z-[9999] w-80 transform transition-all duration-500 ${
        visible && !exiting ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="overflow-hidden rounded-lg border bg-emerald-accent text-emerald-accent-foreground shadow-lg">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20">
              <IconComponent className="size-5" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider opacity-80">
                Achievement Unlocked!
              </p>
              <p className="font-heading text-sm font-bold">{title}</p>
              <p className="text-xs opacity-90">{description}</p>
            </div>
            <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
              +{xpReward} XP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trophy,
  Star,
  Flame,
  BookOpen,
  Zap,
  Award,
  Target,
  Lock,
  type LucideIcon,
} from "lucide-react";
import type { Achievement, UserAchievement } from "@/lib/types/database";

const ICON_MAP: Record<string, LucideIcon> = {
  trophy: Trophy,
  star: Star,
  flame: Flame,
  "book-open": BookOpen,
  zap: Zap,
  award: Award,
  target: Target,
};

export default async function AchievementsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch all achievements
  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .order("created_at", { ascending: true });

  // Fetch user's unlocked achievements
  const { data: userAchievements } = await supabase
    .from("user_achievements")
    .select("*")
    .eq("user_id", user.id);

  const unlockedMap = new Map(
    ((userAchievements as UserAchievement[] | null) ?? []).map((ua) => [
      ua.achievement_id,
      ua,
    ])
  );

  const allAchievements = (achievements as Achievement[] | null) ?? [];
  const totalXpFromAchievements = allAchievements
    .filter((a) => unlockedMap.has(a.id))
    .reduce((sum, a) => sum + a.xp_reward, 0);
  const unlockedCount = unlockedMap.size;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Achievements
        </h1>
        <p className="mt-1 text-muted-foreground">
          Collect them all! Every achievement earns you bonus XP.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-accent/10">
              <Trophy className="size-5 text-emerald-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {unlockedCount} / {allAchievements.length}
              </p>
              <p className="text-sm text-muted-foreground">Unlocked</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Zap className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalXpFromAchievements}</p>
              <p className="text-sm text-muted-foreground">
                XP from Achievements
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Star className="size-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {allAchievements.length > 0
                  ? Math.round((unlockedCount / allAchievements.length) * 100)
                  : 0}
                %
              </p>
              <p className="text-sm text-muted-foreground">Completion</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allAchievements.map((achievement) => {
          const unlocked = unlockedMap.get(achievement.id);
          const IconComponent = ICON_MAP[achievement.icon] || Trophy;

          return (
            <Card
              key={achievement.id}
              className={`transition-all duration-200 ${
                unlocked
                  ? "border-emerald-accent/30 bg-emerald-accent/5 hover:shadow-md"
                  : "opacity-60 grayscale"
              }`}
            >
              <CardContent className="flex items-start gap-4">
                <div
                  className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${
                    unlocked
                      ? "bg-emerald-accent/10"
                      : "bg-muted"
                  }`}
                >
                  {unlocked ? (
                    <IconComponent
                      className="size-6 text-emerald-accent"
                    />
                  ) : (
                    <Lock className="size-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-heading text-sm font-bold">
                    {unlocked ? achievement.title : "???"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {unlocked ? achievement.description : "Keep learning to unlock this achievement!"}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        unlocked
                          ? "bg-emerald-accent/10 text-emerald-accent"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Zap className="size-3" />
                      +{achievement.xp_reward} XP
                    </span>
                    {unlocked && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(unlocked.unlocked_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {allAchievements.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <Trophy className="size-12 text-muted-foreground" />
            <div>
              <p className="font-medium">No achievements yet</p>
              <p className="text-sm text-muted-foreground">
                Achievements will appear here as they are added
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

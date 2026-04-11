"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface ProfileData {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  company_name: string | null;
  company_role: string | null;
  username: string | null;
  leaderboard_display: string;
  xp: number;
  level: number;
  streak_days: number;
  role: string;
  created_at: string;
}

type LeaderboardDisplay = "full_name" | "first_initial" | "username";

export function ProfileForm({
  profile,
  email,
  isWelcome = false,
}: {
  profile: ProfileData;
  email: string;
  isWelcome?: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState(profile.full_name);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [companyName, setCompanyName] = useState(profile.company_name ?? "");
  const [companyRole, setCompanyRole] = useState(profile.company_role ?? "");
  const [username, setUsername] = useState(profile.username ?? "");
  const [leaderboardDisplay, setLeaderboardDisplay] = useState<LeaderboardDisplay>(
    (profile.leaderboard_display as LeaderboardDisplay) ?? "first_initial"
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setUsernameError(null);

    // If using username display, require a username
    if (leaderboardDisplay === "username" && !username.trim()) {
      setUsernameError("Username is required when using username display.");
      setSaving(false);
      return;
    }

    const update: Record<string, unknown> = {
      full_name: fullName,
      bio: bio || null,
      company_name: companyName || null,
      company_role: companyRole || null,
      leaderboard_display: leaderboardDisplay,
      username: username.trim() || null,
    };

    const { error } = await supabase
      .from("profiles")
      .update(update)
      .eq("user_id", profile.user_id);

    if (error?.message?.includes("username")) {
      setUsernameError("That username is already taken. Try another one.");
      setSaving(false);
      return;
    }

    setSaving(false);
    setSaved(true);

    if (isWelcome) {
      setTimeout(() => router.push("/courses"), 500);
      return;
    }

    setTimeout(() => setSaved(false), 3000);
  }

  // Preview what the leaderboard will show
  const firstName = fullName.split(" ")[0] || "—";
  const lastInitial = fullName.split(" ").slice(1).join(" ").charAt(0);
  const previewName =
    leaderboardDisplay === "full_name"
      ? fullName || "—"
      : leaderboardDisplay === "username"
      ? username || "—"
      : lastInitial
      ? `${firstName} ${lastInitial}.`
      : firstName;

  return (
    <div className="max-w-lg space-y-6">
      {/* Read-only info */}
      <div className="rounded-lg border border-border p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="mt-0.5 text-sm font-medium">{email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">XP</p>
            <p className="mt-0.5 text-sm font-medium">{profile.xp}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Level</p>
            <p className="mt-0.5 text-sm font-medium">{profile.level}</p>
          </div>
        </div>
      </div>

      {/* Editable fields */}
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-accent/50"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="min-h-[80px] w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-accent/50"
            placeholder="A short bio about yourself"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Company</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-accent/50"
            placeholder="Company name"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Role</label>
          <input
            type="text"
            value={companyRole}
            onChange={(e) => setCompanyRole(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-accent/50"
            placeholder="Your role at the company"
          />
        </div>

        {/* Leaderboard display preference */}
        <div className="rounded-lg border border-border p-4 space-y-3">
          <label className="block text-sm font-medium">Leaderboard Display</label>
          <p className="text-xs text-muted-foreground">
            Choose how your name appears on the public leaderboard.
          </p>

          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="leaderboardDisplay"
                value="first_initial"
                checked={leaderboardDisplay === "first_initial"}
                onChange={() => setLeaderboardDisplay("first_initial")}
                className="accent-emerald-500"
              />
              <span className="text-sm">First name + last initial</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="leaderboardDisplay"
                value="full_name"
                checked={leaderboardDisplay === "full_name"}
                onChange={() => setLeaderboardDisplay("full_name")}
                className="accent-emerald-500"
              />
              <span className="text-sm">Full name</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="leaderboardDisplay"
                value="username"
                checked={leaderboardDisplay === "username"}
                onChange={() => setLeaderboardDisplay("username")}
                className="accent-emerald-500"
              />
              <span className="text-sm">Username</span>
            </label>
          </div>

          {leaderboardDisplay === "username" && (
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""));
                  setUsernameError(null);
                }}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-accent/50"
                placeholder="Choose a unique username"
                maxLength={30}
              />
              {usernameError && (
                <p className="mt-1 text-xs text-red-400">{usernameError}</p>
              )}
            </div>
          )}

          <div className="rounded-md bg-muted/50 px-3 py-2">
            <p className="text-xs text-muted-foreground">
              Preview: <span className="font-medium text-foreground">{previewName}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-emerald-accent text-emerald-accent-foreground hover:bg-emerald-accent/90"
        >
          {saving ? "Saving..." : isWelcome ? (
            <>
              Save & Start Learning
              <ArrowRight className="ml-1 size-4" />
            </>
          ) : "Save Changes"}
        </Button>
        {saved && !isWelcome && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-400">
            <CheckCircle2 className="size-4" />
            Saved
          </span>
        )}
      </div>
    </div>
  );
}

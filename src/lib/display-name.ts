// Single source of truth for how a member is shown across the app.
// Mirrors profiles.leaderboard_display values (full_name | first_initial | username).
// Default behaviour (and the column default for new signups) is `first_initial`,
// which keeps personal info out of public surfaces unless the user opts in.

export interface DisplayProfile {
  full_name?: string | null;
  username?: string | null;
  leaderboard_display?: string | null;
  post_as_team?: boolean | null;
}

export function displayName(profile: DisplayProfile | null | undefined): string {
  if (!profile) return "Member";
  if (profile.post_as_team) return "Orchestrator Academy Team";

  const pref = profile.leaderboard_display ?? "first_initial";
  const fullName = (profile.full_name ?? "").trim();
  const username = (profile.username ?? "").trim();

  if (pref === "username" && username) return username;
  if (pref === "full_name" && fullName) return fullName;

  // first_initial fallback (also covers unknown values).
  if (fullName) {
    const parts = fullName.split(/\s+/).filter(Boolean);
    const first = parts[0] ?? "";
    const lastInit = parts.slice(1).join(" ").charAt(0);
    if (first) return lastInit ? `${first} ${lastInit}.` : first;
  }
  if (username) return username;
  return "Member";
}

export function displayInitials(profile: DisplayProfile | null | undefined): string {
  const name = displayName(profile);
  const parts = name.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase() || "M";
}

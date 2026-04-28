// Single source of truth for how a member is shown across the app.
//
// Privacy model:
//   - Every profile gets a system-generated `auto_alias` at signup
//     (e.g. swiftpanda427). Sticky, immutable, the public default.
//   - `username` is user-editable — only shown if the user explicitly
//     opts into `leaderboard_display = 'username'`.
//   - `full_name` is only shown when `leaderboard_display = 'full_name'`.
//   - `post_as_team` overrides everything with the brand label.
//
// The default behaviour (any value of leaderboard_display other than
// the explicit opt-ins above, and the column default for new signups)
// is `auto_alias` — so first names, last names, and chosen handles
// stay private until the user elects otherwise.

export interface DisplayProfile {
  full_name?: string | null;
  username?: string | null;
  auto_alias?: string | null;
  leaderboard_display?: string | null;
  post_as_team?: boolean | null;
}

export function displayName(profile: DisplayProfile | null | undefined): string {
  if (!profile) return "Member";
  if (profile.post_as_team) return "Orchestrator Academy Team";

  const pref = profile.leaderboard_display ?? "first_initial";
  const fullName = (profile.full_name ?? "").trim();
  const username = (profile.username ?? "").trim();
  const autoAlias = (profile.auto_alias ?? "").trim();

  if (pref === "full_name" && fullName) return fullName;
  if (pref === "username" && username) return username;
  if (autoAlias) return autoAlias;
  // Pre-migration fallback only. Every profile from migration 020 onward
  // has a non-null auto_alias.
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

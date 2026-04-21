const BRAND = {
  name: "AI Orchestrator Academy",
  url: "https://orchestratoracademy.com",
  green: "#34d399",
  darkBg: "#0a0a0a",
  cardBg: "#171717",
  border: "#262626",
  mutedText: "#a3a3a3",
  white: "#fafafa",
};

function layout(content: string, preheader: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>${BRAND.name}</title>
  <!--[if mso]><style>body{font-family:Arial,sans-serif!important}</style><![endif]-->
  <style>
    body { margin:0; padding:0; background:${BRAND.darkBg}; color:${BRAND.white}; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; -webkit-font-smoothing:antialiased; }
    a { color:${BRAND.green}; text-decoration:none; }
    .btn { display:inline-block; padding:12px 28px; background:${BRAND.green}; color:#0a0a0a!important; font-weight:600; font-size:14px; border-radius:8px; text-decoration:none; }
    .btn:hover { opacity:0.9; }
  </style>
</head>
<body style="margin:0;padding:0;background:${BRAND.darkBg};">
  <!-- Preheader -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.darkBg};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom:32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:${BRAND.white};width:36px;height:36px;border-radius:8px;text-align:center;vertical-align:middle;font-size:14px;font-weight:700;color:${BRAND.darkBg};">
                    OA
                  </td>
                  <td style="padding-left:10px;font-size:15px;font-weight:600;color:${BRAND.white};">
                    Orchestrator Academy
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content card -->
          <tr>
            <td style="background:${BRAND.cardBg};border:1px solid ${BRAND.border};border-radius:12px;padding:36px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:32px;text-align:center;font-size:12px;color:${BRAND.mutedText};line-height:1.6;">
              <a href="${BRAND.url}" style="color:${BRAND.mutedText};">${BRAND.name}</a><br/>
              You're receiving this because you signed up at orchestratoracademy.com.<br/>
              <a href="${BRAND.url}/dashboard/profile" style="color:${BRAND.mutedText};text-decoration:underline;">Manage preferences</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Shared: XP badge + leaderboard block ──────────────────────────────────────

interface LeaderboardEntry {
  displayName: string;
  xp: number;
}

function xpBadge(xp: number, level: number, rank: number) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.darkBg};border:1px solid ${BRAND.border};border-radius:8px;margin-bottom:24px;">
      <tr>
        <td width="33%" style="padding:16px 20px;text-align:center;border-right:1px solid ${BRAND.border};">
          <p style="margin:0;font-size:24px;font-weight:700;color:${BRAND.green};">${xp}</p>
          <p style="margin:4px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:${BRAND.mutedText};">XP earned</p>
        </td>
        <td width="34%" style="padding:16px 20px;text-align:center;border-right:1px solid ${BRAND.border};">
          <p style="margin:0;font-size:24px;font-weight:700;color:${BRAND.white};">${level}</p>
          <p style="margin:4px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:${BRAND.mutedText};">Level</p>
        </td>
        <td width="33%" style="padding:16px 20px;text-align:center;">
          <p style="margin:0;font-size:24px;font-weight:700;color:${BRAND.white};">#${rank}</p>
          <p style="margin:4px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:${BRAND.mutedText};">Rank</p>
        </td>
      </tr>
    </table>`;
}

function firstName(fullName: string) {
  return fullName.split(" ")[0] || "Anonymous";
}

function leaderboardBlock(leaders: LeaderboardEntry[], currentDisplayName: string) {
  const medals = ["🥇", "🥈", "🥉", "4.", "5."];
  const rows = leaders
    .slice(0, 5)
    .map((l, i) => {
      const isYou = l.displayName === currentDisplayName;
      const nameColor = isYou ? BRAND.green : BRAND.white;
      const displayName = isYou ? l.displayName + " (you)" : l.displayName;
      return `<tr>
        <td style="padding:8px 16px;border-bottom:1px solid ${BRAND.border};font-size:14px;">
          <span style="margin-right:8px;">${medals[i]}</span>
          <span style="color:${nameColor};font-weight:${isYou ? "600" : "400"};">${displayName}</span>
        </td>
        <td align="right" style="padding:8px 16px;border-bottom:1px solid ${BRAND.border};font-size:14px;font-weight:600;color:${BRAND.green};">
          ${l.xp} XP
        </td>
      </tr>`;
    })
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.darkBg};border:1px solid ${BRAND.border};border-radius:8px;margin-bottom:24px;">
      <tr>
        <td colspan="2" style="padding:12px 16px;border-bottom:1px solid ${BRAND.border};font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:${BRAND.mutedText};font-weight:600;">
          Leaderboard
        </td>
      </tr>
      ${rows}
    </table>`;
}

// ── Shared: What's New announcements block ───────────────────────────────────

export interface AnnouncementEntry {
  title: string;
  excerpt: string;
  url: string; // absolute URL to read more
}

function announcementsBlock(announcements: AnnouncementEntry[]) {
  if (!announcements || announcements.length === 0) return "";
  const items = announcements
    .slice(0, 3)
    .map(
      (a) => `<tr>
        <td style="padding:14px 16px;border-bottom:1px solid ${BRAND.border};">
          <a href="${a.url}" style="color:${BRAND.white};font-weight:600;font-size:14px;text-decoration:none;">${a.title}</a>
          <p style="margin:4px 0 0;font-size:13px;color:${BRAND.mutedText};line-height:1.5;">${a.excerpt}</p>
        </td>
      </tr>`
    )
    .join("");
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.darkBg};border:1px solid ${BRAND.border};border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid ${BRAND.border};font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:${BRAND.mutedText};font-weight:600;">
          What's new at the Academy
        </td>
      </tr>
      ${items}
    </table>`;
}

// ── Day 3: Pick up where you left off ─────────────────────────────────────────

export function day3Email(params: {
  name: string;
  displayName: string;
  lessonTitle: string;
  courseSlug: string;
  lessonSlug: string;
  completedCount: number;
  xp: number;
  level: number;
  rank: number;
  leaderboard: LeaderboardEntry[];
  announcements?: AnnouncementEntry[];
}) {
  const { name, displayName, lessonTitle, courseSlug, lessonSlug, completedCount, xp, level, rank, leaderboard, announcements = [] } = params;
  const firstName = name.split(" ")[0] || "there";
  const continueUrl = `${BRAND.url}/courses/${courseSlug}/lessons/${lessonSlug}`;

  const content = `
    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:${BRAND.white};">
      Hey ${firstName}, you were making progress
    </p>
    <p style="margin:0 0 24px;font-size:15px;color:${BRAND.mutedText};line-height:1.6;">
      You've completed <strong style="color:${BRAND.white};">${completedCount} lesson${completedCount !== 1 ? "s" : ""}</strong> so far &mdash; nice start. Your next lesson is ready:
    </p>

    ${xpBadge(xp, level, rank)}

    <!-- Next lesson card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.darkBg};border:1px solid ${BRAND.border};border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:${BRAND.green};font-weight:600;">
            Up Next
          </p>
          <p style="margin:0;font-size:16px;font-weight:600;color:${BRAND.white};">
            ${lessonTitle}
          </p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td>
          <a href="${continueUrl}" class="btn">Continue Learning</a>
        </td>
      </tr>
    </table>

    ${announcementsBlock(announcements)}

    ${leaderboard.length > 1 ? leaderboardBlock(leaderboard, displayName) : ""}
  `;

  return {
    subject: `You left off at "${lessonTitle}" — ${xp} XP earned so far`,
    html: layout(content, `You've earned ${xp} XP and completed ${completedCount} lessons — pick up where you left off.`),
  };
}

// ── Day 7: What's next in your journey ────────────────────────────────────────

export function day7Email(params: {
  name: string;
  displayName: string;
  courseTitle: string;
  courseSlug: string;
  completedCount: number;
  totalLessons: number;
  percentComplete: number;
  xp: number;
  level: number;
  rank: number;
  leaderboard: LeaderboardEntry[];
  announcements?: AnnouncementEntry[];
}) {
  const { name, displayName, courseTitle, courseSlug, completedCount, totalLessons, percentComplete, xp, level, rank, leaderboard, announcements = [] } = params;
  const firstName = name.split(" ")[0] || "there";
  const courseUrl = `${BRAND.url}/courses/${courseSlug}`;

  // Progress bar
  const barWidth = Math.max(percentComplete, 5);

  const content = `
    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:${BRAND.white};">
      ${firstName}, here's where you stand
    </p>
    <p style="margin:0 0 24px;font-size:15px;color:${BRAND.mutedText};line-height:1.6;">
      A quick look at your progress in <strong style="color:${BRAND.white};">${courseTitle}</strong>:
    </p>

    ${xpBadge(xp, level, rank)}

    <!-- Progress card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.darkBg};border:1px solid ${BRAND.border};border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:14px;color:${BRAND.mutedText};">Progress</td>
              <td align="right" style="font-size:14px;font-weight:600;color:${BRAND.white};">${completedCount}/${totalLessons} lessons</td>
            </tr>
          </table>
          <!-- Bar -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
            <tr>
              <td style="background:${BRAND.border};border-radius:4px;height:8px;">
                <div style="width:${barWidth}%;height:8px;background:${BRAND.green};border-radius:4px;"></div>
              </td>
            </tr>
          </table>
          <p style="margin:12px 0 0;font-size:24px;font-weight:700;color:${BRAND.green};">${percentComplete}%</p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 20px;font-size:15px;color:${BRAND.mutedText};line-height:1.6;">
      ${percentComplete < 25
        ? "You're just getting started. The first few lessons lay the foundation for everything that follows."
        : percentComplete < 50
        ? "You've built a solid base. The next section gets into the hands-on material."
        : "You're over halfway. The best content is coming up — keep the momentum going."}
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td>
          <a href="${courseUrl}" class="btn">Continue Course</a>
        </td>
      </tr>
    </table>

    ${announcementsBlock(announcements)}

    ${leaderboard.length > 1 ? leaderboardBlock(leaderboard, displayName) : ""}
  `;

  return {
    subject: `${percentComplete}% through ${courseTitle} — you're at ${xp} XP`,
    html: layout(content, `You've completed ${completedCount} of ${totalLessons} lessons and earned ${xp} XP.`),
  };
}

// ── Day 14: Others are progressing ────────────────────────────────────────────

export function day14Email(params: {
  name: string;
  displayName: string;
  courseSlug: string;
  totalStudents: number;
  avgLessonsCompleted: number;
  completedCount: number;
  xp: number;
  level: number;
  rank: number;
  leaderboard: LeaderboardEntry[];
  announcements?: AnnouncementEntry[];
}) {
  const { name, displayName, courseSlug, totalStudents, avgLessonsCompleted, completedCount, xp, level, rank, leaderboard, announcements = [] } = params;
  const firstName = name.split(" ")[0] || "there";
  const courseUrl = `${BRAND.url}/courses/${courseSlug}`;
  const ahead = completedCount >= avgLessonsCompleted;

  const content = `
    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:${BRAND.white};">
      ${firstName}, the community is growing
    </p>
    <p style="margin:0 0 24px;font-size:15px;color:${BRAND.mutedText};line-height:1.6;">
      Here's what's happening at ${BRAND.name}:
    </p>

    ${xpBadge(xp, level, rank)}

    <!-- Stats grid -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td width="50%" style="padding-right:6px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.darkBg};border:1px solid ${BRAND.border};border-radius:8px;">
            <tr>
              <td style="padding:16px 20px;text-align:center;">
                <p style="margin:0;font-size:28px;font-weight:700;color:${BRAND.green};">${totalStudents}</p>
                <p style="margin:4px 0 0;font-size:12px;color:${BRAND.mutedText};">Students enrolled</p>
              </td>
            </tr>
          </table>
        </td>
        <td width="50%" style="padding-left:6px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.darkBg};border:1px solid ${BRAND.border};border-radius:8px;">
            <tr>
              <td style="padding:16px 20px;text-align:center;">
                <p style="margin:0;font-size:28px;font-weight:700;color:${BRAND.green};">${Math.round(avgLessonsCompleted)}</p>
                <p style="margin:4px 0 0;font-size:12px;color:${BRAND.mutedText};">Avg lessons completed</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 20px;font-size:15px;color:${BRAND.mutedText};line-height:1.6;">
      ${ahead
        ? `You're ahead of the average with ${completedCount} lessons done. Keep setting the pace.`
        : `The average student has completed ${Math.round(avgLessonsCompleted)} lessons. You're at ${completedCount} — a few sessions and you'll be right there.`}
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td>
          <a href="${courseUrl}" class="btn">Jump Back In</a>
        </td>
      </tr>
    </table>

    ${announcementsBlock(announcements)}

    ${leaderboard.length > 1 ? leaderboardBlock(leaderboard, displayName) : ""}
  `;

  return {
    subject: `${totalStudents} students are learning AI orchestration — you're #${rank}`,
    html: layout(content, `${totalStudents} students enrolled. You're ranked #${rank} with ${xp} XP.`),
  };
}

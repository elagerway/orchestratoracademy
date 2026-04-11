"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Building2,
  ClipboardCheck,
  FlaskConical,
  Rocket,
  BarChart3,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";

interface AdminData {
  profiles: Record<string, unknown>[];
  assessments: Record<string, unknown>[];
  labs: Record<string, unknown>[];
  deploys: Record<string, unknown>[];
  totalUsers: number;
  lastActivityMap: Record<string, string>;
  authMap: Record<string, { email: string; last_sign_in_at: string | null }>;
  xpLogsByUser: Record<string, Record<string, unknown>[]>;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function MaturityBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-sm ${
              i <= score ? "bg-emerald-500" : "bg-neutral-700"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{score}/5</span>
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────

function OverviewTab({ data }: { data: AdminData }) {
  const verifiedLabs = data.labs.filter((l) => l.verified === true).length;
  const avgMaturity =
    data.assessments.length > 0
      ? (
          data.assessments.reduce(
            (sum, a) => sum + (a.maturity_score as number),
            0
          ) / data.assessments.length
        ).toFixed(1)
      : "—";

  const companies = new Set(
    data.profiles
      .map((p) => p.company_name as string | null)
      .filter(Boolean)
  );

  const stats = [
    { label: "Total Users", value: data.totalUsers, icon: Users },
    { label: "Companies", value: companies.size, icon: Building2 },
    { label: "Assessments", value: data.assessments.length, icon: ClipboardCheck },
    { label: "Labs Completed", value: verifiedLabs, icon: FlaskConical },
    { label: "Projects Deployed", value: data.deploys.length, icon: Rocket },
    { label: "Avg Maturity", value: avgMaturity, icon: BarChart3 },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-accent/10">
              <s.icon className="size-5 text-emerald-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── Users Tab ─────────────────────────────────────────────────────────────────

// ── User Detail Panel ─────────────────────────────────────────────────────────

function UserDetail({
  profile,
  data,
  onBack,
}: {
  profile: Record<string, unknown>;
  data: AdminData;
  onBack: () => void;
}) {
  const userId = profile.user_id as string;
  const auth = data.authMap[userId];
  const xpLogs = data.xpLogsByUser[userId] ?? [];
  const userAssessments = data.assessments.filter((a) => a.user_id === userId);
  const userLabs = data.labs.filter((l) => l.user_id === userId);
  const userDeploys = data.deploys.filter((d) => d.user_id === userId);
  const lastActivity = data.lastActivityMap[userId];

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Users
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold">
            {(profile.full_name as string) || "Unnamed User"}
          </h2>
          <p className="text-sm text-muted-foreground">{auth?.email || "—"}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            profile.role === "admin"
              ? "bg-amber-500/10 text-amber-500"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {profile.role as string}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "XP", value: (profile.xp as number) ?? 0 },
          { label: "Level", value: (profile.level as number) ?? 1 },
          { label: "Company", value: (profile.company_name as string) || "—" },
          { label: "Role at Company", value: (profile.company_role as string) || "—" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-0.5 font-medium">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Maturity Level</p>
          <div className="mt-1">
            {profile.maturity_level ? (
              <MaturityBar score={profile.maturity_level as number} />
            ) : (
              <span className="text-sm text-muted-foreground">Not assessed</span>
            )}
          </div>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Last Activity</p>
          <p className="mt-0.5 font-medium">
            {lastActivity ? timeAgo(lastActivity) : "—"}
          </p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Last Sign In</p>
          <p className="mt-0.5 font-medium">
            {auth?.last_sign_in_at ? timeAgo(auth.last_sign_in_at) : "—"}
          </p>
        </div>
      </div>

      {/* Assessments */}
      {userAssessments.length > 0 && (
        <div>
          <h3 className="mb-2 font-medium">Assessments ({userAssessments.length})</h3>
          <div className="space-y-2">
            {userAssessments.map((a) => {
              const tools = a.tool_checks as Record<string, boolean>;
              const apis = a.api_checks as Record<string, boolean>;
              return (
                <div key={a.id as string} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <MaturityBar score={a.maturity_score as number} />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(a.created_at as string)}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.entries(tools).map(([name, ok]) => (
                      <span
                        key={name}
                        className={`rounded px-2 py-0.5 text-xs ${
                          ok ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {name}
                      </span>
                    ))}
                    {Object.entries(apis).map(([name, ok]) => (
                      <span
                        key={`api-${name}`}
                        className={`rounded px-2 py-0.5 text-xs ${
                          ok ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {name} API
                      </span>
                    ))}
                  </div>
                  {typeof a.gap_report === "string" && a.gap_report && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {a.gap_report}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Labs */}
      {userLabs.length > 0 && (
        <div>
          <h3 className="mb-2 font-medium">Lab Submissions ({userLabs.length})</h3>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="px-4 py-2 font-medium">Lesson</th>
                  <th className="px-4 py-2 font-medium">Type</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {userLabs.map((l) => {
                  const lesson = l.lessons as Record<string, unknown> | null;
                  return (
                    <tr key={l.id as string} className="border-b border-border/30">
                      <td className="px-4 py-2">{(lesson?.title as string) || "—"}</td>
                      <td className="px-4 py-2 font-mono text-xs">{l.lab_type as string}</td>
                      <td className="px-4 py-2">
                        {l.verified ? (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="size-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-400">
                            <XCircle className="size-3.5" /> Failed
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {formatDate(l.created_at as string)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deploys */}
      {userDeploys.length > 0 && (
        <div>
          <h3 className="mb-2 font-medium">Deployments ({userDeploys.length})</h3>
          <div className="space-y-2">
            {userDeploys.map((d) => (
              <div key={d.id as string} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{d.project_name as string}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(d.created_at as string)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{d.use_case as string}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {((d.technologies as string[]) ?? []).map((t) => (
                    <span key={t} className="rounded bg-muted px-2 py-0.5 text-xs">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* XP Activity Log */}
      <div>
        <h3 className="mb-2 font-medium">Activity Log ({xpLogs.length} events)</h3>
        {xpLogs.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="px-4 py-2 font-medium">Source</th>
                  <th className="px-4 py-2 font-medium text-right">XP</th>
                  <th className="px-4 py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {xpLogs.map((log, i) => (
                  <tr key={i} className="border-b border-border/30">
                    <td className="px-4 py-2">
                      <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono">
                        {log.source as string}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-emerald-400">
                      +{log.amount as number}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {timeAgo(log.created_at as string)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg border border-border px-4 py-8 text-center text-muted-foreground">
            No activity yet
          </div>
        )}
      </div>
    </div>
  );
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
}

function UsersTab({ data }: { data: AdminData }) {
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const selectedProfile = selectedUserId
    ? data.profiles.find((p) => p.user_id === selectedUserId)
    : null;

  if (selectedProfile) {
    return (
      <UserDetail
        profile={selectedProfile}
        data={data}
        onBack={() => setSelectedUserId(null)}
      />
    );
  }

  const filtered = data.profiles.filter((p) => {
    const name = (p.full_name as string) || "";
    const company = (p.company_name as string) || "";
    const email = data.authMap[p.user_id as string]?.email || "";
    const q = search.toLowerCase();
    return name.toLowerCase().includes(q) || company.toLowerCase().includes(q) || email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search by name, email, or company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-accent/50"
      />
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium text-right">XP</th>
              <th className="px-4 py-3 font-medium text-right">Level</th>
              <th className="px-4 py-3 font-medium">Maturity</th>
              <th className="px-4 py-3 font-medium">Last Activity</th>
              <th className="px-4 py-3 font-medium">Last Sign In</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const userId = p.user_id as string;
              const auth = data.authMap[userId];
              const lastActivity = data.lastActivityMap[userId];

              return (
                <tr
                  key={p.id as string}
                  className="cursor-pointer border-b border-border/50 hover:bg-muted/30"
                  onClick={() => setSelectedUserId(userId)}
                >
                  <td className="px-4 py-3 font-medium">
                    {(p.full_name as string) || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {auth?.email || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {(p.company_name as string) || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.role === "admin"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {p.role as string}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {(p.xp as number) ?? 0}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {(p.level as number) ?? 1}
                  </td>
                  <td className="px-4 py-3">
                    {p.maturity_level ? (
                      <MaturityBar score={p.maturity_level as number} />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {lastActivity ? (
                      <span className="text-muted-foreground" title={new Date(lastActivity).toLocaleString()}>
                        {timeAgo(lastActivity)}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {auth?.last_sign_in_at ? (
                      <span className="text-muted-foreground" title={new Date(auth.last_sign_in_at).toLocaleString()}>
                        {timeAgo(auth.last_sign_in_at)}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(p.created_at as string)}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Teams Tab ─────────────────────────────────────────────────────────────────

function TeamsTab({ data }: { data: AdminData }) {
  // Group profiles by company_name
  const teamMap = new Map<
    string,
    {
      members: Record<string, unknown>[];
      assessments: Record<string, unknown>[];
      deploys: Record<string, unknown>[];
    }
  >();

  for (const p of data.profiles) {
    const company = p.company_name as string | null;
    if (!company) continue;
    if (!teamMap.has(company)) {
      teamMap.set(company, { members: [], assessments: [], deploys: [] });
    }
    teamMap.get(company)!.members.push(p);
  }

  // Attach assessments and deploys to teams
  for (const a of data.assessments) {
    const profile = a.profiles as Record<string, unknown> | null;
    const company = profile?.company_name as string | null;
    if (company && teamMap.has(company)) {
      teamMap.get(company)!.assessments.push(a);
    }
  }

  for (const d of data.deploys) {
    const profile = d.profiles as Record<string, unknown> | null;
    const company = profile?.company_name as string | null;
    if (company && teamMap.has(company)) {
      teamMap.get(company)!.deploys.push(d);
    }
  }

  const teams = Array.from(teamMap.entries())
    .map(([name, info]) => {
      const avgMaturity =
        info.assessments.length > 0
          ? info.assessments.reduce(
              (sum, a) => sum + (a.maturity_score as number),
              0
            ) / info.assessments.length
          : 0;
      return { name, ...info, avgMaturity };
    })
    .sort((a, b) => b.members.length - a.members.length);

  return (
    <div className="space-y-4">
      {teams.length === 0 ? (
        <div className="rounded-lg border border-border px-4 py-12 text-center text-muted-foreground">
          No teams yet. Teams are created when users provide a company name during assessment.
        </div>
      ) : (
        <div className="grid gap-4">
          {teams.map((team) => (
            <div key={team.name} className="overflow-hidden rounded-lg border border-border">
              <div className="flex items-center justify-between bg-muted/50 px-5 py-3">
                <div className="flex items-center gap-3">
                  <Building2 className="size-4 text-muted-foreground" />
                  <span className="font-medium">{team.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{team.members.length} member{team.members.length !== 1 ? "s" : ""}</span>
                  <span>{team.assessments.length} assessment{team.assessments.length !== 1 ? "s" : ""}</span>
                  <span>{team.deploys.length} deploy{team.deploys.length !== 1 ? "s" : ""}</span>
                  {team.avgMaturity > 0 && (
                    <MaturityBar score={Math.round(team.avgMaturity)} />
                  )}
                </div>
              </div>
              <div className="p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="pb-2 font-medium">Member</th>
                      <th className="pb-2 font-medium">Role</th>
                      <th className="pb-2 font-medium text-right">XP</th>
                      <th className="pb-2 font-medium text-right">Level</th>
                      <th className="pb-2 font-medium">Maturity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.members.map((m) => (
                      <tr key={m.id as string} className="border-t border-border/30">
                        <td className="py-2 font-medium">
                          {(m.full_name as string) || "—"}
                        </td>
                        <td className="py-2 text-muted-foreground">
                          {(m.company_role as string) || "—"}
                        </td>
                        <td className="py-2 text-right font-mono">
                          {(m.xp as number) ?? 0}
                        </td>
                        <td className="py-2 text-right font-mono">
                          {(m.level as number) ?? 1}
                        </td>
                        <td className="py-2">
                          {m.maturity_level ? (
                            <MaturityBar score={m.maturity_level as number} />
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Assessments Tab ───────────────────────────────────────────────────────────

function AssessmentsTab({ data }: { data: AdminData }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left">
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Maturity</th>
            <th className="px-4 py-3 font-medium">Tools</th>
            <th className="px-4 py-3 font-medium">APIs</th>
            <th className="px-4 py-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.assessments.map((a) => {
            const profile = a.profiles as Record<string, unknown> | null;
            const tools = a.tool_checks as Record<string, boolean>;
            const apis = a.api_checks as Record<string, boolean>;
            const toolsPassing = Object.values(tools).filter(Boolean).length;
            const toolsTotal = Object.keys(tools).length;
            const apisPassing = Object.values(apis).filter(Boolean).length;
            const apisTotal = Object.keys(apis).length;

            return (
              <tr key={a.id as string} className="border-b border-border/50 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  {(profile?.full_name as string) || "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {(profile?.company_name as string) || "—"}
                </td>
                <td className="px-4 py-3">
                  <MaturityBar score={a.maturity_score as number} />
                </td>
                <td className="px-4 py-3">
                  <span className={toolsPassing === toolsTotal ? "text-emerald-400" : "text-amber-400"}>
                    {toolsPassing}/{toolsTotal}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={apisPassing === apisTotal ? "text-emerald-400" : "text-amber-400"}>
                    {apisPassing}/{apisTotal}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(a.created_at as string)}
                </td>
              </tr>
            );
          })}
          {data.assessments.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                No assessments yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Labs Tab ──────────────────────────────────────────────────────────────────

function LabsTab({ data }: { data: AdminData }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left">
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Lesson</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">XP</th>
            <th className="px-4 py-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.labs.map((l) => {
            const profile = l.profiles as Record<string, unknown> | null;
            const lesson = l.lessons as Record<string, unknown> | null;

            return (
              <tr key={l.id as string} className="border-b border-border/50 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  {(profile?.full_name as string) || "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {(lesson?.title as string) || "—"}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono">
                    {l.lab_type as string}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {l.verified ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="size-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400">
                      <XCircle className="size-3.5" /> Failed
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  {(l.xp_earned as number) ?? 0}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(l.created_at as string)}
                </td>
              </tr>
            );
          })}
          {data.labs.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                No lab submissions yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Deploys Tab ───────────────────────────────────────────────────────────────

function DeploysTab({ data }: { data: AdminData }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left">
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Project</th>
            <th className="px-4 py-3 font-medium">Use Case</th>
            <th className="px-4 py-3 font-medium">Stack</th>
            <th className="px-4 py-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.deploys.map((d) => {
            const profile = d.profiles as Record<string, unknown> | null;
            const techs = (d.technologies as string[]) ?? [];

            return (
              <tr key={d.id as string} className="border-b border-border/50 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  {(profile?.full_name as string) || "—"}
                </td>
                <td className="px-4 py-3">{d.project_name as string}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {d.use_case as string}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {techs.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-muted px-2 py-0.5 text-xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(d.created_at as string)}
                </td>
              </tr>
            );
          })}
          {data.deploys.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                No deployments yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export function AdminDashboard({ data }: { data: AdminData }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Admin</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor users, teams, assessments, labs, and deployments.
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList variant="line" className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="labs">Labs</TabsTrigger>
          <TabsTrigger value="deploys">Deploys</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab data={data} />
        </TabsContent>
        <TabsContent value="users">
          <UsersTab data={data} />
        </TabsContent>
        <TabsContent value="teams">
          <TeamsTab data={data} />
        </TabsContent>
        <TabsContent value="assessments">
          <AssessmentsTab data={data} />
        </TabsContent>
        <TabsContent value="labs">
          <LabsTab data={data} />
        </TabsContent>
        <TabsContent value="deploys">
          <DeploysTab data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

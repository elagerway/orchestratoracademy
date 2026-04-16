"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RichEditor } from "@/components/blog/rich-editor";
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
  ChevronUp,
  ChevronDown,
  Pencil,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
} from "lucide-react";

interface AdminData {
  profiles: Record<string, unknown>[];
  assessments: Record<string, unknown>[];
  labs: Record<string, unknown>[];
  deploys: Record<string, unknown>[];
  totalUsers: number;
  lastActivityMap: Record<string, string>;
  authMap: Record<string, { email: string; last_sign_in_at: string | null; created_at: string | null }>;
  xpLogsByUser: Record<string, Record<string, unknown>[]>;
  courses: Record<string, unknown>[];
  enrollmentCounts: Record<string, number>;
  enrolledCoursesByUser: Record<string, string[]>;
  blogPosts: Record<string, unknown>[];
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ReadinessBar({ score }: { score: number }) {
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
  const avgReadiness =
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
    { label: "Avg Readiness", value: avgReadiness, icon: BarChart3 },
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

// ── Grant Access Component ────────────────────────────────────────────────────

function GrantAccessPanel({
  userIds,
  label,
  courses,
  enrolledCourseIds = [],
  onGranted,
}: {
  userIds: string[];
  label: string;
  courses: Record<string, unknown>[];
  enrolledCourseIds?: string[];
  onGranted?: () => void;
}) {
  const [enrolledSet, setEnrolledSet] = useState(new Set(enrolledCourseIds));
  const [selectedToGrant, setSelectedToGrant] = useState<Set<string>>(new Set());
  const [selectedToRevoke, setSelectedToRevoke] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const proCourses = courses.filter((c) => !(c.is_free as boolean));

  function toggleCourse(id: string) {
    if (enrolledSet.has(id)) {
      // Toggle revoke
      setSelectedToRevoke((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    } else {
      // Toggle grant
      setSelectedToGrant((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    }
  }

  function selectAll() {
    const ungrantedIds = proCourses
      .map((c) => c.id as string)
      .filter((id) => !enrolledSet.has(id));
    setSelectedToGrant(new Set(ungrantedIds));
  }

  async function handleGrant() {
    if (selectedToGrant.size === 0) return;
    setBusy(true);
    setResult(null);

    const res = await fetch("/api/admin/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_ids: userIds,
        course_ids: Array.from(selectedToGrant),
      }),
    });

    const data = await res.json();
    setBusy(false);

    if (data.success) {
      setResult(`Granted access to ${selectedToGrant.size} course${selectedToGrant.size !== 1 ? "s" : ""}`);
      setEnrolledSet((prev) => {
        const next = new Set(prev);
        selectedToGrant.forEach((id) => next.add(id));
        return next;
      });
      setSelectedToGrant(new Set());
      onGranted?.();
    } else {
      setResult(`Error: ${data.error}`);
    }
  }

  async function handleRevoke() {
    if (selectedToRevoke.size === 0) return;
    setBusy(true);
    setResult(null);

    const res = await fetch("/api/admin/enroll", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_ids: userIds,
        course_ids: Array.from(selectedToRevoke),
      }),
    });

    const data = await res.json();
    setBusy(false);

    if (data.success) {
      setResult(`Revoked access to ${selectedToRevoke.size} course${selectedToRevoke.size !== 1 ? "s" : ""}`);
      setEnrolledSet((prev) => {
        const next = new Set(prev);
        selectedToRevoke.forEach((id) => next.delete(id));
        return next;
      });
      setSelectedToRevoke(new Set());
      onGranted?.();
    } else {
      setResult(`Error: ${data.error}`);
    }
  }

  const totalSelected = selectedToGrant.size + selectedToRevoke.size;

  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <h4 className="text-sm font-medium">Manage Pro Course Access</h4>
      <p className="text-xs text-muted-foreground">
        Grant or revoke course access for {label}
      </p>
      <div className="space-y-2">
        {proCourses.map((c) => {
          const cid = c.id as string;
          const isEnrolled = enrolledSet.has(cid);
          const markedForRevoke = selectedToRevoke.has(cid);
          return (
            <label key={cid} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isEnrolled ? !markedForRevoke : selectedToGrant.has(cid)}
                onChange={() => toggleCourse(cid)}
                className="accent-emerald-500"
              />
              <span className={`text-sm ${markedForRevoke ? "line-through text-muted-foreground" : ""}`}>{c.title as string}</span>
              {isEnrolled && !markedForRevoke && (
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-500">granted</span>
              )}
              {markedForRevoke && (
                <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-500">will revoke</span>
              )}
              {!(c.active as boolean) && !isEnrolled && (
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">inactive</span>
              )}
            </label>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={selectAll}
          className="text-xs text-emerald-accent hover:underline"
        >
          Select all
        </button>
        <span className="text-xs text-muted-foreground">
          {totalSelected} selected
        </span>
      </div>
      <div className="flex gap-2">
        {selectedToGrant.size > 0 && (
          <button
            onClick={handleGrant}
            disabled={busy}
            className="rounded-md bg-emerald-accent px-4 py-2 text-sm font-medium text-emerald-accent-foreground transition-colors hover:bg-emerald-accent/90 disabled:opacity-50"
          >
            {busy ? "..." : `Grant ${selectedToGrant.size}`}
          </button>
        )}
        {selectedToRevoke.size > 0 && (
          <button
            onClick={handleRevoke}
            disabled={busy}
            className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
          >
            {busy ? "..." : `Revoke ${selectedToRevoke.size}`}
          </button>
        )}
      </div>
      {result && (
        <p className={`text-xs ${result.startsWith("Error") ? "text-red-400" : "text-emerald-400"}`}>
          {result}
        </p>
      )}
    </div>
  );
}

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
  const [impersonating, setImpersonating] = useState(false);

  async function handleImpersonate() {
    setImpersonating(true);

    // Save admin session before switching
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: { session: adminSession } } = await supabase.auth.getSession();

    if (!adminSession) {
      setImpersonating(false);
      return;
    }

    const res = await fetch("/api/admin/impersonate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });
    const result = await res.json();
    setImpersonating(false);

    if (result.access_token && adminSession) {
      // Store admin tokens to restore later
      sessionStorage.setItem("admin_access_token", adminSession.access_token);
      sessionStorage.setItem("admin_refresh_token", adminSession.refresh_token);
      sessionStorage.setItem("admin_return", "true");

      // Switch to impersonated session
      await supabase.auth.setSession({
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      });
      window.location.href = "/dashboard";
    }
  }

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
        <div className="flex items-center gap-2">
          <button
            onClick={handleImpersonate}
            disabled={impersonating}
            className="rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-1.5 text-xs font-medium text-amber-500 transition-colors hover:bg-amber-500/10 disabled:opacity-50"
          >
            {impersonating ? "Switching..." : "Impersonate"}
          </button>
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
          <p className="text-xs text-muted-foreground">Readiness</p>
          <div className="mt-1">
            {profile.maturity_level ? (
              <ReadinessBar score={profile.maturity_level as number} />
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
              const tools = (a.tool_checks as Record<string, boolean>) ?? {};
              const apis = (a.api_checks as Record<string, boolean>) ?? {};
              return (
                <div key={a.id as string} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <ReadinessBar score={a.maturity_score as number} />
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

      {/* Grant Course Access */}
      <GrantAccessPanel
        userIds={[userId]}
        label={profile.full_name as string || "this user"}
        courses={data.courses}
        enrolledCourseIds={data.enrolledCoursesByUser[userId] ?? []}
      />

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
              <th className="px-4 py-3 font-medium">Readiness</th>
              <th className="px-4 py-3 font-medium">Last Activity</th>
              <th className="px-4 py-3 font-medium">Last Sign In</th>
              <th className="px-4 py-3 font-medium">Region</th>
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
                      <ReadinessBar score={p.maturity_level as number} />
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
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {(p.signup_region as string) || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(p.created_at as string).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}{" "}
                    <span className="text-xs opacity-60">
                      {new Date(p.created_at as string).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-muted-foreground">
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
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);

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
      const avgReadiness =
        info.assessments.length > 0
          ? info.assessments.reduce(
              (sum, a) => sum + (a.maturity_score as number),
              0
            ) / info.assessments.length
          : 0;
      return { name, ...info, avgReadiness };
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
          {teams.map((team) => {
            const isExpanded = expandedTeam === team.name;
            const memberUserIds = team.members.map((m) => m.user_id as string);

            return (
              <div key={team.name} className="overflow-hidden rounded-lg border border-border">
                <button
                  onClick={() => setExpandedTeam(isExpanded ? null : team.name)}
                  className="flex w-full items-center justify-between bg-muted/50 px-5 py-3 text-left transition-colors hover:bg-muted/70"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="size-4 text-muted-foreground" />
                    <span className="font-medium">{team.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{team.members.length} member{team.members.length !== 1 ? "s" : ""}</span>
                    <span>{team.assessments.length} assessment{team.assessments.length !== 1 ? "s" : ""}</span>
                    <span>{team.deploys.length} deploy{team.deploys.length !== 1 ? "s" : ""}</span>
                    {team.avgReadiness > 0 && (
                      <ReadinessBar score={Math.round(team.avgReadiness)} />
                    )}
                    <ChevronUp className={`size-4 transition-transform ${isExpanded ? "" : "rotate-180"}`} />
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 space-y-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground">
                          <th className="pb-2 font-medium">Member</th>
                          <th className="pb-2 font-medium">Email</th>
                          <th className="pb-2 font-medium">Role</th>
                          <th className="pb-2 font-medium text-right">XP</th>
                          <th className="pb-2 font-medium text-right">Level</th>
                          <th className="pb-2 font-medium">Readiness</th>
                        </tr>
                      </thead>
                      <tbody>
                        {team.members.map((m) => {
                          const auth = data.authMap[m.user_id as string];
                          return (
                            <tr key={m.id as string} className="border-t border-border/30">
                              <td className="py-2 font-medium">
                                {(m.full_name as string) || "—"}
                              </td>
                              <td className="py-2 text-muted-foreground">
                                {auth?.email || "—"}
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
                                  <ReadinessBar score={m.maturity_level as number} />
                                ) : (
                                  <span className="text-xs text-muted-foreground">—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <GrantAccessPanel
                      userIds={memberUserIds}
                      label={`${team.members.length} member${team.members.length !== 1 ? "s" : ""} of ${team.name}`}
                      courses={data.courses}
                    />
                  </div>
                )}
              </div>
            );
          })}
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
            <th className="px-4 py-3 font-medium">Readiness</th>
            <th className="px-4 py-3 font-medium">Tools</th>
            <th className="px-4 py-3 font-medium">APIs</th>
            <th className="px-4 py-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.assessments.map((a) => {
            const profile = a.profiles as Record<string, unknown> | null;
            const tools = (a.tool_checks as Record<string, boolean>) ?? {};
            const apis = (a.api_checks as Record<string, boolean>) ?? {};
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
                  <ReadinessBar score={a.maturity_score as number} />
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

// ── Courses Tab ───────────────────────────────────────────────────────────────

function CoursesTab({ data }: { data: AdminData }) {
  const [courses, setCourses] = useState(
    [...data.courses].sort((a, b) => (a.order as number) - (b.order as number))
  );
  const [toggling, setToggling] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);
  const [warning, setWarning] = useState<{
    courseId: string;
    courseTitle: string;
    users: { email: string; full_name: string }[];
  } | null>(null);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setCourses((prev) => {
      const oldIndex = prev.findIndex((c) => c.id === active.id);
      const newIndex = prev.findIndex((c) => c.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
    setOrderChanged(true);
  }

  async function saveOrder() {
    setSaving(true);
    await fetch("/api/admin/courses/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ordered_ids: courses.map((c) => c.id as string),
      }),
    });
    setSaving(false);
    setOrderChanged(false);
  }

  async function handleToggle(courseId: string, currentActive: boolean, courseTitle: string) {
    if (currentActive) {
      // Check affected users BEFORE deactivating
      setToggling(courseId);
      const checkRes = await fetch("/api/admin/courses/affected", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: courseId }),
      });
      const checkResult = await checkRes.json();
      setToggling(null);

      if (checkResult.affected_users?.length > 0) {
        // Show warning and wait for confirmation
        setWarning({
          courseId,
          courseTitle,
          users: checkResult.affected_users,
        });
        return;
      }

      // No affected users — deactivate immediately
      await confirmDeactivate(courseId);
    } else {
      // Activating — no warning needed
      setToggling(courseId);
      await fetch("/api/admin/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: courseId, active: true }),
      });
      setToggling(null);
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, active: true } : c))
      );
    }
  }

  async function confirmDeactivate(courseId: string) {
    setToggling(courseId);
    await fetch("/api/admin/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id: courseId, active: false }),
    });
    setToggling(null);
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, active: false } : c))
    );
    setWarning(null);
  }

  return (
    <div className="space-y-4">
      {warning && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="font-medium text-amber-500">
            Warning: {warning.users.length} user{warning.users.length !== 1 ? "s" : ""} enrolled in &quot;{warning.courseTitle}&quot;
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            These users will lose access to the course while it&apos;s deactivated:
          </p>
          <ul className="mt-2 space-y-1">
            {warning.users.map((u, i) => (
              <li key={i} className="text-sm">
                <span className="font-medium">{u.full_name || "Unnamed"}</span>
                <span className="ml-2 text-muted-foreground">{u.email}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => confirmDeactivate(warning.courseId)}
              disabled={toggling === warning.courseId}
              className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
            >
              {toggling === warning.courseId ? "Deactivating..." : "Deactivate Anyway"}
            </button>
            <button
              onClick={() => setWarning(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {orderChanged && (
        <div className="flex items-center gap-3">
          <button
            onClick={saveOrder}
            disabled={saving}
            className="rounded-md bg-emerald-accent px-4 py-2 text-sm font-medium text-emerald-accent-foreground transition-colors hover:bg-emerald-accent/90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Order"}
          </button>
          <span className="text-xs text-muted-foreground">Drag to reorder, then save</span>
        </div>
      )}

      <DndContext
        sensors={useSensors(
          useSensor(PointerSensor),
          useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
        )}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={courses.map((c) => c.id as string)} strategy={verticalListSortingStrategy}>
          <div className="rounded-lg border border-border">
            {courses.map((c, index) => (
              <SortableCourseRow
                key={c.id as string}
                course={c}
                index={index}
                enrolled={data.enrollmentCounts[c.id as string] ?? 0}
                toggling={toggling}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableCourseRow({
  course: c,
  index,
  enrolled,
  toggling,
  onToggle,
}: {
  course: Record<string, unknown>;
  index: number;
  enrolled: number;
  toggling: string | null;
  onToggle: (id: string, active: boolean, title: string) => void;
}) {
  const courseId = c.id as string;
  const isActive = c.active as boolean;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: courseId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 border-b border-border/50 px-4 py-3 ${
        isDragging ? "z-10 bg-muted shadow-lg" : "hover:bg-muted/30"
      }`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="5" cy="3" r="1.5" />
          <circle cx="11" cy="3" r="1.5" />
          <circle cx="5" cy="8" r="1.5" />
          <circle cx="11" cy="8" r="1.5" />
          <circle cx="5" cy="13" r="1.5" />
          <circle cx="11" cy="13" r="1.5" />
        </svg>
      </button>

      <span className="w-6 text-center text-xs text-muted-foreground">{index + 1}</span>

      {/* Course info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium">{c.title as string}</p>
        <p className="text-xs text-muted-foreground">{c.slug as string}</p>
      </div>

      {/* Type */}
      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
        c.is_free ? "bg-emerald-accent/10 text-emerald-accent" : "bg-muted text-muted-foreground"
      }`}>
        {c.is_free ? "Free" : "Pro"}
      </span>

      {/* Enrolled */}
      <span className="w-12 shrink-0 text-right font-mono text-sm">{enrolled}</span>

      {/* Toggle */}
      <button
        onClick={() => onToggle(courseId, isActive, c.title as string)}
        disabled={toggling === courseId}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          isActive ? "bg-emerald-accent" : "bg-neutral-600"
        } ${toggling === courseId ? "opacity-50" : ""}`}
      >
        <span
          className={`inline-block size-4 rounded-full bg-white transition-transform ${
            isActive ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

// ── Blog Tab ──────────────────────────────────────────────────────────────────

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function BlogTab({ data }: { data: AdminData }) {
  const [posts, setPosts] = useState(data.blogPosts);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [creating, setCreating] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [tags, setTags] = useState("");
  const [authorName, setAuthorName] = useState("Orchestrator Academy");
  const [status, setStatus] = useState<"draft" | "scheduled" | "published">("draft");
  const [saving, setSaving] = useState(false);

  function startCreate() {
    setEditing(null);
    setCreating(true);
    setTitle(""); setSlug(""); setExcerpt(""); setContent("");
    setFeaturedImage(""); setMetaDescription(""); setTags("");
    setAuthorName("Orchestrator Academy"); setStatus("draft");
  }

  function startEdit(post: Record<string, unknown>) {
    setCreating(false);
    setEditing(post);
    setTitle(post.title as string);
    setSlug(post.slug as string);
    setExcerpt((post.excerpt as string) || "");
    setContent((post.content as string) || "");
    setFeaturedImage((post.featured_image_url as string) || "");
    setMetaDescription((post.meta_description as string) || "");
    setTags(((post.tags as string[]) || []).join(", "));
    setAuthorName((post.author_name as string) || "Orchestrator Academy");
    setStatus((post.status as "draft" | "scheduled" | "published") || (post.published ? "published" : "draft"));
  }

  function cancelEdit() { setEditing(null); setCreating(false); }

  function autoSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function handleSave() {
    setSaving(true);
    const tagsArray = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const isPublished = status === "published";
    const payload = {
      title, slug: slug || autoSlug(title), excerpt, content,
      featured_image_url: featuredImage || null,
      meta_description: metaDescription, tags: tagsArray,
      author_name: authorName, status,
      published: isPublished,
    };

    if (creating) {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        setPosts((prev) => [{
          id: result.post.id, ...payload,
          published_at: isPublished ? new Date().toISOString() : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, ...prev]);
        setCreating(false);
      }
    } else if (editing) {
      await fetch("/api/admin/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing.id, ...payload }),
      });
      setPosts((prev) => prev.map((p) =>
        p.id === editing.id ? {
          ...p, ...payload,
          published_at: isPublished ? new Date().toISOString() : p.published_at,
          updated_at: new Date().toISOString(),
        } : p
      ));
      setEditing(null);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await fetch("/api/admin/blog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  // Editor view — two-column layout
  if (creating || editing) {
    const postSlug = slug || autoSlug(title);
    const postUrl = `https://orchestratoracademy.com/blog/${postSlug}`;
    const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(postUrl)}`;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={cancelEdit} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
            Back to List
          </button>
          <h3 className="text-sm font-medium text-muted-foreground">{creating ? "New Post" : "Edit Post"}</h3>
        </div>

        <div className="flex gap-6">
          {/* Left — Content */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Title</label>
              <input
                value={title}
                onChange={(e) => { setTitle(e.target.value); if (creating) setSlug(autoSlug(e.target.value)); }}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-lg font-semibold outline-none focus:border-emerald-accent/50"
                placeholder="Post title"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Slug</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-emerald-accent/50"
                placeholder="post-slug"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Content</label>
              <RichEditor
                content={content}
                onChange={setContent}
                placeholder="Start writing your post..."
              />
            </div>
          </div>

          {/* Right — Metadata sidebar */}
          <div className="w-72 shrink-0 space-y-5">
            {/* Status */}
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</label>
              <div className="flex rounded-lg border border-border">
                {(["draft", "scheduled", "published"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`flex-1 px-3 py-1.5 text-xs font-medium capitalize transition-colors first:rounded-l-lg last:rounded-r-lg ${
                      status === s
                        ? "bg-emerald-accent text-emerald-accent-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Meta description */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Meta Description <span className="normal-case text-muted-foreground/60">(max 300 chars)</span>
              </label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value.slice(0, 300))}
                className="min-h-[70px] w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-accent/50"
                placeholder="SEO description"
                maxLength={300}
              />
              <p className="mt-1 text-right text-[10px] text-muted-foreground">{metaDescription.length}/300</p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="min-h-[70px] w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-accent/50"
                placeholder="Brief description for blog cards"
              />
            </div>

            {/* Author */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Author</label>
              <input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-accent/50"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Tags</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-accent/50"
                placeholder="Comma-separated"
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Featured Image</label>
              <input
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-accent/50"
                placeholder="https://..."
              />
              {featuredImage && (
                <img src={featuredImage} alt="Preview" className="mt-2 w-full rounded-lg border border-border object-cover" style={{ maxHeight: 160 }} />
              )}
            </div>

            {/* Social posting — only for published/editing */}
            {!creating && status === "published" && (
              <>
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Twitter / X</label>
                  <button
                    onClick={async () => {
                      if (!editing?.id) return;
                      try {
                        const res = await fetch("/api/admin/social", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ postId: editing.id, platform: "x" }),
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error);
                        alert(`Posted to X! Tweet ID: ${data.tweetId}`);
                        setEditing({ ...editing, twitter_posted_at: new Date().toISOString() });
                      } catch (err: any) {
                        alert(`X post failed: ${err.message}`);
                      }
                    }}
                    className="flex items-center gap-2 rounded-md bg-neutral-800 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
                  >
                    <XIcon className="size-3.5" />
                    {typeof editing?.twitter_posted_at === "string" ? "Re-post to X" : "Post to X"}
                  </button>
                  {typeof editing?.twitter_posted_at === "string" && (
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Last posted: {new Date(editing.twitter_posted_at).toLocaleString()}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">LinkedIn</label>
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-md bg-[#0A66C2] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#004182]"
                  >
                    <LinkedInIcon className="size-3.5" />
                    {typeof editing?.linkedin_posted_at === "string" ? "Re-post to LinkedIn" : "Post to LinkedIn"}
                  </a>
                  {typeof editing?.linkedin_posted_at === "string" && (
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Last posted: {new Date(editing.linkedin_posted_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving || !title}
              className="w-full rounded-md bg-emerald-accent px-4 py-2.5 text-sm font-medium text-emerald-accent-foreground transition-colors hover:bg-emerald-accent/90 disabled:opacity-50"
            >
              {saving ? "Saving..." : creating ? "Create Post" : "Update Post"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
        <button
          onClick={startCreate}
          className="flex items-center gap-1.5 rounded-md bg-emerald-accent px-3 py-2 text-sm font-medium text-emerald-accent-foreground transition-colors hover:bg-emerald-accent/90"
        >
          <Plus className="size-4" />
          New Post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-border px-4 py-12 text-center text-muted-foreground">
          No blog posts yet. Create your first one.
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => {
            const postStatus = (post.status as string) || (post.published ? "published" : "draft");
            const postSlug = post.slug as string;
            const postUrl = `https://orchestratoracademy.com/blog/${postSlug}`;
            const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(post.title as string)}&url=${encodeURIComponent(postUrl)}`;
            const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
            const postTags = (post.tags as string[]) || [];

            return (
              <div key={post.id as string} className="flex items-center gap-4 rounded-lg border border-border px-4 py-3 hover:bg-muted/30">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{post.title as string}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>/blog/{postSlug}</span>
                    {typeof post.published_at === "string" && <span>{formatDate(post.published_at)}</span>}
                    {postTags.length > 0 && (
                      <span className="flex gap-1">
                        {postTags.slice(0, 3).map((t) => (
                          <span key={t} className="rounded bg-muted px-1.5 py-0.5 text-[10px]">{t}</span>
                        ))}
                      </span>
                    )}
                  </div>
                </div>

                <span className={`shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  postStatus === "published" ? "bg-emerald-accent/10 text-emerald-accent"
                    : postStatus === "scheduled" ? "bg-amber-500/10 text-amber-500"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {postStatus === "published" ? <><Eye className="size-3" /> Live</>
                    : postStatus === "scheduled" ? <><Eye className="size-3" /> Scheduled</>
                    : <><EyeOff className="size-3" /> Draft</>}
                </span>

                {postStatus === "published" && (
                  <div className="flex items-center gap-1 shrink-0">
                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer"
                      className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground" title="Share on LinkedIn">
                      <LinkedInIcon className="size-3.5" />
                    </a>
                    <a href={xUrl} target="_blank" rel="noopener noreferrer"
                      className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground" title="Share on X">
                      <XIcon className="size-3.5" />
                    </a>
                    <a href={`/blog/${postSlug}`} target="_blank" rel="noopener noreferrer"
                      className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground" title="View post">
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                )}

                <button onClick={() => startEdit(post)}
                  className="flex size-7 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground" title="Edit">
                  <Pencil className="size-3.5" />
                </button>
                <button onClick={() => handleDelete(post.id as string)}
                  className="flex size-7 shrink-0 items-center justify-center rounded text-red-400 hover:bg-red-500/10" title="Delete">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
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
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
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
        <TabsContent value="courses">
          <CoursesTab data={data} />
        </TabsContent>
        <TabsContent value="blog">
          <BlogTab data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

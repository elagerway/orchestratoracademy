"use client";

import { useEffect, useState, useCallback } from "react";
import { Pencil, Plus, Trash2, Eye, EyeOff } from "lucide-react";

type Job = {
  id: string;
  title: string;
  company_name: string;
  company_logo_url: string | null;
  company_url: string | null;
  location: string | null;
  remote: boolean;
  employment_type: string;
  seniority: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  description: string;
  apply_url: string;
  posted_at: string;
  active: boolean;
};

const EMPTY_FORM: Partial<Job> = {
  title: "",
  company_name: "",
  company_logo_url: "",
  company_url: "",
  location: "",
  remote: false,
  employment_type: "full_time",
  seniority: null,
  salary_min: null,
  salary_max: null,
  salary_currency: "USD",
  description: "",
  apply_url: "",
  active: true,
};

export function JobsTab() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Job> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/jobs");
    if (res.ok) {
      const { jobs: rows } = await res.json();
      setJobs((rows as Job[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save() {
    if (!editing) return;
    setSaving(true);
    setError(null);
    const isNew = !editing.id;
    const res = await fetch("/api/admin/jobs", {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({ error: "Save failed" }));
      setError(e.error || "Save failed");
      setSaving(false);
      return;
    }
    setEditing(null);
    setSaving(false);
    await load();
  }

  async function toggleActive(job: Job) {
    const res = await fetch("/api/admin/jobs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: job.id, active: !job.active }),
    });
    if (res.ok) await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this job listing? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/jobs?id=${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {editing.id ? "Edit job" : "New job listing"}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(null)}
              disabled={saving}
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="rounded-md bg-emerald-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-accent/90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Job title *">
            <input type="text" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Company name *">
            <input type="text" value={editing.company_name ?? ""} onChange={(e) => setEditing({ ...editing, company_name: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Company logo URL">
            <input type="text" value={editing.company_logo_url ?? ""} onChange={(e) => setEditing({ ...editing, company_logo_url: e.target.value })} className={inputCls} placeholder="https://..." />
          </Field>
          <Field label="Company URL">
            <input type="text" value={editing.company_url ?? ""} onChange={(e) => setEditing({ ...editing, company_url: e.target.value })} className={inputCls} placeholder="https://..." />
          </Field>
          <Field label="Location">
            <input type="text" value={editing.location ?? ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className={inputCls} placeholder="San Francisco, CA or Global" />
          </Field>
          <Field label="Employment type">
            <select value={editing.employment_type ?? "full_time"} onChange={(e) => setEditing({ ...editing, employment_type: e.target.value })} className={inputCls}>
              <option value="full_time">Full time</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
              <option value="part_time">Part time</option>
              <option value="internship">Internship</option>
            </select>
          </Field>
          <Field label="Seniority">
            <select value={editing.seniority ?? ""} onChange={(e) => setEditing({ ...editing, seniority: e.target.value || null })} className={inputCls}>
              <option value="">Any</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="staff">Staff</option>
              <option value="principal">Principal</option>
              <option value="director">Director</option>
            </select>
          </Field>
          <Field label="Remote">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!editing.remote} onChange={(e) => setEditing({ ...editing, remote: e.target.checked })} />
              <span>This role is remote</span>
            </label>
          </Field>
          <Field label="Salary min (USD, full amount)">
            <input type="number" value={editing.salary_min ?? ""} onChange={(e) => setEditing({ ...editing, salary_min: e.target.value ? parseInt(e.target.value, 10) : null })} className={inputCls} placeholder="e.g. 120000" />
          </Field>
          <Field label="Salary max (USD, full amount)">
            <input type="number" value={editing.salary_max ?? ""} onChange={(e) => setEditing({ ...editing, salary_max: e.target.value ? parseInt(e.target.value, 10) : null })} className={inputCls} placeholder="e.g. 160000" />
          </Field>
          <Field label="Apply URL *">
            <input type="text" value={editing.apply_url ?? ""} onChange={(e) => setEditing({ ...editing, apply_url: e.target.value })} className={inputCls} placeholder="https://..." />
          </Field>
          <Field label="Active">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
              <span>Publicly visible on /jobs</span>
            </label>
          </Field>
        </div>

        <Field label="Description * (markdown)">
          <textarea rows={10} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={`${inputCls} font-mono text-xs`} placeholder="Role, responsibilities, what they'll work on..." />
        </Field>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading..." : `${jobs.length} listing${jobs.length === 1 ? "" : "s"}`}
        </p>
        <button
          onClick={() => setEditing({ ...EMPTY_FORM })}
          className="flex items-center gap-1.5 rounded-md bg-emerald-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-accent/90"
        >
          <Plus className="size-3.5" />
          New job
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No listings yet. Click <strong>New job</strong> above.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{job.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{job.company_name}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground capitalize">{job.employment_type.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {job.remote ? "Remote" : ""}{job.remote && job.location ? " · " : ""}{job.location || (!job.remote ? "—" : "")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${job.active ? "bg-emerald-accent/10 text-emerald-accent" : "bg-muted text-muted-foreground"}`}>
                      {job.active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => toggleActive(job)} className="rounded-md p-1.5 hover:bg-muted" title={job.active ? "Hide" : "Show"}>
                        {job.active ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </button>
                      <button onClick={() => setEditing(job)} className="rounded-md p-1.5 hover:bg-muted" title="Edit">
                        <Pencil className="size-3.5" />
                      </button>
                      <button onClick={() => remove(job.id)} className="rounded-md p-1.5 text-destructive hover:bg-destructive/10" title="Delete">
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputCls = "mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-emerald-accent/50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

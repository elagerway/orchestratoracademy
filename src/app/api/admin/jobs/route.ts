import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const ALLOWED_FIELDS = [
  "title",
  "company_name",
  "company_logo_url",
  "company_url",
  "location",
  "remote",
  "employment_type",
  "seniority",
  "salary_min",
  "salary_max",
  "salary_currency",
  "description",
  "apply_url",
  "active",
  "posted_at",
] as const;

type AllowedField = (typeof ALLOWED_FIELDS)[number];

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();
  return profile?.role === "admin" ? user : null;
}

function getSupa() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const URL_FIELDS = new Set(["apply_url", "company_url", "company_logo_url"]);

function isSafeHttpUrl(v: unknown): boolean {
  if (typeof v !== "string" || v.trim() === "") return false;
  try {
    const { protocol } = new URL(v.trim());
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

function pickFields(body: Record<string, unknown>): Record<string, unknown> | { error: string } {
  const patch: Record<string, unknown> = {};
  for (const key of Object.keys(body) as AllowedField[]) {
    if (!ALLOWED_FIELDS.includes(key)) continue;
    const v = body[key];
    if (v === null || typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      const normalized = typeof v === "string" ? v.trim() : v;
      if (URL_FIELDS.has(key) && normalized !== null && normalized !== "") {
        if (!isSafeHttpUrl(normalized)) {
          return { error: `Invalid URL for ${key} — must start with http:// or https://` };
        }
      }
      patch[key] = normalized === "" ? null : normalized;
    }
  }
  return patch;
}

export async function GET() {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: "Admin only" }, { status: 403 });

  // Admin-only listing — bypasses RLS so inactive rows are visible
  const { data, error } = await getSupa()
    .from("jobs")
    .select("*")
    .order("posted_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ jobs: data ?? [] });
}

export async function POST(request: Request) {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const body = await request.json();
  const result = pickFields(body);
  if ("error" in result) return NextResponse.json(result, { status: 400 });
  const patch = result;

  if (!patch.title || !patch.company_name || !patch.description || !patch.apply_url) {
    return NextResponse.json({ error: "Missing required fields (title, company_name, description, apply_url)" }, { status: 400 });
  }

  const { data, error } = await getSupa().from("jobs").insert(patch).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ job: data });
}

export async function PATCH(request: Request) {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const body = await request.json();
  const { id, ...rest } = body as { id?: string } & Record<string, unknown>;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const result = pickFields(rest);
  if ("error" in result) return NextResponse.json(result, { status: 400 });
  const patch = result;
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }
  patch.updated_at = new Date().toISOString();

  const { data, error } = await getSupa().from("jobs").update(patch).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ job: data });
}

export async function DELETE(request: Request) {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await getSupa().from("jobs").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

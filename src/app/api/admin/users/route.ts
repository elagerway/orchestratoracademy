import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const ALLOWED_FIELDS = ["full_name", "company_name", "company_role"] as const;
type AllowedField = (typeof ALLOWED_FIELDS)[number];

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (adminProfile?.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const body = await request.json();
  const { user_id, updates } = body as { user_id?: string; updates?: Record<string, unknown> };

  if (!user_id || typeof user_id !== "string") {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }
  if (!updates || typeof updates !== "object") {
    return NextResponse.json({ error: "Missing updates" }, { status: 400 });
  }

  // Whitelist + normalize: only allow known columns, strings only, trim
  const patch: Record<string, string | null> = {};
  for (const key of Object.keys(updates) as AllowedField[]) {
    if (!ALLOWED_FIELDS.includes(key)) continue;
    const v = updates[key];
    if (v === null || typeof v === "string") {
      patch[key] = typeof v === "string" ? v.trim() : null;
    }
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const supa = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supa
    .from("profiles")
    .update(patch)
    .eq("user_id", user_id)
    .select("user_id, full_name, company_name, company_role")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { user_ids, course_ids } = await request.json();

  if (!user_ids?.length || !course_ids?.length) {
    return NextResponse.json({ error: "Missing user_ids or course_ids" }, { status: 400 });
  }

  const supa = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Build enrollment rows, skipping duplicates
  const rows = [];
  for (const uid of user_ids) {
    for (const cid of course_ids) {
      rows.push({ user_id: uid, course_id: cid });
    }
  }

  const { data, error } = await supa
    .from("user_enrollments")
    .upsert(rows, { onConflict: "user_id,course_id", ignoreDuplicates: true })
    .select("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    enrolled: rows.length,
    new_enrollments: data?.length ?? 0,
  });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { user_ids, course_ids } = await request.json();

  if (!user_ids?.length || !course_ids?.length) {
    return NextResponse.json({ error: "Missing user_ids or course_ids" }, { status: 400 });
  }

  const supa = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let revoked = 0;
  const errors: string[] = [];
  for (const uid of user_ids) {
    for (const cid of course_ids) {
      const { error } = await supa
        .from("user_enrollments")
        .delete()
        .eq("user_id", uid)
        .eq("course_id", cid);
      if (error) errors.push(`${uid}/${cid}: ${error.message}`);
      else revoked++;
    }
  }

  if (errors.length) {
    return NextResponse.json({ success: false, revoked, errors }, { status: 207 });
  }

  return NextResponse.json({ success: true, revoked });
}

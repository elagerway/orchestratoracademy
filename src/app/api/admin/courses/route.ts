import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { course_id, active } = await request.json();

  if (!course_id || typeof active !== "boolean") {
    return NextResponse.json({ error: "Missing course_id or active boolean" }, { status: 400 });
  }

  const supa = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // If deactivating, check for enrolled users
  let affectedUsers: { email: string; full_name: string }[] = [];
  if (!active) {
    const { data: enrollments } = await supa
      .from("user_enrollments")
      .select("user_id")
      .eq("course_id", course_id);

    if (enrollments && enrollments.length > 0) {
      const userIds = enrollments.map((e) => e.user_id);
      const { data: profiles } = await supa
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      const { data: { users: authUsers } } = await supa.auth.admin.listUsers({ perPage: 1000 });
      const emailMap = new Map(authUsers.map((u) => [u.id, u.email ?? ""]));

      affectedUsers = (profiles ?? []).map((p) => ({
        email: emailMap.get(p.user_id) ?? "",
        full_name: p.full_name ?? "",
      }));
    }
  }

  // Update course
  const { error } = await supa
    .from("courses")
    .update({ active })
    .eq("id", course_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    active,
    affected_users: affectedUsers,
  });
}

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

  const { course_id } = await request.json();

  const supa = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: enrollments } = await supa
    .from("user_enrollments")
    .select("user_id")
    .eq("course_id", course_id);

  if (!enrollments?.length) {
    return NextResponse.json({ affected_users: [] });
  }

  const userIds = enrollments.map((e) => e.user_id);
  const { data: profiles } = await supa
    .from("profiles")
    .select("user_id, full_name")
    .in("user_id", userIds);

  const { data: { users: authUsers } } = await supa.auth.admin.listUsers({ perPage: 1000 });
  const emailMap = new Map(authUsers.map((u) => [u.id, u.email ?? ""]));

  return NextResponse.json({
    affected_users: (profiles ?? []).map((p) => ({
      email: emailMap.get(p.user_id) ?? "",
      full_name: p.full_name ?? "",
    })),
  });
}

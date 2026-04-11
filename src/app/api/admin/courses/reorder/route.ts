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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { ordered_ids } = await request.json();

  if (!Array.isArray(ordered_ids) || ordered_ids.length === 0) {
    return NextResponse.json({ error: "Missing ordered_ids array" }, { status: 400 });
  }

  const supa = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Update each course's order
  for (let i = 0; i < ordered_ids.length; i++) {
    const { error } = await supa
      .from("courses")
      .update({ order: i + 1 })
      .eq("id", ordered_ids[i]);

    if (error) {
      return NextResponse.json({ error: `Failed to update course ${ordered_ids[i]}: ${error.message}` }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}

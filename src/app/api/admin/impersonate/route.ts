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

  // Verify admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { user_id } = await request.json();

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const supa = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Generate a magic link for the target user
  const { data: targetUser } = await supa.auth.admin.getUserById(user_id);

  if (!targetUser?.user?.email) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { data: linkData, error } = await supa.auth.admin.generateLink({
    type: "magiclink",
    email: targetUser.user.email,
  });

  if (error || !linkData?.properties?.hashed_token) {
    return NextResponse.json({ error: error?.message ?? "Failed to generate link" }, { status: 500 });
  }

  // Verify the token to get a session
  const { data: session, error: verifyError } = await supa.auth.verifyOtp({
    type: "magiclink",
    token_hash: linkData.properties.hashed_token,
  });

  if (verifyError || !session?.session) {
    return NextResponse.json({ error: verifyError?.message ?? "Failed to create session" }, { status: 500 });
  }

  return NextResponse.json({
    access_token: session.session.access_token,
    refresh_token: session.session.refresh_token,
    user_email: targetUser.user.email,
  });
}

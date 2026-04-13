import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawRedirect = searchParams.get("redirect") || "/dashboard";
  const redirect = rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
    ? rawRedirect
    : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if this is a new user (profile has no name set yet)
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", data.user.id)
          .single();

        const name = (profile?.full_name ?? "").trim();
        // Require a real name: non-empty, contains a space (first + last), no camelCase gibberish
        const looksReal = name.length >= 3 && name.includes(" ") && !/[a-z][A-Z]/.test(name);
        if (!looksReal) {
          return NextResponse.redirect(`${origin}/dashboard/profile?welcome=true`);
        }
      }
      return NextResponse.redirect(`${origin}${redirect}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login`);
}

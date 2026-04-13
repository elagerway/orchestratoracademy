import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

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

    if (!error && data.user) {
      const supa = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data: profile } = await supa
        .from("profiles")
        .select("full_name, signup_ip")
        .eq("user_id", data.user.id)
        .single();

      // Capture IP and region on first login (signup_ip not yet set)
      if (profile && !profile.signup_ip) {
        const hdrs = await headers();
        const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim()
          || hdrs.get("x-real-ip")
          || "unknown";

        // Geo lookup via free ip-api
        let region = "Unknown";
        try {
          const geo = await fetch(`http://ip-api.com/json/${ip}?fields=city,regionName,country`);
          if (geo.ok) {
            const g = await geo.json();
            region = [g.city, g.regionName, g.country].filter(Boolean).join(", ");
          }
        } catch {
          // Non-critical — don't block signup
        }

        await supa
          .from("profiles")
          .update({ signup_ip: ip, signup_region: region })
          .eq("user_id", data.user.id);
      }

      const name = (profile?.full_name ?? "").trim();
      const looksReal = name.length >= 3 && name.includes(" ") && !/[a-z][A-Z]/.test(name);
      if (!looksReal) {
        return NextResponse.redirect(`${origin}/dashboard/profile?welcome=true`);
      }

      return NextResponse.redirect(`${origin}${redirect}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login`);
}

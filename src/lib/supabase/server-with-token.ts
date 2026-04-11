import { createClient as createCookieClient } from "./server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client that supports both cookie-based auth (web)
 * and Bearer token auth (CLI tools like /assess-team and /deploy-project).
 *
 * Checks for Authorization: Bearer <token> header first.
 * Falls back to cookie-based auth for normal web requests.
 */
export async function createClientFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      }
    );
  }

  return createCookieClient();
}

"use client";

import { useState, useEffect } from "react";
import { Eye } from "lucide-react";

export function ImpersonationBanner() {
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    setIsImpersonating(sessionStorage.getItem("admin_return") === "true");
  }, []);

  if (!isImpersonating) return null;

  async function handleReturn() {
    setReturning(true);
    const accessToken = sessionStorage.getItem("admin_access_token");
    const refreshToken = sessionStorage.getItem("admin_refresh_token");

    sessionStorage.removeItem("admin_return");
    sessionStorage.removeItem("admin_access_token");
    sessionStorage.removeItem("admin_refresh_token");

    if (accessToken && refreshToken) {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      window.location.href = "/dashboard/admin";
    } else {
      window.location.href = "/auth/login";
    }
  }

  return (
    <div className="flex items-center justify-between bg-amber-500 px-4 py-2 text-sm font-medium text-black">
      <div className="flex items-center gap-2">
        <Eye className="size-4" />
        You are viewing as another user
      </div>
      <button
        onClick={handleReturn}
        disabled={returning}
        className="rounded-md bg-black/20 px-3 py-1 text-xs font-semibold transition-colors hover:bg-black/30 disabled:opacity-50"
      >
        {returning ? "Returning..." : "Return to Admin"}
      </button>
    </div>
  );
}

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const EMPLOYMENT_TYPES = ["full_time", "contract", "freelance", "part_time", "internship"] as const;
const SENIORITIES = ["junior", "mid", "senior", "staff", "principal", "director"] as const;

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const token = body.turnstile_token;
  if (typeof token !== "string" || !token) {
    return NextResponse.json({ error: "Captcha missing" }, { status: 400 });
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const ok = await verifyTurnstile(token, ip);
  if (!ok) {
    return NextResponse.json({ error: "Captcha failed" }, { status: 400 });
  }

  const str = (v: unknown, max = 2000): string | null => {
    if (typeof v !== "string") return null;
    const trimmed = v.trim();
    return trimmed ? trimmed.slice(0, max) : null;
  };

  const required = {
    submitter_name: str(body.submitter_name, 120),
    submitter_email: str(body.submitter_email, 200),
    company_name: str(body.company_name, 200),
    title: str(body.title, 200),
    description: str(body.description, 8000),
    apply_url: str(body.apply_url, 500),
  };
  for (const [k, v] of Object.entries(required)) {
    if (!v) return NextResponse.json({ error: `Missing ${k}` }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(required.submitter_email!)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!/^https?:\/\//i.test(required.apply_url!)) {
    return NextResponse.json({ error: "Apply URL must start with http(s)://" }, { status: 400 });
  }

  const employmentType = typeof body.employment_type === "string" && (EMPLOYMENT_TYPES as readonly string[]).includes(body.employment_type)
    ? body.employment_type
    : "full_time";
  const seniorityRaw = typeof body.seniority === "string" ? body.seniority : null;
  const seniority = seniorityRaw && (SENIORITIES as readonly string[]).includes(seniorityRaw) ? seniorityRaw : null;

  const salaryMin = typeof body.salary_min === "number" && Number.isFinite(body.salary_min) ? Math.round(body.salary_min) : null;
  const salaryMax = typeof body.salary_max === "number" && Number.isFinite(body.salary_max) ? Math.round(body.salary_max) : null;

  const payload = {
    submitter_name: required.submitter_name,
    submitter_email: required.submitter_email,
    company_name: required.company_name,
    company_url: str(body.company_url, 500),
    title: required.title,
    location: str(body.location, 200),
    remote: typeof body.remote === "boolean" ? body.remote : false,
    employment_type: employmentType,
    seniority,
    salary_min: salaryMin,
    salary_max: salaryMax,
    salary_currency: str(body.salary_currency, 3) ?? "USD",
    description: required.description,
    apply_url: required.apply_url,
    active: false, // admin reviews before it goes live
  };

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error } = await supabaseAdmin.from("jobs").insert(payload);
  if (error) {
    console.error("job submit insert failed:", error);
    return NextResponse.json({ error: "Could not save submission" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

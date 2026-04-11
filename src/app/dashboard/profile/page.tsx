import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";

interface ProfilePageProps {
  searchParams: Promise<{ welcome?: string }>;
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const { welcome } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) redirect("/dashboard");

  const isWelcome = welcome === "true";

  return (
    <div className="space-y-8">
      {isWelcome ? (
        <div>
          <h1 className="font-heading text-2xl font-bold">Welcome to Orchestrator Academy</h1>
          <p className="mt-2 text-muted-foreground">
            Set up your profile, then jump into your first course. The foundations course is free and covers everything you need to start orchestrating AI agents.
          </p>
        </div>
      ) : (
        <div>
          <h1 className="font-heading text-2xl font-bold">Profile</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your account details.
          </p>
        </div>
      )}

      <ProfileForm
        profile={profile}
        email={user.email ?? ""}
        isWelcome={isWelcome}
      />
    </div>
  );
}

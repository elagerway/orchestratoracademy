import { createClient } from "@/lib/supabase/server";
import type { Subscription } from "@/lib/types/database";

export async function getUserSubscription(
  userId: string
): Promise<Subscription | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Subscription;
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MessagesView } from "./messages-view";

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Fetch all DMs involving this user
  const { data: allMessages } = await supabase
    .from("direct_messages")
    .select("*")
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  // Build unique conversation partner IDs
  const partnerIds = new Set<string>();
  for (const msg of allMessages ?? []) {
    const partnerId =
      msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
    partnerIds.add(partnerId);
  }

  // Fetch profiles for all conversation partners
  const partnerProfiles: Record<string, any> = {};
  if (partnerIds.size > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, username, avatar_url")
      .in("user_id", Array.from(partnerIds));
    for (const p of profiles ?? []) {
      partnerProfiles[p.user_id] = p;
    }
  }

  // Build conversations: grouped by partner, with last message + unread count
  const conversations: any[] = [];
  const seen = new Set<string>();
  for (const msg of allMessages ?? []) {
    const partnerId =
      msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
    if (seen.has(partnerId)) continue;
    seen.add(partnerId);

    const unreadCount = (allMessages ?? []).filter(
      (m: any) =>
        m.sender_id === partnerId &&
        m.recipient_id === user.id &&
        !m.read
    ).length;

    conversations.push({
      partnerId,
      profile: partnerProfiles[partnerId] ?? null,
      lastMessage: msg,
      unreadCount,
    });
  }

  // Fetch all profiles for "new message" search
  const { data: allProfiles } = await supabase
    .from("profiles")
    .select("user_id, full_name, username, avatar_url")
    .neq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <MessagesView
      conversations={conversations}
      allProfiles={(allProfiles ?? []) as any[]}
      currentUserId={user.id}
    />
  );
}

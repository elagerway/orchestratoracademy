"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Search,
  Send,
  Plus,
  X,
  User,
  Trash2,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { RichText } from "@/components/rich-text";

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function displayName(profile: any) {
  return profile?.full_name || profile?.username || "Anonymous";
}

function MessageBubble({
  msg,
  isMe,
  onDelete,
}: {
  msg: any;
  isMe: boolean;
  onDelete: () => void;
}) {
  return (
    <div className={`group flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className="flex items-end gap-1.5 max-w-[75%]">
        {isMe && (
          <button
            onClick={onDelete}
            className="mb-1 rounded p-0.5 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground hover:!text-red-400"
            title="Delete"
          >
            <Trash2 className="size-3" />
          </button>
        )}
        <div>
          <div
            className={`rounded-2xl px-3.5 py-2 text-sm ${
              isMe
                ? "bg-foreground text-background"
                : "bg-muted text-foreground"
            }`}
          >
            <RichText text={msg.body ?? ""} variant={isMe ? "dark" : "light"} />
            <p
              className={`mt-0.5 text-[10px] ${
                isMe ? "text-background/50" : "text-muted-foreground/60"
              }`}
            >
              {timeAgo(msg.created_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MessagesViewProps {
  conversations: any[];
  allProfiles: any[];
  currentUserId: string;
}

export function MessagesView({
  conversations: initialConversations,
  allProfiles,
  currentUserId,
}: MessagesViewProps) {
  const router = useRouter();
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [msgBody, setMsgBody] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeProfile = activePartnerId
    ? initialConversations.find((c) => c.partnerId === activePartnerId)
        ?.profile ??
      allProfiles.find((p) => p.user_id === activePartnerId)
    : null;

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activePartnerId) return;
    loadMessages(activePartnerId);
  }, [activePartnerId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadMessages(partnerId: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from("direct_messages")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUserId},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${currentUserId})`
      )
      .order("created_at");
    setMessages(data ?? []);

    // Mark as read
    await supabase
      .from("direct_messages")
      .update({ read: true })
      .eq("sender_id", partnerId)
      .eq("recipient_id", currentUserId)
      .eq("read", false);
  }

  async function handleSend() {
    if (!msgBody.trim() || !activePartnerId) return;
    setSending(true);
    const supabase = createClient();
    await supabase.from("direct_messages").insert({
      sender_id: currentUserId,
      recipient_id: activePartnerId,
      body: msgBody.trim(),
    });
    setMsgBody("");
    setSending(false);
    loadMessages(activePartnerId);
    router.refresh();
  }

  async function handleDelete(msgId: string) {
    const supabase = createClient();
    await supabase.from("direct_messages").delete().eq("id", msgId);
    if (activePartnerId) loadMessages(activePartnerId);
    router.refresh();
  }

  function startNewChat(profile: any) {
    setActivePartnerId(profile.user_id);
    setShowNewChat(false);
    setNewChatSearch("");
  }

  // Filter conversations by search
  const filteredConversations = initialConversations.filter((c) => {
    if (!search) return true;
    const name = displayName(c.profile).toLowerCase();
    return name.includes(search.toLowerCase());
  });

  // Filter profiles for new chat
  const existingPartnerIds = new Set(
    initialConversations.map((c: any) => c.partnerId)
  );
  const filteredNewProfiles = allProfiles.filter((p) => {
    const name = displayName(p).toLowerCase();
    const matchesSearch = !newChatSearch || name.includes(newChatSearch.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex h-[calc(100vh-7rem)] overflow-hidden rounded-lg border border-border">
      {/* Left panel — conversations */}
      <div
        className={`w-80 shrink-0 border-r border-border/60 bg-muted/20 ${
          activePartnerId ? "hidden md:flex md:flex-col" : "flex flex-col"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <h2 className="font-heading text-lg font-semibold">Messages</h2>
          <button
            onClick={() => setShowNewChat(true)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="New message"
          >
            <Plus className="size-4" />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-border/40 px-3 py-2">
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5">
            <Search className="size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        {/* New chat modal overlay */}
        {showNewChat && (
          <div className="border-b border-border/60 bg-background p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                New Message
              </span>
              <button
                onClick={() => {
                  setShowNewChat(false);
                  setNewChatSearch("");
                }}
                className="rounded p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Search members..."
              value={newChatSearch}
              onChange={(e) => setNewChatSearch(e.target.value)}
              className="mb-2 w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm outline-none focus:border-emerald-accent/50"
              autoFocus
            />
            <div className="max-h-40 space-y-0.5 overflow-y-auto">
              {filteredNewProfiles.map((p) => (
                <button
                  key={p.user_id}
                  onClick={() => startNewChat(p)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
                >
                  <Avatar className="size-6">
                    {p.avatar_url && <AvatarImage src={p.avatar_url} />}
                    <AvatarFallback>
                      <User className="size-3 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{displayName(p)}</span>
                </button>
              ))}
              {filteredNewProfiles.length === 0 && (
                <p className="py-2 text-center text-xs text-muted-foreground">
                  No members found
                </p>
              )}
            </div>
          </div>
        )}

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 && !showNewChat ? (
            <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
              <MessageSquare className="size-8 text-muted-foreground/40" />
              <div>
                <p className="text-sm font-medium">No conversations</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Start a conversation from the Community page
                </p>
              </div>
            </div>
          ) : (
            filteredConversations.map((convo) => {
              const isActive = activePartnerId === convo.partnerId;
              const lastMsg = convo.lastMessage;
              if (!lastMsg) return null;
              const isFromMe = lastMsg.sender_id === currentUserId;
              return (
                <button
                  key={convo.partnerId}
                  onClick={() => setActivePartnerId(convo.partnerId)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                    isActive
                      ? "bg-muted"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <Avatar className="mt-0.5 size-9 shrink-0">
                    {convo.profile?.avatar_url && (
                      <AvatarImage src={convo.profile.avatar_url} />
                    )}
                    <AvatarFallback>
                      <User className="size-4 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`truncate text-sm ${
                          convo.unreadCount > 0
                            ? "font-semibold"
                            : "font-medium"
                        }`}
                      >
                        {displayName(convo.profile)}
                      </span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {timeAgo(lastMsg.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-xs text-muted-foreground">
                        {isFromMe ? "You: " : ""}
                        {lastMsg.body}
                      </p>
                      {convo.unreadCount > 0 && (
                        <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-accent text-[10px] font-bold text-white">
                          {convo.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right panel — active chat */}
      <div
        className={`flex flex-1 flex-col ${
          !activePartnerId ? "hidden md:flex" : "flex"
        }`}
      >
        {!activePartnerId ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <MessageSquare className="size-12 text-muted-foreground/30" />
            <div>
              <p className="font-medium">Select a conversation</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Choose from your existing conversations or start a new one
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
              <button
                onClick={() => setActivePartnerId(null)}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
              >
                <ArrowLeft className="size-4" />
              </button>
              <Avatar className="size-8">
                {activeProfile?.avatar_url && (
                  <AvatarImage src={activeProfile.avatar_url} />
                )}
                <AvatarFallback>
                  <User className="size-3.5 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">
                  {displayName(activeProfile)}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.length === 0 && (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  No messages yet. Say hello!
                </p>
              )}
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  isMe={msg.sender_id === currentUserId}
                  onDelete={() => handleDelete(msg.id)}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2 border-t border-border/60 px-4 py-3">
              <input
                type="text"
                placeholder={`Message ${displayName(activeProfile)}...`}
                value={msgBody}
                onChange={(e) => setMsgBody(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 rounded-lg border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-emerald-accent/50"
              />
              <Button
                onClick={handleSend}
                disabled={sending || !msgBody.trim()}
                size="sm"
              >
                <Send className="size-3.5" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

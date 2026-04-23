"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/rich-text";
import {
  MessageSquare,
  ThumbsUp,
  Pin,
  Plus,
  X,
  Send,
  Hash,
  ChevronRight,
  Users,
  User,
  Mail,
  Calendar,
  Briefcase,
  Trophy,
} from "lucide-react";

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0] || "?").slice(0, 2).toUpperCase();
}

// ── Member Profile Modal ─────────────────────────────────────────────────────

function MemberModal({
  member,
  currentUserId,
  onClose,
}: {
  member: any;
  currentUserId: string;
  onClose: () => void;
}) {
  const [profile, setProfile] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [msgBody, setMsgBody] = useState("");
  const [sending, setSending] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const isSelf = member.user_id === currentUserId;

  useEffect(() => {
    const supabase = createClient();
    // Fetch full profile
    supabase
      .from("profiles")
      .select("full_name, username, avatar_url, bio, company_name, company_role, xp, level, created_at")
      .eq("user_id", member.user_id)
      .single()
      .then(({ data }) => setProfile(data));
  }, [member.user_id]);

  useEffect(() => {
    if (!showChat) return;
    loadMessages();
  }, [showChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadMessages() {
    const supabase = createClient();
    const { data } = await supabase
      .from("direct_messages")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUserId},recipient_id.eq.${member.user_id}),and(sender_id.eq.${member.user_id},recipient_id.eq.${currentUserId})`
      )
      .order("created_at");
    setMessages(data ?? []);

    // Mark unread messages as read
    await supabase
      .from("direct_messages")
      .update({ read: true })
      .eq("sender_id", member.user_id)
      .eq("recipient_id", currentUserId)
      .eq("read", false);
  }

  async function handleSend() {
    if (!msgBody.trim()) return;
    setSending(true);
    const supabase = createClient();
    await supabase.from("direct_messages").insert({
      sender_id: currentUserId,
      recipient_id: member.user_id,
      body: msgBody.trim(),
    });
    setMsgBody("");
    setSending(false);
    loadMessages();
  }

  const displayName = profile?.full_name || profile?.username || member.full_name || member.username || "Anonymous";

  return (
    <div
      ref={backdropRef}
      onClick={(e) => e.target === backdropRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <h3 className="font-heading text-lg font-semibold">
            {showChat ? `Chat with ${displayName}` : "Member Profile"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {!showChat ? (
          /* ── Profile View ── */
          <div className="p-5">
            {/* Avatar + name */}
            <div className="mb-4 flex items-center gap-4">
              <Avatar className="size-14">
                {(profile?.avatar_url || member.avatar_url) && (
                  <AvatarImage src={profile?.avatar_url || member.avatar_url} />
                )}
                <AvatarFallback>
                  <User className="size-6 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">{displayName}</p>
                {profile?.username && profile?.full_name && (
                  <p className="text-sm text-muted-foreground">@{profile.username}</p>
                )}
              </div>
            </div>

            {/* Info grid */}
            <div className="space-y-2.5">
              {profile?.bio && (
                <p className="text-sm text-muted-foreground">{profile.bio}</p>
              )}

              {profile?.company_name && (
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="size-3.5 text-muted-foreground" />
                  <span>
                    {profile.company_role ? `${profile.company_role} at ` : ""}
                    {profile.company_name}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Trophy className="size-3.5 text-muted-foreground" />
                <span>Level {profile?.level ?? 1} &middot; {profile?.xp ?? 0} XP</span>
              </div>

              {profile?.created_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  <span>
                    Joined{" "}
                    {new Date(profile.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Message button */}
            {!isSelf && (
              <Button
                onClick={() => setShowChat(true)}
                className="mt-5 w-full"
                size="lg"
              >
                <Mail className="size-4" />
                Send Message
              </Button>
            )}
          </div>
        ) : (
          /* ── Chat View ── */
          <div className="flex h-80 flex-col">
            {/* Messages */}
            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              {messages.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No messages yet. Say hello!
                </p>
              )}
              {messages.map((msg) => {
                const isMe = msg.sender_id === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                        isMe
                          ? "bg-foreground text-background"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p>{msg.body}</p>
                      <p
                        className={`mt-0.5 text-[10px] ${
                          isMe ? "text-background/60" : "text-muted-foreground"
                        }`}
                      >
                        {timeAgo(msg.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2 border-t border-border/60 p-3">
              <input
                type="text"
                placeholder="Type a message..."
                value={msgBody}
                onChange={(e) => setMsgBody(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-accent/50"
                autoFocus
              />
              <Button onClick={handleSend} disabled={sending} size="sm">
                <Send className="size-3.5" />
              </Button>
            </div>

            {/* Back to profile */}
            <button
              onClick={() => setShowChat(false)}
              className="border-t border-border/60 px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              &larr; Back to profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface ForumViewProps {
  categories: any[];
  posts: any[];
  members: any[];
  currentUserId: string;
  isAdmin: boolean;
}

export function ForumView({
  categories,
  posts: initialPosts,
  members,
  currentUserId,
  isAdmin,
}: ForumViewProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const defaultCategoryId = categories.find((c) => c.parent_id)?.id ?? "";
  const [newCategoryId, setNewCategoryId] = useState(defaultCategoryId);
  const [replies, setReplies] = useState<Record<string, any[]>>({});

  // Build category hierarchy
  const topCategories = categories.filter((c) => !c.parent_id);
  const subCategories = (parentId: string) =>
    categories.filter((c) => c.parent_id === parentId);

  const announcementsCategoryId = categories.find(
    (c) => c.slug === "announcements"
  )?.id;

  // Is the current view an admin-only category?
  const isAnnouncementsSelected = selectedCategory === announcementsCategoryId;
  const canPost = !isAnnouncementsSelected || isAdmin;

  // Filter posts
  const filteredPosts = selectedCategory
    ? initialPosts.filter((p: any) => p.category_id === selectedCategory)
    : initialPosts;

  const selectedCategoryData = selectedCategory
    ? categories.find((c) => c.id === selectedCategory)
    : null;

  async function handleNewPost(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;
    setSubmitting(true);

    const supabase = createClient();
    const categoryId = selectedCategory || newCategoryId;

    const { error } = await supabase.from("forum_posts").insert({
      category_id: categoryId,
      user_id: currentUserId,
      title: newTitle.trim(),
      body: newBody.trim(),
    });

    if (error) {
      console.error("Post error:", error);
      setSubmitting(false);
      return;
    }

    setNewTitle("");
    setNewBody("");
    setShowNewPost(false);
    setSubmitting(false);
    router.refresh();
  }

  async function handleReply(postId: string) {
    if (!replyBody.trim()) return;
    setSubmitting(true);

    const supabase = createClient();
    await supabase.from("forum_replies").insert({
      post_id: postId,
      user_id: currentUserId,
      body: replyBody.trim(),
    });

    setReplyBody("");
    setReplyingTo(null);
    setSubmitting(false);
    // Reload replies for this post
    loadReplies(postId);
    router.refresh();
  }

  async function loadReplies(postId: string) {
    const supabase = createClient();
    const { data: rawReplies } = await supabase
      .from("forum_replies")
      .select("*")
      .eq("post_id", postId)
      .order("created_at");

    const TEAM_PROFILE = { full_name: "Orchestrator Academy Team", avatar_url: null };

    const authorIds = Array.from(new Set((rawReplies ?? []).map((r: any) => r.user_id)));
    const profileByUserId = new Map<string, { full_name: string | null; avatar_url: string | null; post_as_team: boolean }>();
    if (authorIds.length) {
      const { data: authorProfiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url, post_as_team")
        .in("user_id", authorIds);
      for (const p of authorProfiles ?? []) {
        profileByUserId.set(p.user_id, {
          full_name: p.full_name,
          avatar_url: p.avatar_url,
          post_as_team: p.post_as_team,
        });
      }
    }

    const hydrated = (rawReplies ?? []).map((r: any) => {
      const author = profileByUserId.get(r.user_id);
      return {
        ...r,
        profiles: author?.post_as_team
          ? TEAM_PROFILE
          : author
            ? { full_name: author.full_name, avatar_url: author.avatar_url }
            : null,
      };
    });
    setReplies((prev) => ({ ...prev, [postId]: hydrated }));
  }

  async function handleReaction(postId: string) {
    const supabase = createClient();
    // Toggle — try insert, if conflict then delete
    const { error } = await supabase.from("forum_reactions").insert({
      post_id: postId,
      user_id: currentUserId,
      emoji: "👍",
    });
    if (error?.code === "23505") {
      // Already reacted, remove it
      await supabase
        .from("forum_reactions")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", currentUserId)
        .eq("emoji", "👍");
    }
    router.refresh();
  }

  function toggleExpand(postId: string) {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      if (!replies[postId]) loadReplies(postId);
    }
  }

  return (
    <div className="flex gap-6">
      {/* Left sidebar — categories */}
      <div className="hidden w-52 shrink-0 lg:block">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`mb-3 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            !selectedCategory
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <MessageSquare className="size-4" />
          All Posts
        </button>

        {topCategories.map((cat) => (
          <div key={cat.id} className="mb-3">
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {cat.title}
            </p>
            <div className="space-y-0.5">
              {subCategories(cat.id).map((sub) => {
                const count = initialPosts.filter(
                  (p: any) => p.category_id === sub.id
                ).length;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedCategory(sub.id)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors ${
                      selectedCategory === sub.id
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Hash className="size-3" />
                      {sub.title}
                    </span>
                    {count > 0 && (
                      <span className="text-xs text-muted-foreground/60">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Main content — posts */}
      <div className="min-w-0 flex-1">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">
              {selectedCategoryData
                ? selectedCategoryData.title
                : "Community"}
            </h1>
            {selectedCategoryData?.description && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {selectedCategoryData.description}
              </p>
            )}
          </div>
          {canPost && (
            <Button onClick={() => setShowNewPost(true)} size="sm">
              <Plus className="size-4" />
              New post
            </Button>
          )}
        </div>

        {/* New post form */}
        {showNewPost && (
          <div className="mb-4 rounded-lg border border-border bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-medium">New Post</h3>
              <button
                onClick={() => setShowNewPost(false)}
                className="rounded p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>
            <form onSubmit={handleNewPost} className="space-y-3">
              <input
                type="text"
                placeholder="Post title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-accent/50"
                autoFocus
              />
              <textarea
                placeholder="What's on your mind?"
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-accent/50"
              />
              {/* Category selector for new post */}
              {!selectedCategory && (
                <select
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none"
                  value={newCategoryId}
                  onChange={(e) => setNewCategoryId(e.target.value)}
                >
                  {categories
                    .filter((c) => c.parent_id)
                    .filter((c) => isAdmin || c.slug !== "announcements")
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                </select>
              )}
              <div className="flex justify-end">
                <Button type="submit" size="sm" disabled={submitting}>
                  <Send className="size-3.5" />
                  {submitting ? "Posting..." : "Post"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Post list */}
        <div className="space-y-1">
          {filteredPosts.length === 0 ? (
            <div className="rounded-lg border border-border px-4 py-12 text-center text-muted-foreground">
              <MessageSquare className="mx-auto mb-3 size-8 text-muted-foreground/40" />
              <p className="font-medium">No posts yet</p>
              <p className="mt-1 text-sm">
                Be the first to start a conversation
              </p>
            </div>
          ) : (
            filteredPosts.map((post: any) => {
              const author = post.profiles;
              const replyCount = post.reply_count ?? 0;
              const reactionCount = post.reaction_count ?? 0;
              const isExpanded = expandedPost === post.id;
              const postReplies = replies[post.id] ?? [];

              return (
                <div
                  key={post.id}
                  className="rounded-lg border border-border/60 bg-background transition-colors hover:border-border"
                >
                  {/* Post row */}
                  <button
                    onClick={() => toggleExpand(post.id)}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left"
                  >
                    <Avatar className="mt-0.5 size-8 shrink-0">
                      {author?.avatar_url && (
                        <AvatarImage src={author.avatar_url} />
                      )}
                      <AvatarFallback className="text-xs">
                        {getInitials(author?.full_name || "?")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {post.pinned && (
                          <Pin className="size-3 text-emerald-accent" />
                        )}
                        <span className="truncate font-medium text-sm">
                          {post.title}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {author?.full_name || author?.username || "Anonymous"} &middot;{" "}
                        {timeAgo(post.created_at)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="size-3" />
                        {reactionCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="size-3" />
                        {replyCount}
                      </span>
                      <ChevronRight
                        className={`size-3.5 transition-transform ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Expanded view */}
                  {isExpanded && (
                    <div className="border-t border-border/40 px-4 py-3">
                      {/* Post body */}
                      <div className="mb-3 text-sm">
                        <RichText text={post.body} />
                      </div>

                      {/* Actions */}
                      <div className="mb-3 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReaction(post.id);
                          }}
                          className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <ThumbsUp className="size-3" />
                          {reactionCount}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReplyingTo(
                              replyingTo === post.id ? null : post.id
                            );
                          }}
                          className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <MessageSquare className="size-3" />
                          Reply
                        </button>
                      </div>

                      {/* Replies */}
                      {postReplies.length > 0 && (
                        <div className="space-y-2 border-l-2 border-border/40 pl-4">
                          {postReplies.map((reply: any) => (
                            <div key={reply.id} className="flex gap-2">
                              <Avatar className="mt-0.5 size-6 shrink-0">
                                {reply.profiles?.avatar_url && (
                                  <AvatarImage
                                    src={reply.profiles.avatar_url}
                                  />
                                )}
                                <AvatarFallback className="text-[10px]">
                                  {getInitials(
                                    reply.profiles?.full_name || "?"
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-xs">
                                  <span className="font-medium">
                                    {reply.profiles?.full_name || reply.profiles?.username || "Anonymous"}
                                  </span>{" "}
                                  <span className="text-muted-foreground">
                                    &middot; {timeAgo(reply.created_at)}
                                  </span>
                                </p>
                                <div className="mt-0.5 text-sm">
                                  <RichText text={reply.body} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply input */}
                      {replyingTo === post.id && (
                        <div className="mt-3 flex gap-2">
                          <input
                            type="text"
                            placeholder="Write a reply..."
                            value={replyBody}
                            onChange={(e) => setReplyBody(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleReply(post.id);
                              }
                            }}
                            className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-emerald-accent/50"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={() => handleReply(post.id)}
                            disabled={submitting}
                          >
                            <Send className="size-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right sidebar — members */}
      <div className="hidden w-48 shrink-0 xl:block">
        <div className="rounded-lg border border-border/60 p-4">
          <h3 className="mb-3 flex items-center gap-2 px-2 text-sm font-semibold">
            <Users className="size-4" />
            Members
          </h3>
          <div className="space-y-1">
            {members.map((member: any) => (
              <button
                key={member.user_id}
                onClick={() => setSelectedMember(member)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted"
              >
                <Avatar className="size-6">
                  {member.avatar_url && (
                    <AvatarImage src={member.avatar_url} />
                  )}
                  <AvatarFallback>
                    <User className="size-3 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <span className="truncate text-sm">
                  {member.full_name || member.username || "Anonymous"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Member profile modal */}
      {selectedMember && (
        <MemberModal
          member={selectedMember}
          currentUserId={currentUserId}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}

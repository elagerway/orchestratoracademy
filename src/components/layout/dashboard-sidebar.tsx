"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  BookOpen,
  User,
  Award,
  Trophy,
  Shield,
  LogOut,
  Sun,
  Moon,
  Key,
  ChevronUp,
  MessageCircle,
  Newspaper,
  X,
  Inbox,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/app/auth/actions";
import { BuyMeCoffeeButton } from "@/components/buy-me-coffee";
import { BookCallButton } from "@/components/book-call";
import { createClient } from "@/lib/supabase/client";

const FORUM_LAST_SEEN_KEY = "forum-last-seen";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/achievements", label: "Achievements", icon: Trophy },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/messages", label: "Messages", icon: Inbox },
  { href: "/dashboard/support", label: "Community", icon: MessageCircle, trackKey: "community" as const },
];

interface DashboardSidebarProps {
  isAdmin: boolean;
  user: {
    email: string;
    fullName: string;
    avatarUrl: string | null;
    initials: string;
  };
  latestPost: {
    title: string;
    slug: string;
    excerpt: string | null;
    publishedAt: string;
  } | null;
}

export function DashboardSidebar({ isAdmin, user, latestPost }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [newsDismissed, setNewsDismissed] = useState(() =>
    typeof window !== "undefined" && latestPost
      ? localStorage.getItem(`news-dismissed-${latestPost.slug}`) === "1"
      : false
  );
  const menuRef = useRef<HTMLDivElement>(null);

  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [communityUnread, setCommunityUnread] = useState(0);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  // Count forum posts newer than last-seen, and clear on visit.
  useEffect(() => {
    let cancelled = false;
    const onCommunityPage = pathname.startsWith("/dashboard/support");

    if (onCommunityPage) {
      localStorage.setItem(FORUM_LAST_SEEN_KEY, new Date().toISOString());
      setCommunityUnread(0);
      return;
    }

    const lastSeen = localStorage.getItem(FORUM_LAST_SEEN_KEY);
    // First ever view: treat "now" as the baseline so we don't show a huge
    // backlog count to new users. Any post after this point counts as unread.
    if (!lastSeen) {
      localStorage.setItem(FORUM_LAST_SEEN_KEY, new Date().toISOString());
      setCommunityUnread(0);
      return;
    }

    (async () => {
      const supabase = createClient();
      const { count, error } = await supabase
        .from("forum_posts")
        .select("*", { count: "exact", head: true })
        .gt("created_at", lastSeen);
      if (!cancelled && !error && typeof count === "number") {
        setCommunityUnread(count);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-muted/30 md:flex">
      {/* Logo */}
      <div className="border-b border-border/60 px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-md bg-foreground">
            <span className="text-sm font-bold text-background">OA</span>
          </div>
          <span className="font-heading text-[13px] font-semibold leading-[1.15] tracking-tight">
            Orchestrator Academy
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {sidebarLinks.map((link) => {
          const active = isActive(link.href, link.exact);
          const unread = link.trackKey === "community" ? communityUnread : 0;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <link.icon className="size-4" />
              <span className="flex-1">{link.label}</span>
              {unread > 0 && (
                <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-emerald-accent px-1.5 text-[11px] font-semibold leading-5 text-emerald-accent-foreground">
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            href="/dashboard/admin"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/dashboard/admin")
                ? "bg-amber-500/10 text-amber-500"
                : "text-amber-500 hover:bg-muted hover:text-amber-400"
            }`}
          >
            <Shield className="size-4" />
            Admin
          </Link>
        )}
      </nav>

      {/* Recent News */}
      {latestPost && !newsDismissed && (
        <div className="mx-3 mb-2 rounded-lg border border-border/60 bg-background p-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Newspaper className="size-3" />
              Recent News
            </span>
            <button
              onClick={() => {
                setNewsDismissed(true);
                if (latestPost) localStorage.setItem(`news-dismissed-${latestPost.slug}`, "1");
              }}
              className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </div>
          <Link
            href={`/blog/${latestPost.slug}`}
            className="group block"
          >
            <p className="line-clamp-2 text-sm font-medium leading-snug transition-colors group-hover:text-emerald-accent">
              {latestPost.title}
            </p>
            {latestPost.excerpt && (
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {latestPost.excerpt}
              </p>
            )}
          </Link>
        </div>
      )}

      {/* Book a call + Buy us a coffee */}
      <div className="mx-3 mb-2 space-y-2">
        <BookCallButton variant="card" />
        <BuyMeCoffeeButton variant="card" />
      </div>

      {/* User section */}
      <div className="relative border-t border-border/60 p-3" ref={menuRef}>
        {/* Popover menu */}
        {menuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 overflow-hidden rounded-lg border border-border bg-background shadow-lg">
            <Link
              href="/dashboard/profile"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <User className="size-4" />
              Profile
            </Link>
            <Link
              href="/dashboard/api-token"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Key className="size-4" />
              API Token
            </Link>
            {mounted && (
              <button
                onClick={toggleTheme}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                {dark ? "Light Mode" : "Dark Mode"}
              </button>
            )}
            <div className="border-t border-border" />
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-muted"
            >
              <LogOut className="size-4" />
              Sign Out
            </button>
          </div>
        )}

        {/* User button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted"
        >
          <Avatar className="size-8">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.fullName || user.email} />}
            <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-sm font-medium">
              {user.fullName || user.email}
            </p>
            {user.fullName && (
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            )}
          </div>
          <ChevronUp className={`size-4 text-muted-foreground transition-transform ${menuOpen ? "" : "rotate-180"}`} />
        </button>
      </div>
    </aside>
  );
}

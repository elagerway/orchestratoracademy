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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/app/auth/actions";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/achievements", label: "Achievements", icon: Trophy },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/api-token", label: "API Token", icon: Key },
];

interface DashboardSidebarProps {
  isAdmin: boolean;
  user: {
    email: string;
    fullName: string;
    avatarUrl: string | null;
    initials: string;
  };
}

export function DashboardSidebar({ isAdmin, user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

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
              {link.label}
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

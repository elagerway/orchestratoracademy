"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { LogOut, Sun, Moon, User, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/app/auth/actions";

interface LessonSidebarUserProps {
  user: {
    email: string;
    fullName: string;
    avatarUrl: string | null;
    initials: string;
  };
}

export function LessonSidebarUser({ user }: LessonSidebarUserProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

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

  return (
    <div className="relative border-t border-border/60 p-3" ref={menuRef}>
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
  );
}

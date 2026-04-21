import * as dotenv from "dotenv";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const ADMIN_USER_ID = "386c403d-cf7e-4e99-8b91-56da3d72a860"; // Erik
const ANNOUNCEMENTS_CATEGORY_ID = "771a903d-9f65-4aeb-acb2-7b9309469513";

type Announcement = {
  forumTitle: string;
  forumBody: string;
  blogTitle: string;
  blogSlug: string;
  blogExcerpt: string;
  blogContent: string;
  metaDescription: string;
  tags: string[];
};

const ANNOUNCEMENTS: Announcement[] = [
  {
    forumTitle: "Every Superpowers lesson now has a video",
    forumBody: `Just shipped: every lesson in the **Claude Code Superpowers** course now has its own video walkthrough. 16 out of 16 lessons.

Previously only the first lesson of each module had video; the deep-dive second lessons were text-only. Now both L1 and L2 have Leo on camera walking through the concepts with working code on screen.

If you're working through Superpowers, head back to any module — the L2 lessons you already passed have brand new videos waiting.

- Course: [Claude Code Superpowers](/courses/claude-code-superpowers)`,
    blogTitle: "Every lesson in Claude Code Superpowers now has a video",
    blogSlug: "superpowers-every-lesson-has-video",
    blogExcerpt: "All 16 lessons in the Claude Code Superpowers course now include a video walkthrough — no more text-only deep-dives.",
    blogContent: `# Every lesson in Claude Code Superpowers now has a video

If you've been working through the Claude Code Superpowers course, you might have noticed something: the first lesson of each module had a video, but the second lesson — the deep-dive — was text-only. That's been fixed.

## What changed

Every L2 lesson in Superpowers now has its own video walkthrough. Leo walks through the hands-on material on camera with working code on screen. That's 8 new videos, one per module, covering:

- Installing the Superpowers stack
- Advanced Context7 rules and CLAUDE.md auto-triggers
- Debugging, performance traces, and Lighthouse audits with Chrome DevTools MCP
- Apply, verify, and archive the full OpenSpec cycle
- Git worktrees, code review, and the Superpowers finishing stage
- Parallel agents and multi-hour autonomous sessions
- The full Superpower toolkit reference — what to use when
- A complete tools reference for Context7 and Chrome DevTools MCP

## Why it matters

The text versions were solid, but watching someone run the commands and narrate what's happening makes these concepts click faster — especially the workflow lessons where sequencing and timing matter.

If you're already enrolled, jump into any module you've completed — the L2 lessons you read through have fresh videos waiting. If you're new to Superpowers, [start the course](/courses/claude-code-superpowers).

## How it was made

Behind the scenes, these videos were produced with the same automated pipeline we use for the rest of the course — ElevenLabs for voice, HeyGen for the avatar, Remotion for the code-screen animations, ffmpeg for stitching. Running 8 pipelines in parallel with proper retry logic turned what would have been a weeklong production into an afternoon.`,
    metaDescription: "All 16 Superpowers lessons now include a video walkthrough, not just the first lesson of each module.",
    tags: ["superpowers", "courses", "product-update"],
  },
  {
    forumTitle: "Supercharging Context & Memory is now free",
    forumBody: `Heads up: **Supercharging Context & Memory** is now free for all members.

This course covers exactly what its name says — how to manage context windows, persistent memory across sessions, and long-running agent state. It used to be $29; now it's included in the free tier.

If you're serious about building agents that don't "forget" halfway through a task, this is the course to do next after Foundations.

- Course: [Supercharging Context & Memory](/courses/supercharging-context-memory)`,
    blogTitle: "Supercharging Context & Memory is now free for all members",
    blogSlug: "supercharging-context-memory-now-free",
    blogExcerpt: "Our Supercharging Context & Memory course just dropped its paywall — it's free for all members.",
    blogContent: `# Supercharging Context & Memory is now free for all members

We've removed the paywall on **Supercharging Context & Memory**. What used to be a $29 advanced course is now included in the free tier alongside AI Orchestrator Foundations.

## Why it's worth your time

Context and memory are the two things every orchestrator runs into once they move past simple prompts. Agents forget. Context windows fill up. Long-running tasks lose their place. This course is specifically about solving that:

- How context windows actually work and where the limits hurt
- When to use short-term memory, long-term memory, and persistent state
- Retrieval patterns that keep agents grounded over multi-hour sessions
- Practical Claude Code and Anthropic SDK examples you can run today

## Who should take it

If you've finished [AI Orchestrator Foundations](/courses/ai-orchestration-foundations) and want the next practical step, this is it. It's the shortest path from "I can run an AI workflow" to "I can build an agent that doesn't lose track of what it was doing an hour ago".

Head to [Supercharging Context & Memory](/courses/supercharging-context-memory) and get started — no checkout, no trial.`,
    metaDescription: "Supercharging Context & Memory, previously $29, is now free for all AI Orchestrator Academy members.",
    tags: ["courses", "free-course", "product-update"],
  },
];

async function run() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const results: { forumUrl: string; blogUrl: string; title: string }[] = [];

  for (const a of ANNOUNCEMENTS) {
    // 1. Forum post
    const { data: forum, error: forumErr } = await sb
      .from("forum_posts")
      .insert({
        category_id: ANNOUNCEMENTS_CATEGORY_ID,
        user_id: ADMIN_USER_ID,
        title: a.forumTitle,
        body: a.forumBody,
      })
      .select("id")
      .single();
    if (forumErr) throw new Error(`Forum insert (${a.forumTitle}): ${forumErr.message}`);
    console.log(`  ✓ forum: ${a.forumTitle} — id ${forum.id}`);

    // 2. Blog post
    const now = new Date().toISOString();
    const { data: blog, error: blogErr } = await sb
      .from("blog_posts")
      .insert({
        title: a.blogTitle,
        slug: a.blogSlug,
        excerpt: a.blogExcerpt,
        content: a.blogContent,
        meta_description: a.metaDescription,
        tags: a.tags,
        author_name: "Orchestrator Academy",
        author_id: ADMIN_USER_ID,
        status: "published",
        published: true,
        published_at: now,
      })
      .select("id,slug")
      .single();
    if (blogErr) throw new Error(`Blog insert (${a.blogTitle}): ${blogErr.message}`);
    console.log(`  ✓ blog:  ${a.blogTitle} — /blog/${blog.slug}`);

    results.push({
      forumUrl: `/dashboard/support?post=${forum.id}`,
      blogUrl: `/blog/${blog.slug}`,
      title: a.forumTitle,
    });
  }

  console.log("\n=== Published ===");
  for (const r of results) {
    console.log(`${r.title}`);
    console.log(`  forum: https://www.orchestratoracademy.com${r.forumUrl}`);
    console.log(`  blog:  https://www.orchestratoracademy.com${r.blogUrl}`);
  }
}

run().catch((e) => { console.error(e); process.exit(1); });

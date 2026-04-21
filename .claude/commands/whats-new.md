---
description: Publish a What's New announcement for shipped features / new courses (blog post + community Announcements post + optional tweet)
---

# /whats-new — publish a What's New

Use this when we ship a new feature, fix, or open a new course and want the user-facing audience to know about it.

## Inputs

Gather context from:
- The most recent `git push` output and the commit range that just shipped (e.g. `ceb0750..b7f708b`)
- The diffs in those commits (`git log --format=%B commit_range`) for the "what" and the "why"
- Any visible UI change — grab the real user benefit, not the implementation detail

If the user provided a short context string after `/whats-new`, treat that as the headline hint.

## Outputs — both must be published

### 1. Community Announcements forum post (short, conversational)

- **Category:** Announcements (slug `announcements`, id `771a903d-9f65-4aeb-acb2-7b9309469513`)
- **Author:** an admin user (e.g. `erik@snapsonic.com` — resolve via `profiles.role = 'admin'`)
- **Title:** punchy, user-benefit-focused, no version numbers, under 70 chars
- **Body:** 2–4 short paragraphs, Markdown. Lead with what changed in one sentence. Then why it matters for students. Link to the feature with a relative `/dashboard/...` path when relevant. Close with one-line next step or CTA.

Insert via:

```ts
await supabase.from("forum_posts").insert({
  category_id: "771a903d-9f65-4aeb-acb2-7b9309469513",
  user_id: <admin user_id from profiles>,
  title,
  body,
});
```

### 2. Blog post (longer, SEO-friendly)

- POST to `/api/admin/blog` (requires admin session). If calling from a script, use the Supabase service role key and insert directly into `blog_posts`.
- **title**, **slug** (kebab-case from title), **excerpt** (1 sentence), **content** (Markdown, 2–5 paragraphs), **featured_image_url**, `published: true`, `published_at: now`, `author_name: "Orchestrator Academy"`
- **Featured image:** photo realistic, hyper realistic, focused on the VALUE the feature delivers to the user (not the device / screen). Generate via `gpt-image-1` or the shared image pipeline. Save to Supabase Storage under `assets/blog-images/{slug}.png` and set the public URL as `featured_image_url`.

### 3. (Optional) Tweet

If the user explicitly asks, also post a tweet using the X client setup (`VIMEO_ACCESS_TOKEN`-style creds in `.env.local`, see `video-pipeline/scripts/x-auth.mjs` pattern). One sentence + link to the blog post. Default: **do not tweet** unless asked.

## Drip campaign — automatic

The daily drip cron at `/api/cron/drip-campaign` pulls the latest 3 Announcements forum posts and surfaces them as a **"What's new at the Academy"** block in every day3 / day7 / day14 email. You don't need to do anything extra — the moment the forum post lands, the next cron run includes it.

## Required calls at the end

1. Print all three URLs (forum post, blog post, tweet) so the user can verify.
2. Do **not** commit or push code from this command — the announcement lives in the database only.

## Style rules (shared with both posts)

- No emoji unless the user asked for them elsewhere
- No hype words like "revolutionary", "game-changing", "insane"
- Lead with the user benefit, not the implementation
- When referencing features, link to the concrete page (`/courses/...`, `/dashboard/community`, etc.)
- Match the site's brand name: **AI Orchestrator Academy** (not "Orchestration Academy")

## What NOT to use this command for

- Internal dev notes (pipeline refactors, infra fixes users won't see)
- Routine bug fixes that don't affect the student experience
- Silent backend work

If the user runs `/whats-new` for a non-user-facing change, push back once before proceeding.

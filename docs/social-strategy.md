# Social & Content Strategy

## Publishing Schedule

### Batch 1: April 13–22, 2026

| Date | Time (PDT) | Blog Post | YouTube Video | YouTube Short | Status |
|------|-----------|-----------|---------------|---------------|--------|
| Apr 13 | 3:00 PM | Karpathy's 20-80 Flip | `KjL25YC8_Os` | `iUEqPbE2oWg` | Scheduled |
| Apr 16 | 3:00 PM | Claude Mythos: Too Powerful | `Nz88Jo8fnMU` | `MxlHewVOf4E` | Scheduled |
| Apr 19 | 3:00 PM | OpenClaw: 247K Stars | `6KvfIVmMZhU` | `EsKy_l5vAMY` | Scheduled |
| Apr 22 | 3:00 PM | Agentic Coding Report | `J9Q9xF-O0_U` | `jbbfDgCp5bE` | Scheduled |

### File Locations

| Video | Final (16:9) | Short (9:16) | Thumbnail | Blog Slug |
|-------|-------------|-------------|-----------|-----------|
| Karpathy | `video-pipeline/output/News/karpathy-20-80/final.mp4` | `video-pipeline/output/News/karpathy-20-80/short.mp4` | `video-pipeline/output/News/karpathy-20-80/thumbnail.png` | `karpathy-20-80-flip-developers-write-less-code` |
| Mythos | `video-pipeline/output/News/mythos/final.mp4` | `video-pipeline/output/News/mythos/short.mp4` | `video-pipeline/output/News/mythos/thumbnail.png` | `claude-mythos-too-powerful-to-release` |
| OpenClaw | `video-pipeline/output/News/openclaw/final.mp4` | `video-pipeline/output/News/openclaw/short.mp4` | `video-pipeline/output/News/openclaw/thumbnail.png` | `openclaw-247k-star-ai-agent-broke-github` |
| Agentic | `video-pipeline/output/News/agentic-coding/final.mp4` | `video-pipeline/output/News/agentic-coding/short.mp4` | `video-pipeline/output/News/agentic-coding/thumbnail.png` | `anthropic-orchestration-core-engineering-skill-2026` |

## Go-Live Process (per post)

When a blog post's `scheduled_at` time arrives:

1. **Blog auto-publishes** — the `/api/cron/publish-scheduled` Vercel cron runs hourly and sets `status: published` + `published: true`
2. **YouTube videos go public** — the `/api/cron/publish-scheduled` route also sets the corresponding YouTube videos to public (regular + Short)
3. **Cross-post** — manually share on LinkedIn and X via admin Blog tab share buttons

## YouTube Video IDs

```
# Regular videos (unlisted → public on publish date)
KjL25YC8_Os  Karpathy's 20-80 Flip
Nz88Jo8fnMU  Claude Mythos: Too Powerful to Release
6KvfIVmMZhU  OpenClaw: 247K GitHub Stars in 60 Days
J9Q9xF-O0_U  Anthropic Says Orchestration Is the Core Engineering Skill

# Shorts (unlisted → public on publish date)
iUEqPbE2oWg  Karpathy Short
MxlHewVOf4E  Mythos Short
EsKy_l5vAMY  OpenClaw Short
jbbfDgCp5bE  Agentic Coding Short
```

## Content Cadence

- **News videos:** Every 3 days (2 per week)
- **Format:** Daily Dose of AI — tweet analysis with Leo
- **Both formats:** 16:9 (blog embed) + 9:16 (YouTube Short)
- **Blog + video publish together** — never one without the other
- **Cross-post to LinkedIn + X** on publish day

## Recurring Production Schedule

Every 2 weeks, produce a new batch of videos:
1. Research 4-6 trending AI topics
2. Produce all videos (scripts → audio → HeyGen → stitch → Shorts)
3. Create blog posts with embedded videos
4. Schedule 3 days apart
5. Set YouTube videos to go public at scheduled times

## SEO/GEO Strategy

### Target Keywords
- AI orchestration
- AI agent workflow
- Multi-agent systems
- Claude Code
- MCP protocol
- Vibe coding
- Agentic engineering
- AI career
- Prompt engineering
- AI security

### Content Types
1. **News analysis** (Daily Dose of AI) — tweet-based, current events
2. **Tutorials** — course content repurposed as blog posts
3. **Deep dives** — longer articles on specific topics
4. **Case studies** — real-world AI orchestration examples

### Distribution Channels
- **YouTube** — regular videos + Shorts
- **Blog** — orchestratoracademy.com/blog
- **LinkedIn** — cross-post blog articles
- **X/Twitter** — cross-post with tweet embeds
- **Email** — drip campaign to dormant users (Postmark, daily at 2pm UTC)

### Metrics to Track
- YouTube views, subscribers, watch time
- Blog page views, time on page
- Course enrollments (from blog CTA links)
- Email open rates (drip campaign)
- Social shares (LinkedIn, X)

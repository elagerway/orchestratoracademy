# News Video Pipeline

Repeatable process for producing "Daily Dose of AI" news videos for Orchestrator Academy YouTube channel.

## Prerequisites

All API keys are in `.env.local` at the project root:
- `ELEVENLABS_API_KEY` + `ELEVENLABS_VOICE_ID` (WQcQveC0hbQNvI69FWyU)
- `HEYGEN_API_KEY` (starts with `sk_V2_`)
- `HEYGEN_AVATAR_ID` (Silas_expressive_2024120201)
- `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- `YOUTUBE_CLIENT_ID` + `YOUTUBE_CLIENT_SECRET`

**Shared asset paths (already exist, do not regenerate):**
- Typing opener: `video-pipeline/output/News/karpathy-20-80/normalized_v2/opener.mp4`
- OA icon overlay: `video-pipeline/output/News/karpathy-20-80/normalized/oa-icon-dark.png`
- End card image: `video-pipeline/output/News/karpathy-20-80/endcard.png`
- Dark background for HeyGen: `https://oxsiajjnbnedimblidrs.supabase.co/storage/v1/object/public/assets/news-audio/dark-bg.png`
- Leo frame for thumbnails: `video-pipeline/output/News/karpathy-20-80/leo-frame.png`

## Overview

Each video covers a trending AI topic (tweet, article, announcement) with Leo narrating over highlighted source material. Videos are ~90-120 seconds. Published to YouTube with thumbnail, description, and companion blog post.

## Video Structure

```
1. Typing Opener (3-4s)
   - Green monospace text on dark bg: "> this is your daily dose of AI"
   - ElevenLabs voiceover synced to typing animation
   - Hold completed text 1s
   - Flicker effect (on/off pattern) + modem glitch sound (0.4s)

2. Leo Intro (8-14s)
   - Dark solid background (#1a1a1a), OA icon (200px) top-right
   - Sets up who/what: who is this person, why should you care, what happened
   - No filler, straight to the story

3. Tweet/Source Sections (variable, 15-30s each)
   - White tweet card on dark (#1a1a1a) background
   - Tweet card: 900px wide, 40px padding, 24px text, rounded corners, drop shadow
   - Rendered at 1920x1080 natively (no scaling)
   - Progressive yellow highlights synced to narration
   - Each highlight appears exactly when narrator quotes that text
   - Highlights accumulate — they don't reset between quotes
   - If narrator makes commentary (not quoting), no new highlight needed

4. Leo Analysis (optional, 8-14s)
   - Dark background, OA icon top-right
   - Leo delivers the "what this means" takeaway on camera
   - Used when the analysis isn't a direct tweet quote

5. Leo Outro + Subscribe CTA (8-12s)
   - Dark background, OA icon top-right
   - Leo says: "This is the new world, this is AI orchestration."
   - Then: "Subscribe and hit the bell for your daily dose of AI."
   - Subscribe button + bell animation overlay on screen during CTA
   - MUST be a statement, never a question
   - Natural/conversational voice (stability: 0.45, style: 0.5)

6. End Screen (5-8s)
   - Leo holds on screen 1s after finishing talking
   - Gentle 1.5s fade to black
   - OA logo (white, 200x200, rounded) fades in centered on #1a1a1a
   - Hold 2s
```

## File Structure

```
video-pipeline/output/News/<topic-slug>/
├── assets_v2/
│   ├── leo-intro.txt                # Leo intro script
│   ├── leo-intro.mp3                # ElevenLabs audio
│   ├── leo-intro-padded.mp3         # +1s silence at start (for HeyGen)
│   ├── leo-intro-padded_video_id.txt # HeyGen video ID
│   ├── vo-section1.txt              # Voiceover section 1 script
│   ├── vo-section1.mp3              # ElevenLabs audio
│   ├── vo-section2.txt              # Voiceover section 2 script
│   ├── vo-section2.mp3
│   ├── vo-section3.txt              # (optional) Leo analysis script
│   ├── vo-section3.mp3
│   ├── leo-outro.txt                # Leo outro script
│   ├── leo-outro.mp3
│   └── leo-outro-padded_video_id.txt
├── screenshots/
│   ├── tweet-none.png               # Unhighlighted tweet (full, single image)
│   ├── tweet-s1a.png                # Section 1, highlight phase A
│   ├── tweet-s1b.png                # Section 1, highlight phase B (accumulates)
│   ├── tweet-s2a.png                # Section 2, highlight phase A
│   └── ...
├── tweet-config.json                # Base tweet config (full text, stats)
├── tweet-config-none.json           # No highlights
├── tweet-config-s1a.json            # Section-specific highlight configs
├── normalized_v2/
│   ├── opener.mp4                   # Reused from shared/karpathy
│   ├── leo-intro-padded.mp4         # With OA icon overlay
│   ├── tweet-s1.mp4                 # Tweet section with timed highlights
│   ├── tweet-s2.mp4
│   ├── vo-section3.mp4              # Leo analysis (optional, with OA icon)
│   ├── leo-outro-fade.mp4           # With fade out
│   ├── endcard.mp4                  # OA logo fade in
│   └── concat.txt                   # Final concat order
├── thumbnail.png                    # YouTube thumbnail (1280x720)
└── final.mp4                        # Final output
```

## Shared Assets (reusable across all videos)

```
video-pipeline/output/News/shared/
├── daily-dose.mp3                   # "This is your daily dose of AI" voiceover
└── dark-bg.png                      # Solid #1a1a1a background for HeyGen

video-pipeline/output/News/karpathy-20-80/
├── normalized_v2/opener.mp4         # Typing opener (copy to each new video)
├── normalized/oa-icon-dark.png      # OA icon overlay for Leo segments
└── endcard.png                      # OA logo centered on dark bg
```

## Step-by-Step Process

### 1. Research & Select Topic

Find trending AI content via web search. Look for:
- Tweets with high engagement (10K+ likes) from key accounts
- Breaking news about models, frameworks, tools, security
- Key accounts: @karpathy, @AnthropicAI, @OpenAI, @GoogleAI, @kevinroose, @CNBC
- Topics: agentic engineering, MCP, A2A, vibe coding, AI security, new model releases

### 2. Create Tweet Config

Create `tweet-config.json` with the FULL tweet text and real engagement stats:

```json
{
  "name": "Andrej Karpathy",
  "handle": "@karpathy",
  "avatar": "",
  "verified": true,
  "date": "10:50 AM · Feb 25, 2026",
  "text": "Full tweet text here — copy the ENTIRE tweet, not a summary...",
  "highlights": [],
  "likes": "37.1K",
  "replies": "1.6K",
  "reposts": "8.2K",
  "views": "4.1M"
}
```

**Multiple tweets per video:** Create separate config files (e.g., `tweet-config-anthropic.json`) for each source tweet.

### 3. Write Scripts — Tweet First

Read the tweet top to bottom. Write narration that follows the tweet order.

**Script files:**
- `leo-intro.txt` — Who is this person, why should you care, what happened
- `vo-section1.txt` — Narration over first tweet (quotes exact text)
- `vo-section2.txt` — Narration over second tweet or second part
- `vo-section3.txt` — (optional) Leo analysis / what this means
- `leo-outro.txt` — Standard outro (two sentences, same every video):
    "This is the new world, this is AI orchestration. Subscribe and hit the bell for your daily dose of AI."

**Rules:**
- When quoting the tweet, use the EXACT words from the tweet
- Each voiceover section covers one natural section of the tweet
- Identify which phrases to highlight — only highlight text being directly quoted
- If narrator is making a comment (not quoting), no highlight needed
- No filler phrases: no "watch this", "check this out", "let's get into it"
- Leo outro is always a statement, never a question
- Use commas instead of periods between sentences (prevents ElevenLabs silence gaps)

**Pronunciation:**
- Uppercase terms get misread by ElevenLabs (GET → "geet"). Use lowercase.
- "Mythos" → spell as "Mithose" in scripts
- Test audio before sending to HeyGen — listen to the full concatenated audio

### 4. Generate Audio — ElevenLabs

```bash
VOICE_ID="WQcQveC0hbQNvI69FWyU"
API_KEY="${ELEVENLABS_API_KEY}"

curl -X POST "https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}" \
  -H "xi-api-key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -H "Accept: audio/mpeg" \
  -d '{"text": "...", "model_id": "eleven_turbo_v2_5", "voice_settings": {"stability": 0.6, "similarity_boost": 0.8, "style": 0.3, "use_speaker_boost": true}}' \
  -o section.mp3
```

**Voice settings:**
| Segment | Stability | Similarity | Style |
|---------|-----------|------------|-------|
| Narration / voiceovers | 0.6 | 0.8 | 0.3 |
| Leo outro (conversational) | 0.45 | 0.75 | 0.5 |

**Silence gap check** — any gap >1.0s means replace the period before it with a comma:
```bash
ffmpeg -i section.mp3 -af silencedetect=noise=-30dB:d=0.8 -f null - 2>&1 | grep silence_duration
```

**Pad Leo segments** with 1s silence (so mouth starts closed in HeyGen):
```bash
ffmpeg -y -f lavfi -t 1 -i anullsrc=r=44100 -i leo.mp3 \
  -filter_complex "[0:a][1:a]concat=n=2:v=0:a=1" leo-padded.mp3
```

### 5. Calculate Highlight Timing

For each voiceover section, calculate the exact second each highlighted phrase is spoken:

```python
text = "full narration script..."
duration = 21.9  # from ffprobe
words_per_sec = len(text.split()) / duration

target = "phrase to highlight"
words_before = len(text.split(target)[0].split())
time_at_target = words_before / words_per_sec
```

This gives you the cut point for each progressive highlight phase.

### 6. Generate Tweet Cards

Create progressive highlight configs — highlights accumulate across phases:

```
tweet-config-none.json  → highlights: []
tweet-config-s1a.json   → highlights: ["first phrase"]
tweet-config-s1b.json   → highlights: ["first phrase", "second phrase"]
```

Render all variants:
```bash
node video-pipeline/scripts/tweet-card.mjs --config tweet-config-s1a.json --output screenshots/tweet-s1a.png
```

**Tweet card specs:**
- 1920x1080 output, rendered natively (deviceScaleFactor: 1)
- Dark (#1a1a1a) background, white tweet card (900px, 40px padding, 20px border-radius)
- Yellow (#fef08a) highlights on quoted text
- Real X/Twitter styling: avatar, verified badge, handle, date, engagement stats
- Drop shadow for depth against dark bg

### 7. Generate Leo Segments — HeyGen

Upload padded audio to Supabase storage (public URL), then submit to HeyGen:

```bash
# Upload audio to Supabase
curl -X POST "${SB_URL}/storage/v1/object/assets/news-audio/${filename}.mp3" \
  -H "Authorization: Bearer ${SB_KEY}" \
  -H "Content-Type: audio/mpeg" \
  --data-binary "@audio.mp3"

# Submit to HeyGen
curl -X POST "https://api.heygen.com/v2/video/generate" \
  -H "X-Api-Key: ${HEYGEN_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "video_inputs": [{
      "character": {"type": "avatar", "avatar_id": "Silas_expressive_2024120201", "avatar_style": "normal"},
      "voice": {"type": "audio", "audio_url": "https://...public-url.mp3"},
      "background": {"type": "image", "url": "https://...dark-bg.png"}
    }],
    "dimension": {"width": 1920, "height": 1080}
  }'
```

**Always use dark-bg.png** (#1a1a1a solid) for all Leo segments.

**Background URL:** `https://oxsiajjnbnedimblidrs.supabase.co/storage/v1/object/public/assets/news-audio/dark-bg.png`

**Poll for completion** — HeyGen takes 2-5 minutes per segment:
```bash
curl -s "https://api.heygen.com/v1/video_status.get?video_id=${VIDEO_ID}" \
  -H "X-Api-Key: ${HEYGEN_KEY}"
# Response: {"data": {"status": "processing|completed", "video_url": "https://..."}}
# Poll every 15-20 seconds until status is "completed", then download video_url
```

**After downloading, add OA icon overlay** (200x200, top-right):
```bash
ffmpeg -y -i leo.mp4 -i oa-icon-dark.png \
  -filter_complex "[0:v]scale=1920:1080[base];[1:v]scale=200:200[icon];[base][icon]overlay=W-240:40[vout]" \
  -map "[vout]" -map 0:a \
  -c:v libx264 -preset medium -crf 18 -r 25 -pix_fmt yuv420p \
  -c:a aac -ar 44100 -ac 2 leo-with-icon.mp4
```

### 8. Build Typing Opener

Reuse the shared opener from the first video:
```bash
cp video-pipeline/output/News/karpathy-20-80/normalized_v2/opener.mp4 normalized_v2/opener.mp4
```

If regenerating, the opener has 3 parts:
1. **Typing animation** — Puppeteer renders green (#34d399) monospace text, character by character, on #0a0a0a background. Uses `page.evaluate()` to update text per frame (avoids jitter from re-loading HTML).
2. **Hold** — Last frame held for 1s with silence
3. **Flicker + modem** — 10 frames with on/off pattern, modem sound (sine wave chain, 0.4s)

### 9. Build Tweet Sections

For each voiceover section, assemble video with progressive highlight phases at calculated timestamps:

```bash
ffmpeg -y \
  -loop 1 -i tweet-none.png \
  -loop 1 -i tweet-s1a.png \
  -loop 1 -i tweet-s1b.png \
  -i voiceover.mp3 \
  -filter_complex "\
    [0:v]trim=duration=${T_A},setpts=PTS-STARTPTS[v0];\
    [1:v]trim=duration=${T_B_minus_A},setpts=PTS-STARTPTS[v1];\
    [2:v]trim=duration=${REMAINING},setpts=PTS-STARTPTS[v2];\
    [v0][v1][v2]concat=n=3:v=1:a=0[vout]" \
  -map "[vout]" -map 3:a \
  -c:v libx264 -preset medium -crf 18 -r 25 -pix_fmt yuv420p \
  -c:a aac -ar 44100 -ac 2 -t ${EXACT_AUDIO_DURATION} \
  tweet-section.mp4
```

**CRITICAL:** Use `-t ${EXACT_AUDIO_DURATION}` to match video exactly to audio. Mismatch causes audio dropout on YouTube.

**Tweet images are already 1920x1080** — no scaling needed. Do NOT use `scale=` or `pad=` on them.

### 10. Build Leo Outro with Fade to End Card

```bash
OUTRO_DUR=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 leo-outro.mp4)
FADE_START=$(python3 -c "print(float('${OUTRO_DUR}')+1)")
PAD_DUR=$(python3 -c "print(float('${OUTRO_DUR}')+2.5)")

# Hold Leo 1s after talking, fade out 1.5s
ffmpeg -y -i leo-outro.mp4 \
  -vf "tpad=stop_mode=clone:stop_duration=1,fade=t=out:st=${FADE_START}:d=1.5" \
  -af "apad=whole_dur=${PAD_DUR}" \
  -c:v libx264 -preset medium -crf 18 -r 25 -pix_fmt yuv420p \
  -c:a aac -ar 44100 -ac 2 leo-outro-fade.mp4

# End card: OA logo fades in
ffmpeg -y -loop 1 -i endcard.png -f lavfi -t 2 -i "anullsrc=r=44100:cl=stereo" \
  -vf "scale=1920:1080,fade=t=in:d=0.5" \
  -c:v libx264 -preset medium -crf 18 -r 25 -pix_fmt yuv420p \
  -c:a aac -ar 44100 -ac 2 -t 2 endcard.mp4
```

### 11. Normalize & Stitch

All segments must have identical format:
- **Video:** libx264, 1920x1080, 25fps, yuv420p, crf 18
- **Audio:** aac, 44100 Hz, stereo

```bash
# Always re-encode on concat — never use -c copy (causes audio dropout)
ffmpeg -y -f concat -safe 0 -i concat.txt \
  -c:v libx264 -preset medium -crf 18 -r 25 -pix_fmt yuv420p \
  -c:a aac -ar 44100 -ac 2 \
  final.mp4
```

### 12. Generate Thumbnail

Leo on the left, big bold text on the right. 1280x720.

- Leo's face extracted from a HeyGen video frame (`ffmpeg -ss 2 -vframes 1`)
- Leo occupies the left ~40% of frame, slightly cropped
- Text is right-aligned, 86-90px Inter Black
- Key number/word in accent color (yellow, red, green)
- Text must NOT overlap Leo's shoulders or body
- OA icon badge (50x50) in top-right corner
- Dark background (#0f0f0f)
- Max 4-5 words total — no sentences

### 13. Upload to YouTube (UNLISTED)

**Always upload as unlisted.** Videos go public only when the companion blog post is published.

```bash
node video-pipeline/scripts/youtube-upload.mjs \
  --file final.mp4 \
  --title "Video Title" \
  --description "Description" \
  --tags ai,topic,tags
```

Default privacy is `unlisted`. Only use `--privacy public` when deliberately publishing.

**Description format:**
```
One-line summary of what happened.

In this episode:
- Bullet point 1
- Bullet point 2
- Bullet point 3

This is your daily dose of AI from Orchestrator Academy.

Learn AI orchestration for free: https://orchestratoracademy.com
Source: https://x.com/...
```

**Thumbnail upload** (separate step, may be rate-limited):
```javascript
youtube.thumbnails.set({ videoId, media: { body: createReadStream('thumbnail.png') } })
```

YouTube rate-limits thumbnail uploads — if blocked, wait 30-60 minutes or upload manually from YouTube Studio.

### 14. Add End Screen Cards

In YouTube Studio, add end screen elements to the last 5-8 seconds of the video:
- **Subscribe button** — positioned bottom-left
- **Best for viewer** video card — positioned top-right
- **Recent upload** video card — positioned bottom-right

This must be done manually in YouTube Studio after upload — the API doesn't support end screen creation.

### 15. Create Blog Post

Create the companion blog post. Can be done via admin UI or direct database insert.

**Blog post structure:**

```html
<!-- 1. YouTube video embed at the top -->
<iframe width="100%" height="400" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>

<!-- 2. "What Happened" section — context -->
<h2>What Happened</h2>
<p>One paragraph explaining who/what/why.</p>

<!-- 3. Embedded source tweet(s) -->
<blockquote class="twitter-tweet">...</blockquote>

<!-- 4. Analysis sections with H2/H3 headings -->
<h2>Section Title</h2>
<p>Key points, stats, quotes...</p>
<ul><li>Bullet points for scanability</li></ul>

<!-- 5. "What This Means for You" — always end with this -->
<h2>What This Means for You</h2>
<p>Takeaway + CTA link to courses</p>
<p><a href="https://orchestratoracademy.com/courses">Start the free course →</a></p>
```

**Content is HTML** (not markdown). Use the `</>` source toggle in the WYSIWYG editor to paste/edit raw HTML, or insert directly via the Supabase REST API:

```bash
curl -X POST "${SB_URL}/rest/v1/blog_posts" \
  -H "apikey: ${SB_KEY}" -H "Authorization: Bearer ${SB_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"title": "...", "slug": "...", "content": "<iframe ...>...</iframe><h2>...</h2>...",
       "excerpt": "...", "meta_description": "...", "tags": ["ai", "topic"],
       "author_name": "Orchestrator Academy", "status": "draft", "published": false,
       "featured_image_url": "https://oxsiajjnbnedimblidrs.supabase.co/storage/v1/object/public/assets/blog/SLUG.png"}'
```

**SEO fields:**
- **Title:** Match the YouTube video title
- **Slug:** kebab-case, include primary keyword
- **Meta description:** Under 300 chars, include key stat or claim
- **Tags:** 6-8 keyword tags (lowercase, hyphenated)
- **Author:** "Orchestrator Academy"
- **Excerpt:** 1-2 sentences for blog listing cards

**Featured image:**
- Upload the video thumbnail to Supabase Storage:
```bash
curl -X POST "${SB_URL}/storage/v1/object/assets/blog/${SLUG}.png" \
  -H "Authorization: Bearer ${SB_KEY}" -H "Content-Type: image/png" \
  --data-binary "@thumbnail.png"
```
- Set `featured_image_url` to `${SB_URL}/storage/v1/object/public/assets/blog/${SLUG}.png` on the blog post
- **Featured image auto-hides on posts with YouTube embeds** — the video is the visual, no need for a duplicate thumbnail
- Featured image still shows on the `/blog` listing page as the card image

**Blog post rendering:**
- Content renders via `dangerouslySetInnerHTML` with Tailwind `prose` classes (`@tailwindcss/typography`)
- Twitter embeds render via `TwitterEmbed` component (loads `platform.twitter.com/widgets.js`)
- YouTube iframes render natively in the HTML
- Blog link is in the **footer** (not header)

### 16. Go Live — Publish Blog + Set Video Public

**The video stays unlisted until this step.** Blog post and YouTube video go live at the same time.

1. **Publish the blog post** — set status to "published" via admin dashboard or API:
```bash
curl -X PATCH "${SB_URL}/rest/v1/blog_posts?slug=eq.${SLUG}" \
  -H "apikey: ${SB_KEY}" -H "Authorization: Bearer ${SB_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"published": true, "status": "published", "published_at": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'
```

2. **Set YouTube video to public** — this is when the video goes live:
```javascript
// Using the googleapis library (same auth as youtube-upload.mjs)
youtube.videos.update({
  part: 'status',
  requestBody: { id: 'VIDEO_ID', status: { privacyStatus: 'public' } }
})
```
Or via node one-liner:
```bash
node -e "
const{google}=require('googleapis');const{readFileSync,existsSync}=require('fs');
if(existsSync('.env.local')){for(const l of readFileSync('.env.local','utf-8').split('\n')){const t=l.trim();if(!t||t.startsWith('#'))continue;const e=t.indexOf('=');if(e>0)process.env[t.slice(0,e)]=t.slice(e+1);}}
const token=JSON.parse(readFileSync('video-pipeline/scripts/.youtube-token.json','utf-8'));
const auth=new google.auth.OAuth2(process.env.YOUTUBE_CLIENT_ID,process.env.YOUTUBE_CLIENT_SECRET);
auth.setCredentials(token);const yt=google.youtube({version:'v3',auth});
yt.videos.update({part:'status',requestBody:{id:'VIDEO_ID',status:{privacyStatus:'public'}}})
.then(()=>console.log('Public')).catch(e=>console.error(e.message));
"
```

3. **Cross-post** — use the LinkedIn and X share buttons in the admin Blog tab
4. **Verify** — check the public blog URL and YouTube URL both work

**IMPORTANT:** Never set a video to public before the blog post is published. The video URL in the blog post must be accessible when readers click through.

## Tools

| Tool | Purpose |
|------|---------|
| `video-pipeline/scripts/tweet-card.mjs` | Render tweet as styled card with yellow highlights on dark bg |
| `video-pipeline/scripts/tweet-screenshot.mjs` | Screenshot real tweet via oembed (no login needed) |
| `video-pipeline/scripts/text-card.mjs` | Render styled text cards (dark bg, green highlights) |
| `video-pipeline/scripts/youtube-upload.mjs` | Upload video to YouTube with OAuth |
| ElevenLabs API | Voice generation (Voice ID: WQcQveC0hbQNvI69FWyU) |
| HeyGen API | Avatar video (Avatar: Silas_expressive_2024120201) |
| Puppeteer | Frame generation, tweet card rendering |
| ffmpeg | Video stitching, audio processing, normalization |
| Supabase Storage | Public URL hosting for HeyGen audio files |

## Rules

1. **Tweet-first:** Write narration to follow the tweet top-to-bottom
2. **Highlight what you're quoting:** Yellow highlight appears exactly when narrator reads that text
3. **Progressive highlights:** Highlights accumulate, never reset
4. **No fake content:** Use actual tweet text, actual quotes, actual engagement stats
5. **No paywall screenshots:** Never screenshot paywalled sites — use tweet-card renderer
6. **Dark bg for Leo, dark bg with white tweet card for tweets:** Consistent visual language
7. **OA icon on all Leo segments:** 200x200, top-right corner
8. **Standard outro:** "This is the new world, this is AI orchestration. Subscribe and hit the bell for your daily dose of AI." — always a statement, never a question
9. **No filler:** No "watch this", "check this out", "let's get into it"
10. **Match audio to visuals:** Every highlight must sync with what's being said
11. **Silence check:** All audio <1.0s gaps before sending to HeyGen
12. **Pad Leo audio:** 1s silence prepended so HeyGen mouth starts closed
13. **Re-encode on concat:** Never use `-c copy` — causes audio dropout
14. **Exact duration match:** Tweet section video duration must exactly match audio duration (`-t` flag)
15. **Pronunciation:** Test audio before HeyGen — uppercase terms get misread, spell phonetically if needed
16. **Thumbnails:** Leo left, text right, no overlap on body, max 5 words, accent color on key word
17. **Upload unlisted:** Videos are always uploaded as unlisted — go public only when companion blog post publishes
18. **Blog + video go live together:** Embed YouTube video in blog post, publish blog, then set video to public
19. **End screen cards:** Add subscribe button + video cards in YouTube Studio for last 5-8 seconds
20. **Subscribe CTA in video:** Leo says "Subscribe and hit the bell for your daily dose of AI" with subscribe/bell animation overlay
21. **Blog content is HTML:** Use `dangerouslySetInnerHTML` + `@tailwindcss/typography` prose classes — not ReactMarkdown
22. **Featured image hides on video posts:** If blog content contains a YouTube embed, the featured image is hidden on the post page (still shows on `/blog` listing)
23. **Blog in footer, not header:** Blog link lives in the site footer
24. **YouTube embed at top of blog post:** Always the first element in the blog content
25. **Tweet embeds via blockquote:** Use Twitter's blockquote embed code — the `TwitterEmbed` component loads the widget JS
26. **Blog + video titles match:** Blog post title should match or closely mirror the YouTube video title
27. **Featured image = video thumbnail:** Upload the same thumbnail used for YouTube as the blog featured image

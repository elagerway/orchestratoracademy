# News Video Pipeline

Repeatable process for producing "Daily Dose of AI" news videos for Orchestrator Academy YouTube channel.

## Overview

Each video covers a trending AI topic (tweet, article, announcement) with Leo narrating over highlighted source material. Videos are ~90-120 seconds.

## Video Structure

```
1. Typing Opener (2-3s)
   - Green monospace text on dark bg: "> this is your daily dose of AI"
   - ElevenLabs voiceover synced to typing
   - Hold completed text 1s
   - Flicker effect + modem sound
   
2. Leo Intro (8-12s)
   - Dark background, OA icon top-right
   - Sets up who/what: "Andrej Karpathy, the guy who built Tesla's AI..."
   - No filler, straight to the story

3. Tweet/Source Sections (variable, 20-30s each)
   - White background tweet cards (looks like real X/Twitter)
   - Progressive yellow highlights synced to narration
   - Each highlight appears exactly when narrator quotes that text
   - Multiple sections if the source is long

4. Leo Outro (8-12s)
   - Dark background, OA icon top-right
   - "This is the new world, this is AI orchestration..."
   - Statement, not a question
   - Natural/conversational voice (stability: 0.45, style: 0.5)

5. End Card (3-4s)
   - Leo holds 1s after finishing
   - Gentle 1.5s fade to black
   - OA logo (white on dark) fades in centered
   - Hold 2s
```

## File Structure

```
video-pipeline/output/News/<topic-slug>/
├── assets_v2/
│   ├── leo-intro.txt              # Leo intro script
│   ├── leo-intro.mp3              # ElevenLabs audio
│   ├── leo-intro-padded.mp3       # +1s silence at start
│   ├── vo-section1.txt            # Voiceover section 1 script
│   ├── vo-section1.mp3            # ElevenLabs audio
│   ├── vo-section2.txt            # Voiceover section 2 script
│   ├── vo-section2.mp3
│   ├── vo-section3.txt            # (optional) section 3
│   ├── vo-section3.mp3
│   ├── leo-outro.txt              # Leo outro script
│   ├── leo-outro.mp3
│   └── *_video_id.txt             # HeyGen video IDs
├── screenshots/
│   ├── tweet-none_p1.png          # Unhighlighted tweet page 1
│   ├── tweet-none_p2.png          # Unhighlighted tweet page 2
│   ├── tweet-s1a_p1.png           # Section 1, highlight phase A
│   ├── tweet-s1b_p1.png           # Section 1, highlight phase B
│   ├── tweet-s2a_p2.png           # Section 2, highlight phase A
│   └── ...                        # Progressive highlights per section
├── tweet-config.json              # Base tweet config (full text, stats)
├── tweet-config-s1a.json          # Section-specific highlight configs
├── normalized_v2/
│   ├── opener.mp4
│   ├── leo-intro-padded.mp4
│   ├── tweet-s1.mp4
│   ├── tweet-s2.mp4
│   ├── leo-outro-final.mp4
│   └── concat.txt
└── final.mp4                      # Final output
```

## Shared Assets

```
video-pipeline/output/News/shared/
├── daily-dose.mp3                 # "This is your daily dose of AI" voiceover
├── dark-bg.png                    # Solid dark background for HeyGen
├── intro-bg.png                   # (unused, keep dark solid)
└── intro.mp4                      # (deprecated, use typing opener instead)
```

## Step-by-Step Process

### 1. Research & Select Topic

Find trending AI content via web search or Twitter. Look for:
- Tweets with high engagement (10K+ likes) from key accounts
- Breaking news about models, frameworks, tools
- Key accounts: @karpathy, @AnthropicAI, @OpenAI, @GoogleAI

### 2. Create Tweet Config

Create `tweet-config.json` with the full tweet text:

```json
{
  "name": "Andrej Karpathy",
  "handle": "@karpathy",
  "avatar": "https://pbs.twimg.com/profile_images/.../photo.jpg",
  "verified": true,
  "date": "10:50 AM · Feb 25, 2026",
  "text": "Full tweet text here...",
  "highlights": [],
  "likes": "37.1K",
  "replies": "1.6K",
  "reposts": "8.2K",
  "views": "4.1M"
}
```

### 3. Write Scripts — Tweet First

Read the tweet top to bottom. Write narration that follows the tweet order:

**Rules:**
- When quoting the tweet, use the EXACT words
- Each voiceover section covers one natural section of the tweet
- Identify which phrases to highlight in each section
- Note the word position of each highlight for timing
- No filler phrases ("watch this", "check this out")
- Leo intro: who is this person, why should you care, what happened
- Leo outro: statement about what this means, "subscribe to learn more"

### 4. Calculate Highlight Timing

For each voiceover section, calculate when each highlighted phrase is spoken:

```python
text = "full narration script..."
duration = 21.9  # seconds (from audio file)
words_per_sec = len(text.split()) / duration

target = "phrase to highlight"
words_before = len(text.split(target)[0].split())
time_at_target = words_before / words_per_sec
```

### 5. Generate Tweet Cards

Create progressive highlight configs for each timing phase:

```bash
# Unhighlighted
tweet-config-none.json  → highlights: []

# Section 1, phase A (first quote)
tweet-config-s1a.json   → highlights: ["first quoted phrase"]

# Section 1, phase B (accumulates)
tweet-config-s1b.json   → highlights: ["first quoted phrase", "second quoted phrase"]
```

Render all variants:

```bash
node video-pipeline/scripts/tweet-card.mjs \
  --config tweet-config-s1a.json \
  --output screenshots/tweet-s1a.png
```

The tweet-card renderer outputs `_p1.png` and `_p2.png` for multi-page tweets.

### 6. Generate Audio — ElevenLabs

```bash
VOICE_ID="WQcQveC0hbQNvI69FWyU"

# Standard narration (voiceover sections)
curl -X POST "https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}" \
  -H "xi-api-key: ${ELEVENLABS_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "script content",
    "model_id": "eleven_turbo_v2_5",
    "voice_settings": {
      "stability": 0.6,
      "similarity_boost": 0.8,
      "style": 0.3,
      "use_speaker_boost": true
    }
  }' -o section.mp3

# Leo outro (more conversational)
# Use: stability: 0.45, style: 0.5 for natural feel
```

**Check for silence gaps** (>1.0s means replace periods with commas):
```bash
ffmpeg -i section.mp3 -af silencedetect=noise=-30dB:d=0.8 -f null - 2>&1 | grep silence_duration
```

**Pad Leo segments with 1s silence** (mouth-closed start):
```bash
ffmpeg -y -f lavfi -t 1 -i anullsrc=r=44100 -i leo.mp3 \
  -filter_complex "[0:a][1:a]concat=n=2:v=0:a=1" leo-padded.mp3
```

### 7. Generate Leo Segments — HeyGen

Upload padded audio to Supabase storage, then submit to HeyGen:

```bash
# Upload audio
curl -X POST "${SB_URL}/storage/v1/object/assets/news-audio/${filename}.mp3" \
  -H "Authorization: Bearer ${SB_KEY}" \
  -H "Content-Type: audio/mpeg" \
  --data-binary "@audio.mp3"

# Generate video
curl -X POST "https://api.heygen.com/v2/video/generate" \
  -H "X-Api-Key: ${HEYGEN_KEY}" \
  -d '{
    "video_inputs": [{
      "character": {
        "type": "avatar",
        "avatar_id": "Silas_expressive_2024120201",
        "avatar_style": "normal"
      },
      "voice": {
        "type": "audio",
        "audio_url": "https://...public-url.mp3"
      },
      "background": {
        "type": "image",
        "url": "https://...dark-bg.png"
      }
    }],
    "dimension": {"width": 1920, "height": 1080}
  }'
```

**Always use dark-bg.png** for Leo segments.

**Add OA icon overlay** (200x200, top-right) after downloading:
```bash
ffmpeg -y -i leo.mp4 -i oa-icon-dark.png \
  -filter_complex "[0:v]scale=1920:1080[base];[1:v]scale=200:200[icon];[base][icon]overlay=W-240:40[vout]" \
  -map "[vout]" -map 0:a \
  -c:v libx264 -preset medium -crf 18 -r 25 -pix_fmt yuv420p \
  -c:a aac -ar 44100 -ac 2 leo-with-icon.mp4
```

### 8. Build Typing Opener

Generate typing animation frames (Puppeteer, single page, evaluate updates):

```bash
# See video-pipeline/output/News/karpathy-20-80/opener_frames_v6/ for reference
# Key params: green #34d399, SF Mono font, 52px, dark #0a0a0a bg
# Type speed: ~1.6s for the full line
# Hold: 1s after completion
# Flicker: 0.4s rapid on/off with modem sound
```

Build opener video:
```bash
# 1. Render frames to video
ffmpeg -y -framerate 25 -i frames/frame-%04d.png -c:v libx264 typing.mp4

# 2. Create 1s hold (last frame + silence)
ffmpeg -y -loop 1 -i last-frame.png -f lavfi -t 1 -i anullsrc -t 1 hold.mp4

# 3. Create flicker (10 frames, on/off pattern) + modem sound
# Modem: ffmpeg sine wave chain at varying frequencies, 0.4s, volume 0.3

# 4. Concat: typing + hold + flicker
```

### 9. Build Tweet Sections

For each voiceover section, create video with progressive highlights:

```bash
# Example: 4 phases (none → A → B → C) at calculated timestamps
ffmpeg -y \
  -loop 1 -i tweet-none_p1.png \
  -loop 1 -i tweet-s1a_p1.png \
  -loop 1 -i tweet-s1b_p1.png \
  -loop 1 -i tweet-s1c_p1.png \
  -i voiceover.mp3 \
  -filter_complex "\
    [0:v]scale=1920:1080:pad=white,trim=duration=1.6,setpts=PTS-STARTPTS[v0];\
    [1:v]scale=1920:1080:pad=white,trim=duration=7.2,setpts=PTS-STARTPTS[v1];\
    [2:v]scale=1920:1080:pad=white,trim=duration=10.3,setpts=PTS-STARTPTS[v2];\
    [3:v]scale=1920:1080:pad=white,trim=duration=2.8,setpts=PTS-STARTPTS[v3];\
    [v0][v1][v2][v3]concat=n=4:v=1:a=0[vout]" \
  -map "[vout]" -map 4:a \
  -t ${AUDIO_DURATION} tweet-section.mp4
```

**CRITICAL: Match video duration exactly to audio duration** (`-t` flag). Mismatch causes audio dropout.

**Tweet cards use WHITE background.** Leo uses DARK background.

### 10. Build Leo Outro with Fade

```bash
OUTRO_DUR=$(ffprobe ... leo-outro.mp4)

# Leo holds 1s after talking, then 1.5s fade out, then endcard fades in 2s
ffmpeg -y -i leo-outro.mp4 -loop 1 -i endcard.png \
  -f lavfi -t 5 -i anullsrc \
  -filter_complex "\
    [0:v]tpad=stop_mode=clone:stop_duration=1[hold];\
    [hold]fade=t=out:st=${OUTRO_DUR+1}:d=1.5[fade];\
    [1:v]fade=t=in:d=0.5,trim=duration=2,setpts=PTS+${OUTRO_DUR+1}/TB[card];\
    [fade][card]overlay=eof_action=pass[vout];\
    [0:a]apad=whole_dur=${OUTRO_DUR+4.5}[aout]" \
  -map "[vout]" -map "[aout]" outro-final.mp4
```

**End card:** Large white OA icon (200x200, rounded corners) centered on #1a1a1a background.

### 11. Normalize & Stitch

All segments must have identical format before concat:
- Video: libx264, 1920x1080, 25fps, yuv420p, crf 18
- Audio: aac, 44100 Hz, stereo, 128k

```bash
# Concat with re-encode (prevents audio glitches at boundaries)
ffmpeg -y -f concat -safe 0 -i concat.txt \
  -c:v libx264 -preset medium -crf 18 -r 25 -pix_fmt yuv420p \
  -c:a aac -ar 44100 -ac 2 \
  final.mp4
```

**Never use `-c copy` for concat** — causes audio dropout at segment boundaries.

### 12. Upload & Publish

Upload to YouTube, create blog post with embedded tweet, schedule both.

## Tools

| Tool | Purpose | Config |
|------|---------|--------|
| `tweet-card.mjs` | Render tweet as styled card with highlights | White bg, yellow highlights, real X styling |
| `tweet-screenshot.mjs` | Screenshot real tweet via oembed (no login) | White bg, centered |
| `text-card.mjs` | Render styled text cards | Dark bg, green highlights (for non-tweet content) |
| ElevenLabs | Voice generation | Voice: WQcQveC0hbQNvI69FWyU, Model: eleven_turbo_v2_5 |
| HeyGen | Avatar video | Avatar: Silas_expressive_2024120201, Dark bg |
| Puppeteer | Frame generation, screenshots | Headless, no-sandbox |
| ffmpeg | Video stitching, audio processing | Always re-encode on concat |

## Voice Settings

| Segment | Stability | Similarity | Style | Notes |
|---------|-----------|------------|-------|-------|
| Narration | 0.6 | 0.8 | 0.3 | Standard, clear |
| Leo outro | 0.45 | 0.75 | 0.5 | Conversational, human |
| Daily dose opener | 0.6 | 0.8 | 0.3 | Standard |

## Rules

1. **Tweet-first:** Write narration to follow the tweet top-to-bottom
2. **Highlight what you're quoting:** Every time narrator reads tweet text, that text is highlighted on screen
3. **Progressive highlights:** Highlights accumulate, don't reset between quotes
4. **No fake content:** Use actual tweet text, actual quotes, actual stats
5. **No paywall screenshots:** Never screenshot paywalled sites, use styled cards instead
6. **Dark bg for Leo, white bg for tweets:** Consistent visual language
7. **OA icon on Leo segments:** 200x200, top-right corner, always
8. **Statement outros:** "Subscribe to learn more." not "Subscribe if you want to learn more?"
9. **No filler:** No "watch this", "check this out", "let's get into it"
10. **Match audio to visuals:** Every visual cut must match what's being said
11. **Silence check:** All audio must pass <1.0s gap check before sending to HeyGen
12. **Pad Leo audio:** 1s silence prepended so mouth starts closed

# Video Pipeline

Repeatable process for producing module videos for Orchestrator Academy.

## File structure

```
video-pipeline/
  public/
    Module {N}/
      Lesson {N}/
        intro.mp4          # HeyGen talking head
        transition.mp4      # HeyGen talking head
        outro.mp4           # HeyGen talking head
        voiceover-code1.mp3 # ElevenLabs audio for code screen 1
        voiceover-code2.mp3 # ElevenLabs audio for code screen 2
  output/
    Module {N}/
      Lesson {N}/
        assets/             # Scripts, audio versions, HeyGen video IDs
        final.mp4           # Final stitched video
```

## Video structure

Each lesson video alternates between talking head segments and content segments:

1. **Intro** (talking head) — Leo on camera, introduces the lesson
2. **Content segment** — full-screen graphic or Claude Code screen
3. **Transition** (talking head) — Leo on camera, bridges to the next topic
4. **Content segment** — full-screen graphic or Claude Code screen
5. **Outro** (talking head) — Leo on camera, recap and tease next lesson

Lessons may have more or fewer segments depending on content, but always start and end with Leo on camera.

### Content segment types

**Claude Code Screen** — Use when the lesson demonstrates AI commands, workflows, agent outputs, or terminal interactions. Leo narrates via voiceover audio while the Claude Code UI animates on screen. Leo is NOT on camera.

**Full-Screen Graphic** — Use when the lesson covers concepts, career paths, plans, comparisons, frameworks, or anything that isn't terminal/code content. These use **Gemini-generated illustrations** displayed full-screen with voiceover audio, rendered by Remotion. Leo is NOT on camera.

Generate images via Gemini (`gemini-3-pro-image-preview`) with prompts that match the content being discussed. Use 16:9 aspect ratio, 2K resolution, dark navy background (#0f172a). Save to `public/Module {N}/Lesson {N}/images/`. The Remotion composition crossfades between images as Leo narrates, with framework/concept name and subtitle overlaid at the bottom.

**Rule of thumb:** If it would look natural in a terminal, use Claude Code Screen. Otherwise, use Full-Screen Graphic with generated imagery.

### Critical rule: NEVER overlay graphics on talking head video

Any re-encoding of HeyGen video (via Remotion or ffmpeg overlay) causes visible jitter. This was tested with both approaches and both fail. The ONLY way to avoid jitter is to use raw HeyGen mp4 files completely untouched.

Therefore:
- Talking head segments = raw HeyGen mp4, never re-encoded
- Content segments = independently rendered by Remotion (no video source)
- These are separate segments stitched together with ffmpeg concat
- Graphics can be as rich as needed since they're rendered independently

**Exception: Outro summary overlay** — The outro talking head gets summary cards recapping the key concepts. To avoid jitter:

1. Create an `OutroCards` Remotion composition that renders ONLY the animated cards on a transparent background (no `<Video>` component)
2. Render as PNG image sequence: `npx remotion render ... --image-format=png --sequence output/outro_frames/`
3. Composite onto the raw HeyGen outro via ffmpeg overlay:

```bash
ffmpeg -y \
  -i "public/Module {N}/Lesson {N}/outro.mp4" \
  -framerate 25 -i "output/Module {N}/Lesson {N}/outro_frames/element-%03d.png" \
  -filter_complex "[0:v][1:v]overlay=0:0:shortest=1" \
  -c:v libx264 -preset medium -crf 18 -r 25 -pix_fmt yuv420p \
  -c:a copy \
  "output/Module {N}/Lesson {N}/outro_composited.mp4"
```

This avoids Remotion's jittery video re-encoding by letting ffmpeg handle the video overlay at the codec level.

## Intro gap

Leo must never start with his mouth open. Prepend 1 second of silence to the intro audio before sending to HeyGen:

```bash
ffmpeg -y -f lavfi -t 1 -i anullsrc=r=44100 \
  -i "output/Module {N}/Lesson {N}/assets/intro.mp3" \
  -filter_complex "[0:a][1:a]concat=n=2:v=0:a=1" \
  "output/Module {N}/Lesson {N}/assets/intro_padded.mp3"
```

Use `intro_padded.mp3` when sending to HeyGen. This gives Leo a beat on screen before he starts speaking.

## Watermark

**Do NOT burn the watermark into the video.** The OA watermark is added via CSS overlay in the web app's video player component. This keeps source videos clean and the watermark always sharp.

## Brand intro

Every video starts with a 1.5-second branded intro: black background with OA icon centered, fading out to the first talking head. This is rendered as a Remotion `BrandIntro` composition and prepended during the ffmpeg stitch. It solves two problems:
1. Leo never starts with his mouth open
2. Every video has consistent branding

## Rendering approach

- Use raw HeyGen mp4s directly for all talking head segments
- Render code screens and full-screen graphics independently with Remotion
- Stitch everything together with ffmpeg
- Never pass a HeyGen video through Remotion or ffmpeg overlay

## Step-by-step process

### 1. Write the transcripts

Write all 5 scripts as plain text files in `output/Module {N}/Lesson {N}/assets/`:

- `intro_script.txt`
- `voiceover1_script.txt`
- `transition_script.txt`
- `voiceover2_script.txt`
- `outro_script.txt`

Rules:
- Use **commas** between phrases, NOT dashes (`—`) or periods — dashes and periods cause ElevenLabs to insert long awkward pauses. Commas keep the flow natural.
- Leo addresses students as "you", never "I did the orchestrating"
- Reference the 6-step workflow correctly: **Build Spec, Implement, Code Review, Rebuild, Test, Commit and Push**
- The orchestrator is the human instructing agents, not writing code
- **No filler phrases** — never use "watch this", "check this out", "look at this". Jump straight into the content.
- End the outro warmly (e.g. "welcome again to the AI Orchestration Academy!")
- **Always produce full audio and listen before sending to HeyGen** — concatenate all 5 segments and review the complete flow. Only send to HeyGen after audio is approved.

### 2. Generate audio via ElevenLabs

For each script, generate audio using ElevenLabs TTS:

```bash
curl -X POST "https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}" \
  -H "xi-api-key: ${ELEVENLABS_API_KEY}" \
  -H "Content-Type: application/json" \
  -H "Accept: audio/mpeg" \
  -d '{
    "text": "<script content>",
    "model_id": "eleven_turbo_v2_5",
    "voice_settings": {
      "stability": 0.6,
      "similarity_boost": 0.8,
      "style": 0.3,
      "use_speaker_boost": true
    }
  }' -o "output/Module {N}/Lesson {N}/assets/{segment}.mp3"
```

**Check each audio file for silence gaps before presenting to the user:**

```bash
for f in intro voiceover1 transition voiceover2 outro; do
  echo "=== $f ==="
  ffmpeg -i "output/Module {N}/Lesson {N}/assets/${f}.mp3" \
    -af silencedetect=noise=-30dB:d=0.8 -f null - 2>&1 | grep silence_duration
done
```

Any gap over 1.0s needs fixing — find the sentence boundary causing it and replace the period with a comma. Gaps under 1.0s are acceptable natural pauses. Regenerate and re-check until all gaps are under 1.0s.

**Then concatenate all 5 and listen to the full flow:**

```bash
ffmpeg -y \
  -i "output/Module {N}/Lesson {N}/assets/intro.mp3" \
  -i "output/Module {N}/Lesson {N}/assets/voiceover1.mp3" \
  -i "output/Module {N}/Lesson {N}/assets/transition.mp3" \
  -i "output/Module {N}/Lesson {N}/assets/voiceover2.mp3" \
  -i "output/Module {N}/Lesson {N}/assets/outro.mp3" \
  -filter_complex "[0:a][1:a][2:a][3:a][4:a]concat=n=5:v=0:a=1[out]" \
  -map "[out]" "output/Module {N}/Lesson {N}/full-audio.mp3"
```

Only proceed to HeyGen after full audio is approved.

### 3. Place voiceover audio in public/

Copy the voiceover mp3s to `video-pipeline/public/Module {N}/Lesson {N}/`:
- `voiceover-code1.mp3`
- `voiceover-code2.mp3`

### 4. Update Root.tsx with code screen content

Update `Root.tsx`:
- Set code-screen `durationInFrames` to match voiceover mp3 duration: `Math.round(duration_seconds * 25)`
- Set `voiceoverUrl: staticFile("Module {N}/Lesson {N}/voiceover-code{N}.mp3")` on each code screen segment
- Set talking-head `durationInFrames` to match audio duration (placeholder until HeyGen videos arrive)
- Set `staticFile()` paths for talking heads to `Module {N}/Lesson {N}/{segment}.mp4`
- No `pipSrc` — code screens are full-screen Claude Code UI only

The `lines` arrays define the Claude Code terminal animation. Each line has a type:
- `command` — user input, rendered with green `>` prompt (no `$ claude` prefix needed)
- `output` — Claude's response, checkmarks colored green, warnings yellow
- `comment` — dimmed helper text

### 5. Render code screens with Remotion and review

Calculate frame ranges for code screen segments, then render:

```bash
npx remotion render video-pipeline/src/index.tsx ModuleVideo \
  video-pipeline/output/code1.mp4 \
  --public-dir=video-pipeline/public --frames=START-END

npx remotion render video-pipeline/src/index.tsx ModuleVideo \
  video-pipeline/output/code2.mp4 \
  --public-dir=video-pipeline/public --frames=START-END
```

**Watch both code screen videos.** Verify:
- Voiceover audio plays
- Code animation timing roughly matches what Leo is describing
- Claude Code UI looks authentic
- No segments cut off early

**Only proceed to HeyGen after code screens look and sound right.**

### 6. Send talking-head audio to HeyGen

Only the 3 talking-head segments (intro, transition, outro) go to HeyGen. The 2 voiceovers stay as audio-only.

For each talking-head audio:

1. Upload the mp3 to a public URL (Supabase storage `assets` bucket)
2. Create a HeyGen video with the audio:

```bash
curl -X POST "https://api.heygen.com/v2/video/generate" \
  -H "X-Api-Key: ${HEYGEN_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Module N - segment",
    "video_inputs": [{
      "character": {
        "type": "avatar",
        "avatar_id": "${HEYGEN_AVATAR_ID}",
        "avatar_style": "normal",
        "avatar_version": 4
      },
      "voice": {
        "type": "audio",
        "audio_url": "<public_url_to_mp3>"
      },
      "background": {
        "type": "image",
        "url": "${HEYGEN_BACKGROUND_URL}"
      }
    }],
    "dimension": {"width": 1920, "height": 1080}
  }'
```

3. Poll for completion (~2-10 minutes, can be slow under load):

```bash
curl "https://api.heygen.com/v1/video_status.get?video_id=<video_id>" \
  -H "X-Api-Key: ${HEYGEN_API_KEY}"
```

4. Download completed videos to `video-pipeline/public/Module {N}/Lesson {N}/`:
   - `intro.mp4`
   - `transition.mp4`
   - `outro.mp4`

### 7. Update durations to match HeyGen videos

Get exact durations from the downloaded HeyGen mp4s and update Root.tsx talking-head `durationInFrames` to match.

### 8. Update outro overlay timing

Get word-level timestamps from the outro audio using ElevenLabs speech-to-text. Update the `STEPS` array in `OutroOverlay.tsx` with `appearAt` times matching when Leo says each key point. The steps should fade out slowly after all are visible.

**Known issue:** Rendering the outro through Remotion (for the overlay) causes slight jitter on the talking head video during the text animations. This is a Remotion recompositing issue — the CSS transforms on the overlay elements force per-frame re-rendering of the video layer. Future fix: render the text overlay as a transparent video and composite with ffmpeg instead of Remotion.

Render the outro overlay:

```bash
npx remotion render video-pipeline/src/index.tsx OutroOverlay \
  video-pipeline/output/outro_with_steps.mp4 \
  --public-dir=video-pipeline/public
```

### 9. Render brand intro

Render the `BrandIntro` Remotion composition — 1.5 seconds of black with OA icon centered, fading out. This is a reusable composition at `video-pipeline/src/compositions/BrandIntro.tsx`.

```bash
npx remotion render video-pipeline/src/index.tsx BrandIntro \
  video-pipeline/output/brand_intro.mp4 \
  --public-dir=video-pipeline/public
```

This only needs to be rendered once and can be reused across all lessons.

### 10. Stitch with ffmpeg

Concatenate brand intro + intro + content segments + outro using ffmpeg. The brand intro is always the first segment:

```bash
ffmpeg -y \
  -i video-pipeline/output/brand_intro.mp4 \
  -i "video-pipeline/public/Module {N}/Lesson {N}/intro.mp4" \
  -i video-pipeline/output/code1.mp4 \
  -i "video-pipeline/public/Module {N}/Lesson {N}/transition.mp4" \
  -i video-pipeline/output/code2.mp4 \
  -i video-pipeline/output/outro_composited.mp4 \
  -i "video-pipeline/public/Module {N}/Lesson {N}/voiceover-code1.mp3" \
  -i "video-pipeline/public/Module {N}/Lesson {N}/voiceover-code2.mp3" \
  -filter_complex "
    [0:v]setpts=PTS-STARTPTS[v0];
    [1:v]setpts=PTS-STARTPTS[v1];
    [2:v]setpts=PTS-STARTPTS[v2];
    [3:v]setpts=PTS-STARTPTS[v3];
    [4:v]setpts=PTS-STARTPTS[v4];
    [5:v]setpts=PTS-STARTPTS[v5];
    [v0][0:a][v1][1:a][v2][6:a][v3][3:a][v4][7:a][v5][5:a]concat=n=6:v=1:a=1[vout][aout]
  " \
  -map "[vout]" -map "[aout]" \
  -c:v libx264 -preset medium -crf 18 -r 25 -pix_fmt yuv420p \
  -c:a aac -b:a 192k \
  "video-pipeline/output/Module {N}/Lesson {N}/final.mp4"
```

Notes:
- Brand intro is always the first segment (black + OA icon fade)
- The outro uses `outro_composited.mp4` (PNG overlay via ffmpeg), not the raw HeyGen outro
- Intro and transition use raw HeyGen mp4s directly to avoid jitter
- Watermark is NOT burned in — it's added via CSS in the web player

### 10. Write transcript

Create `output/Module {N}/Lesson {N}/transcript.md` with the full transcript, labeling each segment:

```markdown
# Module {N} — Lesson {N}: {Title} — Full Transcript

## 1. Intro (talking head)
{intro script}

## 2. Code Screen 1 (voiceover over Claude Code UI)
{voiceover1 script}

## 3. Transition (talking head)
{transition script}

## 4. Code Screen 2 (voiceover over Claude Code UI)
{voiceover2 script}

## 5. Outro (talking head, with overlay)
{outro script}
```

**Do this for every lesson.** The transcript is a deliverable, not optional.

### 11. Generate thumbnail

Thumbnails use a CSS/HTML template rendered via Playwright at the Vimeo player display size (850×480). **Design at display size, not at 1920×1080** — the thumbnail must be readable at the size users actually see it.

**Layout:**
- Leo frame (mouth closed) on the left — 55% width, with a gradient fade into the dark background
- Right side: green accent line, module/lesson label, lesson title, small contextual SVG diagram
- "Orchestrator Academy" watermark top-right
- Background: `#0a0a0a`, accent: `#00C853`, font: Sora

**Key rules:**
- Leo must have his mouth closed — use `leo_frame_closed.jpg` (extracted at 1.9s from M1L1 final.mp4)
- All sizing uses `vw` units so the layout scales with viewport
- Leo side: `55%` width
- Title: `3.2vw` bold
- Module label: `1.4vw` green uppercase
- Diagram: `18vw × 18vw`
- Content padding: `5% 6% 5% 4%`, top-aligned (`justify-content: flex-start`)

**Diagrams per lesson:**
| Slug | Diagram | Description |
|------|---------|-------------|
| what-is-ai-orchestration | orchestra | Hub-and-spoke: ORC centre, 4 AI nodes |
| ai-landscape-2026 | landscape | Stacked horizontal bars (LLMs, Vision, etc.) |
| day-in-the-life | dayloop | Circular loop: Plan → Build → Monitor |
| career-paths | paths | Branching tree: YOU → 3 career paths + Coach |
| ai-models-providers | models | Grid of provider boxes (Claude, GPT, etc.) |
| orchestration-frameworks | frameworks | Horizontal pipeline: CrewAI → LangGraph → Magpipe |
| anatomy-of-great-prompt | prompt | RACE framework: R-A-C-E stacked |
| advanced-prompt-techniques | chain | Chain-of-thought: linked circles descending |
| workflow-design-principles | workflow | Vertical flowchart: Input → Process → Review → Output |
| build-research-agent | agent | Agent loop: Question → Search → Analyse → Report |
| ethics-for-orchestrators | shield | Shield icon with checkmark |
| building-responsible-systems | checklist | Checklist with tick marks |
| what-youve-learned | recap | Badge with 7 modules radiating |
| advanced-courses-certification | rocket | Rocket / upward arrow |

Save to `output/Module {N}/Lesson {N}/thumbnail.png`.

### 12. Upload to Vimeo

Upload the final video and thumbnail to Vimeo:

1. Create video via Vimeo API with tus upload
2. Upload thumbnail to `/videos/{id}/pictures`
3. Set `active: true` on the thumbnail
4. **Hide all details** on the embed:

```javascript
await fetch('https://api.vimeo.com/videos/' + id, {
  method: 'PATCH',
  headers: { 'Authorization': 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    privacy: { view: 'disable', embed: 'whitelist' },
    embed: {
      title: { name: 'hide', owner: 'hide', portrait: 'hide' },
      logos: { vimeo: false },
      buttons: { like: false, watchlater: false, share: false },
    },
  }),
});
```

This hides title, profile picture, byline, Vimeo logo, and social buttons from the embedded player.

### 13. Review

Watch the full video. Check for:
- Brand intro plays (OA icon fade)
- No jitter on talking head segments
- Audio/video sync
- No segments cut off early (duration mismatch)
- Code animation timing matches voiceover pacing
- Overlay appears in sync with Leo's narration
- Claude Code UI looks authentic
- Outro ends on a warm, welcoming note
- Thumbnail looks good on Vimeo

## Environment variables

Required in `.env.local`:

| Variable | Purpose |
|----------|---------|
| `ELEVENLABS_API_KEY` | ElevenLabs TTS |
| `ELEVENLABS_VOICE_ID` | Leo's voice (default: `WQcQveC0hbQNvI69FWyU`) |
| `HEYGEN_API_KEY` | HeyGen avatar video |
| `HEYGEN_AVATAR_ID` | Leo's avatar (default: `Silas_expressive_2024120201`) |
| `HEYGEN_BACKGROUND_URL` | Background image for talking heads |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase (for hosting audio publicly) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role |
| `VIMEO_CLIENT_ID` | Vimeo API client ID |
| `VIMEO_ACCESS_TOKEN` | Vimeo API access token |
| `VIMEO_CLIENT_SECRET` | Vimeo API client secret |

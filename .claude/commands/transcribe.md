---
name: transcribe
description: Transcribe a YouTube video and save a clean, structured transcript to docs/
argument-hint: "<youtube-url> <output-filename>"
---

Transcribe the YouTube video at the given URL and save a clean, structured markdown transcript.

## Arguments

- First argument: YouTube URL (required)
- Second argument: output filename without extension (required), saved to `docs/<filename>.md`

If arguments are missing, extract them from the user's message context.

## Steps

1. **Install yt-dlp** if not already available:
   ```
   pip3 install yt-dlp
   ```

2. **Get the video title**:
   ```
   yt-dlp --print title "<url>"
   ```

3. **Download auto-generated subtitles**:
   ```
   yt-dlp --write-auto-sub --sub-lang en --skip-download --sub-format vtt -o "/tmp/<filename>" "<url>"
   ```

4. **Parse the VTT file into clean text** using Python to:
   - Remove VTT headers and timestamp lines
   - Strip HTML tags
   - Deduplicate repeated lines (auto-subs repeat heavily)
   - Join into flowing paragraphs

5. **Structure the transcript** into a markdown file at `docs/<filename>.md`:
   - Add a title heading using the video title
   - Add a source link to the YouTube URL
   - Break the transcript into logical paragraphs
   - Add section headers where the speaker shifts topics
   - Clean up obvious auto-caption errors (e.g., "Chatbt" → "ChatGPT")
   - Remove sponsor/ad segments but note they were removed

6. **Download the video** for frame extraction:
   ```
   yt-dlp -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]" -o "/tmp/<filename>.mp4" "<url>"
   ```

7. **Extract key frames at scene changes** using ffmpeg:
   ```
   mkdir -p docs/<filename>-frames
   ffmpeg -i /tmp/<filename>.mp4 -vf "select='gt(scene,0.3)'" -vsync vfq docs/<filename>-frames/frame_%03d.png
   ```
   This captures frames where the visual content changes significantly — ideal for slides, diagrams, and screen transitions.

8. **Clean up** — remove the downloaded video from `/tmp`:
   ```
   rm /tmp/<filename>.mp4
   ```

9. **Embed frames in the transcript** — add an image gallery section at the end of the markdown file referencing the extracted frames:
   ```markdown
   ## Key Frames

   ![Frame 1](<filename>-frames/frame_001.png)
   ![Frame 2](<filename>-frames/frame_002.png)
   ...
   ```

10. **Write the file** to `docs/<filename>.md`

## Output Format

```markdown
# <Video Title>

**Source:** [YouTube - <Channel>](<url>)

## Transcript

<Structured transcript with paragraph breaks and topic headers>
```

## Notes

- Always use `yt-dlp` for subtitle extraction — it handles YouTube's auto-generated captions
- The VTT deduplication step is critical — without it, every line appears 2-3 times
- Prefer `--sub-lang en` but fall back to whatever language is available
- If no subtitles are available at all, inform the user
- Scene change threshold `0.3` works well for most videos — lower it to `0.2` for subtle transitions, raise to `0.4` if too many frames are captured
- If ffmpeg is not installed, inform the user to install it (`brew install ffmpeg` on macOS)
- Clean up the `/tmp` video file after extraction to avoid wasting disk space
- Frame images use relative paths so the markdown renders correctly from `docs/`

#!/usr/bin/env bash
# Generate ElevenLabs audio for all 5 scripts of the routines-vs-n8n-vs-make video.
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/../../.env.local"

DIR="video-pipeline/output/claude-routines-vs-n8n-vs-make-assets"

for segment in intro voiceover1 transition voiceover2 outro; do
  SCRIPT_FILE="$DIR/${segment}_script.txt"
  MP3_FILE="$DIR/${segment}.mp3"
  echo "=== ${segment} ==="
  TEXT=$(cat "$SCRIPT_FILE")
  TEXT_JSON=$(jq -Rs . <<<"$TEXT")

  curl -sS -X POST "https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}" \
    -H "xi-api-key: ${ELEVENLABS_API_KEY}" \
    -H "Content-Type: application/json" \
    -H "Accept: audio/mpeg" \
    -d "{
      \"text\": ${TEXT_JSON},
      \"model_id\": \"eleven_turbo_v2_5\",
      \"voice_settings\": {
        \"stability\": 0.6,
        \"similarity_boost\": 0.8,
        \"style\": 0.3,
        \"use_speaker_boost\": true
      }
    }" -o "$MP3_FILE"

  if [ ! -s "$MP3_FILE" ]; then
    echo "FAIL: empty mp3 for $segment"
    exit 1
  fi

  # Quick silence check
  GAPS=$(ffmpeg -i "$MP3_FILE" -af silencedetect=noise=-30dB:d=0.8 -f null - 2>&1 | grep silence_duration | awk '{print $5}' || true)
  if [ -n "$GAPS" ]; then
    echo "silence gaps in $segment: $GAPS"
  else
    echo "silence gaps in $segment: none >0.8s"
  fi
done

echo "---"
echo "Concatenating full audio"
ffmpeg -y \
  -i "$DIR/intro.mp3" \
  -i "$DIR/voiceover1.mp3" \
  -i "$DIR/transition.mp3" \
  -i "$DIR/voiceover2.mp3" \
  -i "$DIR/outro.mp3" \
  -filter_complex "[0:a][1:a][2:a][3:a][4:a]concat=n=5:v=0:a=1[out]" \
  -map "[out]" "$DIR/full-audio.mp3" 2>&1 | tail -4

echo "Done: $DIR/full-audio.mp3"
ffprobe -i "$DIR/full-audio.mp3" 2>&1 | grep -E "Duration|bitrate"

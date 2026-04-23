#!/usr/bin/env bash
# Poll all 3 HeyGen jobs until done, then download them.
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/../../.env.local"

DIR="video-pipeline/output/claude-routines-vs-n8n-vs-make-assets"

check_and_download() {
  local seg="$1"
  local out="$DIR/${seg}.mp4"
  if [ -f "$out" ]; then return 0; fi
  local vid; vid=$(cat "$DIR/${seg}_video_id.txt")
  local res; res=$(curl -sS "https://api.heygen.com/v1/video_status.get?video_id=$vid" \
    -H "X-Api-Key: ${HEYGEN_API_KEY}")
  local status; status=$(echo "$res" | python3 -c "import json,sys; print(json.load(sys.stdin).get('data',{}).get('status','?'))" 2>/dev/null || echo "?")
  local url; url=$(echo "$res" | python3 -c "import json,sys; print(json.load(sys.stdin).get('data',{}).get('video_url') or '')" 2>/dev/null || echo "")
  echo "$(date +%H:%M:%S) $seg: $status"
  if [ "$status" = "completed" ] && [ -n "$url" ]; then
    curl -sS -L "$url" -o "$out"
    echo "  saved: $out"
    return 0
  fi
  if [ "$status" = "failed" ]; then
    echo "FAILED for $seg"
    exit 1
  fi
  return 1
}

while true; do
  done_count=0
  for seg in intro_padded transition outro; do
    if [ -f "$DIR/${seg}.mp4" ]; then
      done_count=$((done_count+1))
      continue
    fi
    if check_and_download "$seg"; then
      done_count=$((done_count+1))
    fi
  done
  if [ "$done_count" = "3" ]; then
    echo "all 3 complete"
    break
  fi
  sleep 20
done

echo "---durations---"
for seg in intro_padded transition outro; do
  DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$DIR/${seg}.mp4")
  echo "$seg: ${DUR}s"
done

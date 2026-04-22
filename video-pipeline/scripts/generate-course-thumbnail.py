#!/usr/bin/env python3
"""
Generate a course summary thumbnail for /courses in the existing
hand-drawn whiteboard style.

Style reference: every existing course thumbnail is a hand-drawn sketch
on a slightly textured off-white background, with:
  - stick-figure "Orchestrator" at the top (or central)
  - dashed lines connecting to pastel rounded rectangles labeled with
    course concepts (colors: soft blue, green, purple, orange, pink, teal)
  - hand-written font
  - arrows between concepts showing a flow, OR converging into an
    outcome box at the bottom

Saves to public/images/courses/{slug}.jpg at ~1400x800 and updates
the course's thumbnail_url in the DB.

Usage:
  python3 generate-course-thumbnail.py --slug <course-slug>
"""

import argparse
import os
import sys
from pathlib import Path

# Load .env.local
env_path = Path(".env.local")
if env_path.exists():
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        eq = line.index("=")
        os.environ[line[:eq]] = line[eq + 1:]

from google import genai
from google.genai import types
import requests

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SERVICE_ROLE = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

STYLE_GUIDE = """
[Style] Hand-drawn whiteboard sketch, as if drawn with a fine marker on slightly textured paper
[Background] Off-white (#fafafa) with subtle paper texture — small dots and specks. NOT pure white
[Line style] Wobbly, organic pen strokes (not perfectly straight). Slight ink texture
[Color palette] Pastel rounded rectangles (pale blue #a5c9e8, mint green #a7d9b3, lavender #c9a7d9, peach #f5c89a, coral pink #e9a1a9, teal #9dd6cf). Thin black outlines around each box. Hand-written text in black
[Arrows] Dashed thin lines (small dashes), black, drawn as if with a ballpoint
[Typography] Friendly hand-written marker font style — slightly irregular sizing, lowercase and capitalized mixed naturally

[Required elements]
- Stick-figure labeled "Orchestrator" at the top center
- Dashed lines connecting the Orchestrator to each concept box below
- Rounded rectangles in pastel colors (use 3-5 distinct colors from the palette above, one per concept)
- Hand-written concept labels inside each box
- Small relevant icon inside each box (e.g. document, chart, lightning bolt, shield)
- Arrows connecting concepts in sequence or converging to an outcome
- Paper aesthetic throughout — no drop shadows, no gradients, no photorealism

[DO NOT]
- No photorealistic elements
- No drop shadows or 3D effects
- No tech screenshots, laptops, or UI mockups
- No people other than the Orchestrator stick figure
- No text overlay banners or titles outside the sketch
- No emoji
- No solid-color background blocks
"""

COURSE_PROMPTS = {
    "monitoring-self-healing": (
        "The course teaches 'Application Monitoring and Self-Healing Systems'. "
        "Draw an Orchestrator stick figure at the top. Below, dashed lines connect "
        "to four rounded pastel boxes in a row, labeled 'Sentry' (pale blue, with a "
        "small bug icon), 'Dependabot' (mint green, with a shield icon), 'Claude "
        "Routines' (lavender, with a sparkle/star icon), and 'Weekly Review' "
        "(peach, with a checkmark icon). From each of those boxes, an arrow "
        "converges downward into a single larger teal rounded rectangle at the "
        "bottom labeled 'Self-Healing System' (or 'Self-Healing' — whichever fits)."
    ),
}


def build_full_prompt(slug: str, specific: str) -> str:
    return f"""[Format] Course summary thumbnail (landscape, roughly 1400x800)

[Concept]
{specific}

{STYLE_GUIDE}

[Match this specific visual style]
Every other course at the Academy uses this exact hand-drawn whiteboard aesthetic:
stick figure Orchestrator, dashed lines, pastel rounded rectangles with icons,
hand-written labels. This thumbnail must feel consistent with the existing set
so courses appear as a unified family on the /courses grid.
""".strip()


def generate_image(slug: str, specific_prompt: str, out_path: Path) -> None:
    full_prompt = build_full_prompt(slug, specific_prompt)
    print(f"Generating image for {slug}…")
    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=full_prompt,
    )
    for part in response.candidates[0].content.parts:
        if getattr(part, "inline_data", None) and part.inline_data.data:
            out_path.parent.mkdir(parents=True, exist_ok=True)
            out_path.write_bytes(part.inline_data.data)
            print(f"Saved: {out_path}")
            return
    raise RuntimeError("Gemini did not return an image")


def update_db_thumbnail(slug: str, thumbnail_url: str) -> None:
    url = f"{SUPABASE_URL}/rest/v1/courses?slug=eq.{slug}"
    res = requests.patch(
        url,
        headers={
            "apikey": SERVICE_ROLE,
            "Authorization": f"Bearer {SERVICE_ROLE}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        },
        json={"thumbnail_url": thumbnail_url},
    )
    res.raise_for_status()
    print(f"DB thumbnail_url updated for {slug} -> {thumbnail_url}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--slug", required=True, help="Course slug")
    parser.add_argument(
        "--prompt",
        help="Specific visual prompt. If omitted, looks up COURSE_PROMPTS[slug].",
    )
    args = parser.parse_args()

    specific = args.prompt or COURSE_PROMPTS.get(args.slug)
    if not specific:
        sys.exit(
            f"No prompt provided and none found in COURSE_PROMPTS for slug '{args.slug}'. "
            f"Pass --prompt or add an entry to the COURSE_PROMPTS dict."
        )

    out_path = Path(f"public/images/courses/{args.slug}.jpg")
    generate_image(args.slug, specific, out_path)
    update_db_thumbnail(args.slug, f"/images/courses/{args.slug}.jpg")


if __name__ == "__main__":
    main()

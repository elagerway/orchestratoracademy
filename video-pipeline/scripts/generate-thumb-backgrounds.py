#!/usr/bin/env python3
"""
Generate AI backgrounds for YouTube thumbnails using Gemini.
Uses structured prompt template from docs/thumbnail/PROMPT_TEMPLATE.md.
"""

import os
import sys
from pathlib import Path

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

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
NEWS_DIR = Path("video-pipeline/output/News")

BACKGROUNDS = [
    {
        "slug": "gpt-54-computer-use",
        "prompt": """[Format] YouTube thumbnail background (1280x720)
[Main Visual] A futuristic workspace — a sleek laptop with holographic AI interface projections floating above the screen. Glowing blue neural pathways and circuit board patterns in the air. A robotic hand reaching toward the keyboard.
[Background] Dark moody workspace, dramatic side lighting in electric blue and cyan
[Color Scheme] Deep navy (#0f172a), electric blue (#38bdf8), cyan accents
[Style] Concept

[Layout]
- Laptop and holographic elements fill the right 60% of frame
- Left 40% is darker, open space for text overlay
- Light source from the screen illuminates the scene

[Additional Instructions]
- Photo realistic, cinematic quality, 8K
- No text, no people, no words on screen
- High contrast, eye-catching for small display
- Leave clear dark space on left for text overlay
- Dramatic depth of field""",
    },
    {
        "slug": "amazon-16k-layoffs-ai",
        "prompt": """[Format] YouTube thumbnail background (1280x720)
[Main Visual] An empty corporate office floor — rows of vacant cubicles with pushed-back chairs, monitors still glowing. Emergency red warning lights mounted on the ceiling cast ominous shadows. A single cardboard box sits on one desk.
[Background] Dark corporate interior with dramatic red emergency lighting
[Color Scheme] Deep red (#dc2626), dark shadows, warm orange undertones
[Style] Concept

[Layout]
- Office scene fills the right 60% of frame
- Left side darker, open for text and person overlay
- Red lights create dramatic pools of light

[Additional Instructions]
- Photo realistic, cinematic quality
- No text, no people
- Ominous, unsettling atmosphere
- Corporate dystopia feel
- Strong red color cast throughout""",
    },
    {
        "slug": "mcp-97-million-installs",
        "prompt": """[Format] YouTube thumbnail background (1280x720)
[Main Visual] A vast 3D network visualization — thousands of glowing purple nodes connected by luminous data streams, like a neural network rendered in physical space. Geometric crystal structures floating at connection points.
[Background] Deep space-like void with violet and purple nebula glow
[Color Scheme] Deep purple (#1a1035), violet (#a78bfa), magenta accents
[Style] Concept

[Layout]
- Network fills the left 60% of frame
- Right side has softer glow, open for person overlay
- Depth creates a sense of massive scale

[Additional Instructions]
- Photo realistic, cinematic quality, 8K
- No text, no people
- Ethereal, vast, awe-inspiring scale
- Particles and light rays for atmosphere
- Dark enough that white text will be readable""",
    },
    {
        "slug": "owasp-agentic-top-10",
        "prompt": """[Format] YouTube thumbnail background (1280x720)
[Main Visual] A futuristic cybersecurity command center — massive curved screens showing threat maps and attack vectors in red. A glowing digital shield in the center being struck by red lightning bolts. Warning icons and lock symbols floating in the air.
[Background] Dark high-tech bunker interior with amber warning lights and red threat indicators
[Color Scheme] Amber/gold (#fbbf24), red (#ef4444), dark background
[Style] Concept

[Layout]
- Command center fills the entire frame
- Central shield element as focal point
- Screens and warnings create visual complexity
- Enough dark areas for text overlay on left side

[Additional Instructions]
- Photo realistic, cinematic quality, 8K
- No text, no people
- Tense, high-stakes atmosphere
- Warning/hazard aesthetic
- Mix of amber warning and red threat colors""",
    },
    {
        "slug": "openai-852-billion-valuation",
        "prompt": """[Format] YouTube thumbnail background (1280x720)
[Main Visual] A treasure vault scene — mountains of gold bars stacked high, gold coins scattered on the floor, with a holographic green stock chart rising dramatically overhead. Beams of emerald green light stream through the vault from above.
[Background] Dark vault interior with dramatic green and gold lighting
[Color Scheme] Emerald green (#34d399), gold (#fbbf24), dark shadows
[Style] Concept

[Layout]
- Gold and chart elements fill the right 65% of frame
- Left side darker, open for person overlay
- Green chart rising upward creates energy and direction
- Gold bars create a base layer of visual richness

[Additional Instructions]
- Photo realistic, cinematic quality, 8K
- No text, no people
- Wealth, power, epic scale
- Green light dominates the color palette
- Premium, luxurious atmosphere""",
    },
    {
        "slug": "perplexity-450m-arr",
        "prompt": """[Format] YouTube thumbnail background (1280x720)
[Main Visual] A futuristic AI search interface rendered in 3D — holographic search result cards floating in teal-lit space, data streams flowing between them. A central glowing orb processes information, with search queries materializing as light beams.
[Background] Deep dark space with teal and cyan ambient glow
[Color Scheme] Teal (#2dd4bf), cyan (#22d3ee), dark background (#0a1a1a)
[Style] Concept

[Layout]
- Search interface elements spread across the full frame
- Central processing orb as focal point
- Floating cards create depth layers
- Dark areas in left and bottom for text overlay

[Additional Instructions]
- Photo realistic, cinematic quality, 8K
- No text, no people, no readable text on the search cards
- Futuristic, clean, sophisticated
- Sense of speed and intelligence
- Teal as dominant color""",
    },
    {
        "slug": "242-billion-ai-investment-q1",
        "prompt": """[Format] YouTube thumbnail background (1280x720)
[Main Visual] A massive vault door swinging open, revealing mountains of gold coins and bars with dramatic golden light flooding outward. Money and gold particles floating in the air, caught in the light beams.
[Background] Dark stone vault exterior, warm golden light streaming from the opening
[Color Scheme] Gold (#fbbf24), amber (#d97706), deep shadows
[Style] Concept

[Layout]
- Vault door and gold fill the left 60% of frame
- Right side catches golden light, open for person overlay
- Light streams create dramatic god-rays
- Sense of overwhelming wealth and scale

[Additional Instructions]
- Photo realistic, cinematic quality, 8K
- No text, no people
- Epic, cinematic scale
- Warm golden color dominates
- Treasure/wealth aesthetic""",
    },
    {
        "slug": "meta-muse-spark",
        "prompt": """[Format] YouTube thumbnail background (1280x720)
[Main Visual] A massive data center being rebuilt — construction cranes and scaffolding around glowing server racks. Electric blue sparks and energy arcs flying as new systems come online. Holographic blueprints of AI architecture floating in the air.
[Background] Dark industrial interior with dramatic blue (#1d4ed8) energy bursts
[Color Scheme] Meta blue (#1877F2), electric blue, white sparks, dark shadows
[Style] Concept

[Layout]
- Construction scene fills the entire frame
- Central energy burst as focal point
- Cranes and scaffolding frame the edges
- Dark areas for text overlay on both sides

[Additional Instructions]
- Photo realistic, cinematic quality, 8K
- No text, no people
- Industrial power meets futuristic AI
- Dramatic blue is the dominant color
- Sense of massive construction and transformation""",
    },
    {
        "slug": "vibe-coding-92-percent",
        "prompt": """[Format] YouTube thumbnail background (1280x720)
[Main Visual] A dramatic split-screen scene — left side shows clean, beautiful code on monitors bathed in green light with "SUCCESS" indicators, right side shows the same code but corrupted with red security warnings, error alerts, and bug icons. A lightning bolt or crack divides the two sides.
[Background] Left: dark with green glow. Right: dark with red glow.
[Color Scheme] Left: Green (#34d399), Right: Red (#ef4444), divider: bright white/yellow
[Style] Comparison

[Layout]
- Clear left/right split
- Left side (40%): Clean, successful code, green
- Right side (60%): Corrupted, dangerous code, red
- Dramatic divider down the center
- Left side also open for person overlay

[Additional Instructions]
- Photo realistic, cinematic quality, 8K
- No text, no people
- Dramatic tension between success and danger
- Code on screens should be blurry/abstract, not readable
- The split should feel dramatic, not subtle""",
    },
    {
        "slug": "chatgpt-super-app",
        "prompt": """[Format] YouTube thumbnail background (1280x720)
[Main Visual] A futuristic app ecosystem — multiple holographic windows floating in 3D space showing different capabilities: a code editor, a search interface, a presentation, a spreadsheet, a browser. All orbiting around a central glowing purple AI core/sphere.
[Background] Deep dark space with purple (#9333ea) and violet nebula glow
[Color Scheme] Purple (#c084fc), violet (#8b5cf6), dark background
[Style] Concept

[Layout]
- Central AI sphere in the middle
- App windows orbit around it in a ring
- Right side open for person overlay
- Left side darker, open for text

[Additional Instructions]
- Photo realistic, cinematic quality, 8K
- No text, no people, no readable text on the app windows
- Sense of convergence — many things becoming one
- Purple as dominant color
- Awe-inspiring, futuristic, powerful""",
    },
]


def generate_background(bg):
    slug = bg["slug"]
    out_path = NEWS_DIR / slug / "bg.jpg"
    print(f"Generating: {slug}...")

    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=[bg["prompt"]],
        config=types.GenerateContentConfig(
            response_modalities=["TEXT", "IMAGE"],
            image_config=types.ImageConfig(
                aspect_ratio="16:9",
                image_size="1K",
            ),
        ),
    )

    for part in response.parts:
        if part.inline_data:
            img = part.as_image()
            img.save(str(out_path))
            print(f"  ✓ {out_path}")
            return True

    print(f"  ✗ No image returned for {slug}")
    return False


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    targets = [b for b in BACKGROUNDS if b["slug"] == only] if only else BACKGROUNDS

    for bg in targets:
        try:
            generate_background(bg)
        except Exception as e:
            print(f"  ✗ {bg['slug']}: {e}")


if __name__ == "__main__":
    main()

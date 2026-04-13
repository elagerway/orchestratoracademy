#!/usr/bin/env python3
"""
Composite final thumbnails: AI background + Leo with gradient alpha blend.
Uses PIL for proper alpha masking — Leo's dark HeyGen bg fades into the AI background.
"""

import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

NEWS_DIR = Path("video-pipeline/output/News")

THUMBNAILS = [
    # (slug, leo_side, leo_width_pct)
    ("gpt-54-computer-use", "right", 45),
    ("amazon-16k-layoffs-ai", "left", 42),
    ("mcp-97-million-installs", "right", 40),
    ("owasp-agentic-top-10", None, 0),
    ("openai-852-billion-valuation", "left", 44),
    ("perplexity-450m-arr", None, 0),
    ("242-billion-ai-investment-q1", "right", 42),
    ("meta-muse-spark", None, 0),
    ("vibe-coding-92-percent", "left", 44),
    ("chatgpt-super-app", "right", 42),
]

W, H = 1280, 720


def create_gradient_mask(width, height, side, fade_pct=0.35):
    """Create a gradient alpha mask that fades Leo into the background."""
    mask = Image.new("L", (width, height), 0)
    pixels = np.zeros((height, width), dtype=np.uint8)

    fade_start = int(width * (1 - fade_pct)) if side == "left" else 0
    fade_end = width if side == "left" else int(width * fade_pct)
    solid_zone = int(width * 0.55)

    for x in range(width):
        if side == "left":
            if x < solid_zone:
                alpha = 255
            elif x < width:
                alpha = int(255 * (1 - (x - solid_zone) / (width - solid_zone)))
            else:
                alpha = 0
        else:  # right
            mirror_x = width - x
            if mirror_x < solid_zone:
                alpha = 255
            elif mirror_x < width:
                alpha = int(255 * (1 - (mirror_x - solid_zone) / (width - solid_zone)))
            else:
                alpha = 0
        pixels[:, x] = alpha

    mask = Image.fromarray(pixels, mode="L")
    # Slight blur for smoother transition
    mask = mask.filter(ImageFilter.GaussianBlur(radius=8))
    return mask


def composite(slug, leo_side, leo_pct):
    bg_path = NEWS_DIR / slug / "bg.jpg"
    leo_path = NEWS_DIR / slug / "leo-expressive.jpg"
    out_path = NEWS_DIR / slug / "thumb-base.png"

    if not bg_path.exists():
        print(f"  ✗ Missing bg.jpg for {slug}")
        return

    # Load and resize background
    bg = Image.open(bg_path).convert("RGB")
    bg_ratio = bg.width / bg.height
    target_ratio = W / H
    if bg_ratio > target_ratio:
        new_h = H
        new_w = int(H * bg_ratio)
    else:
        new_w = W
        new_h = int(W / bg_ratio)
    bg = bg.resize((new_w, new_h), Image.LANCZOS)
    # Center crop
    left = (new_w - W) // 2
    top = (new_h - H) // 2
    bg = bg.crop((left, top, left + W, top + H))

    if leo_side is None:
        bg.save(str(out_path))
        print(f"  ✓ {slug} (no Leo)")
        return

    if not leo_path.exists():
        print(f"  ✗ Missing leo-expressive.jpg for {slug}")
        return

    # Load Leo, scale to full height
    leo = Image.open(leo_path).convert("RGB")
    leo_scale = H / leo.height
    leo = leo.resize((int(leo.width * leo_scale), H), Image.LANCZOS)

    # Crop Leo to desired width (center crop on face)
    leo_target_w = int(W * leo_pct / 100)
    if leo.width > leo_target_w:
        crop_x = (leo.width - leo_target_w) // 2
        leo = leo.crop((crop_x, 0, crop_x + leo_target_w, H))
    else:
        leo_target_w = leo.width

    # Create gradient mask
    mask = create_gradient_mask(leo_target_w, H, leo_side)

    # Convert Leo to RGBA with gradient mask
    leo_rgba = leo.convert("RGBA")
    leo_rgba.putalpha(mask)

    # Paste Leo onto background
    if leo_side == "left":
        bg.paste(leo, (0, 0), leo_rgba)
    else:
        x = W - leo_target_w
        bg.paste(leo, (x, 0), leo_rgba)

    bg.save(str(out_path))
    print(f"  ✓ {slug} (Leo {leo_side}, {leo_target_w}px)")


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for slug, side, pct in THUMBNAILS:
        if only and slug != only:
            continue
        composite(slug, side, pct)

if __name__ == "__main__":
    main()

Optimize an image for web delivery. Resizes and compresses to appropriate dimensions and file size.

## Usage
/optimize-image <source-path> [max-width]

- source-path: Path to the image file (required)
- max-width: Maximum width in pixels (default: 1200)

## Process
1. Read the source image dimensions
2. Resize to max-width (preserving aspect ratio) if wider
3. Convert to JPEG at quality 80
4. Overwrite the original file with the optimized version
5. Report: original size, new size, dimensions, savings

## Target Specs
- Course hero images: 1200px wide, JPEG quality 80 (~100-200KB)
- Lesson thumbnails: 850px wide, JPEG quality 80 (~50-100KB)
- Any web image should be under 300KB

## Implementation
Use Python with Pillow:

```python
from PIL import Image
import os, sys

source = "$ARGUMENTS".split()[0] if "$ARGUMENTS" else None
max_width = int("$ARGUMENTS".split()[1]) if len("$ARGUMENTS".split()) > 1 else 1200

img = Image.open(source)
original_size = os.path.getsize(source)

# Resize if wider than max
if img.width > max_width:
    ratio = max_width / img.width
    new_height = int(img.height * ratio)
    img = img.resize((max_width, new_height), Image.LANCZOS)

# Convert to RGB (drop alpha if PNG)
if img.mode in ('RGBA', 'P'):
    img = img.convert('RGB')

# Save as JPEG quality 80
img.save(source, 'JPEG', quality=80, optimize=True)
new_size = os.path.getsize(source)

print(f"Optimized: {source}")
print(f"  {original_size//1024}KB → {new_size//1024}KB ({100 - (new_size*100//original_size)}% smaller)")
print(f"  Dimensions: {img.width}x{img.height}")
```

Run this on every image before committing to the repo.

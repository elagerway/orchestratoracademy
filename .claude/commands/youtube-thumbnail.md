# YouTube Thumbnail Creation Guide

## Overview

| Item | Value |
|------|-------|
| Tool | AI Image Generation (Gemini/GPT-4) + Puppeteer |
| Size | 1280x720px (16:9) |
| Format | JPG/PNG |
| Goal | Maximize click-through rate (CTR) |

---

## Core Principles for Clickable Thumbnails

```
1. Visibility — Content must be clear even at small sizes
2. Emotion — Trigger an emotional response in the viewer
3. Curiosity — Make them NEED to click
4. Consistency — Maintain channel brand identity
5. Differentiation — Stand out from competitors
```

### What to AVOID

```
❌ Too much text (unreadable at small size)
❌ Dull colors (won't stand out)
❌ Small faces (emotion doesn't come through)
❌ Cluttered layout (unclear what the video is about)
❌ Clickbait (thumbnail doesn't match content)
```

---

## Thumbnail Layout Patterns

### Pattern 1: Face Focus

```
┌─────────────────────────────────┐
│                                 │
│  ┌─────┐                       │
│  │Face │    BIG TEXT            │
│  │Expr.│    Catchphrase         │
│  └─────┘                       │
│                                 │
└─────────────────────────────────┘

Features:
- Face takes up 40-50% of frame
- Strong expression (surprise, joy, concern)
- Text on the opposite side
```

### Pattern 2: Before / After

```
┌─────────────────────────────────┐
│                                 │
│  Before    →    After           │
│  ┌────┐        ┌────┐          │
│  │ 😢 │        │ 😄 │          │
│  └────┘        └────┘          │
│                                 │
└─────────────────────────────────┘

Features:
- Transformation is obvious at a glance
- Arrows or contrast to guide the eye
- Numbers make it more effective
```

### Pattern 3: Text-Dominant

```
┌─────────────────────────────────┐
│                                 │
│      [SHOCKING]                 │
│    If you don't know this       │
│      you're losing out          │
│                                 │
└─────────────────────────────────┘

Features:
- Large bold text
- 3 lines maximum
- Simple or gradient background
```

### Pattern 4: Number Impact

```
┌─────────────────────────────────┐
│                                 │
│        Revenue                  │
│       $1,000,000                │
│     How I Did It                │
│                                 │
└─────────────────────────────────┘

Features:
- Numbers are the largest element
- Include units (%, $, M, B)
- Be specific — vague doesn't click
```

---

## AI Image Generation Prompts

### Person/Face Thumbnail

```
Create a YouTube thumbnail image.

Subject: [male/female] in [age]s
Expression: [Surprised/Shocked/Happy/Confused/Determined]
- Large, expressive face taking up 40-50% of frame
- Direct eye contact with camera
- [Specific expression details]

Background:
- [Solid color gradient / Blurred office / Abstract]
- High contrast with subject

Composition:
- Subject on [left/right] third
- Space for text on [opposite side]
- Clean, uncluttered

Style:
- High contrast, saturated colors
- Professional quality
- Eye-catching for small display

Technical:
- Size: 1280x720px
- No text in image
- Leave space for text overlay
```

### Before/After Thumbnail

```
Create a YouTube thumbnail showing transformation.

Split composition:
LEFT SIDE (Before):
- [Negative state description]
- Darker, desaturated colors
- Tired/frustrated expression

RIGHT SIDE (After):
- [Positive state description]
- Bright, vibrant colors
- Happy/successful expression

Divider:
- Clear visual separation (line or gradient)
- Arrow or transformation indicator space

Same person in both sides for authenticity.

Style:
- High contrast between before/after
- Dramatic lighting difference

Size: 1280x720px
No text - leave space for "Before/After" labels.
```

### Background Only (No People)

```
Create a YouTube thumbnail background (no people).

Style: [choose one]
□ Gradient — Blue to purple, modern tech feel
□ Office — Blurred modern workspace
□ Abstract — Geometric shapes, vibrant colors
□ Money/Success — Coins, graphs, luxury items
□ Problem — Dark, concerning atmosphere

Requirements:
- Space for subject on [left/right]
- Space for text on [opposite side]
- High contrast, eye-catching
- Not too busy or distracting

Size: 1280x720px
No text or people.
```

### Icon/Element Generation

```
Create a simple icon for YouTube thumbnail.

Icon type: [choose one]
□ Arrow (pointing up/right)
□ Checkmark (success)
□ X mark (wrong/avoid)
□ Question mark (curiosity)
□ Exclamation mark (important)
□ Money symbol ($)
□ Graph (growth)

Style:
- Bold, simple design
- Single color: [#22C55E green / #EF4444 red / #FBBF24 yellow]
- Clean edges
- Works at small size

Size: 500x500px
Transparent background (PNG).
```

---

## Color Palettes (High CTR)

| Combo | Background | Text | Accent | Impression |
|-------|-----------|------|--------|-----------|
| Trust / Business | #1E3A5F (navy) | #FFFFFF (white) | #22C55E (green) | Professional |
| Urgent / Important | #DC2626 (red) | #FFFFFF (white) | #FBBF24 (yellow) | Attention / Warning |
| Success / Money | #065F46 (deep green) | #FBBF24 (gold) | #FFFFFF (white) | Wealth / Achievement |
| Energy | #F97316 (orange) | #FFFFFF (white) | #1E3A5F (navy) | Action / Momentum |
| Cool / Tech | #7C3AED (purple) | #FFFFFF (white) | #22D3EE (cyan) | Innovation / Future |

### Colors to AVOID

```
❌ Pastels (don't stand out)
❌ Similar color combos (no contrast)
❌ Browns (look dated)
❌ Solid gray (boring)
```

---

## Text Overlay Rules

### Font Selection

| Use | Recommended Font | Why |
|-----|-----------------|-----|
| Main copy | Sora Black / Inter Black | Bold, high visibility |
| Impact numbers | Impact / Bebas Neue | Numbers pop |
| Subtext | Sora Medium / Inter Medium | Clean, readable |

### Text Layout Rules

```
【3 lines max】
- Line 1: Hook (largest)
- Line 2: Sub-copy
- Line 3: Supporting detail (smallest)

【Font size guide】
- Main copy: 72-120pt
- Sub-copy: 48-72pt
- Supporting: 36-48pt

【Decoration】
- Outline: Black 4-8px stroke (on white text)
- Shadow: Drop shadow (subtle)
- Background: Semi-transparent band (if needed for readability)
```

### Effective Copy Formulas

```
【Number-driven】
"$852 Billion" · "97 Million" · "In Just 3 Days" · "5 Ways"

【Question-driven】
"Why Does __ Fail?" · "Did You Know?" · "Still Doing __?"

【Negative-driven】
"Never Do This" · "Actually Wrong" · "You're Losing Money"

【Urgency-driven】
"BREAKING" · "JUST ANNOUNCED" · "Before It's Too Late"

【Authority-driven】
"Complete Guide" · "Pro Breakdown" · "Deep Comparison"
```

---

## Production Workflow

### Step 1: Plan (5 min)

```
1. Summarize the video in ONE phrase
2. Define the target viewer
3. Choose a thumbnail pattern (face / before-after / text / number)
4. Pick the key number or keyword
```

### Step 2: Generate Base Image (10 min)

```
1. Generate base image with AI (Gemini / GPT-4)
2. Generate multiple variations
3. Pick the strongest one
4. Generate additional elements if needed (icons, backgrounds)
```

### Step 3: Add Text (10 min)

```
1. Load base image into Puppeteer/Canva
2. Place text (3 lines max)
3. Adjust font, color, size
4. Add outline + shadow
5. Check balance
```

### Step 4: Verify & Export (5 min)

```
1. Preview at small size (120x68px) — can you read it?
2. Check how it looks on mobile
3. Compare side-by-side with competitor thumbnails
4. Export at 1280x720px, JPG or PNG
```

---

## A/B Testing

### What to Test

```
□ Expression (surprise vs smile)
□ Color temperature (warm vs cool)
□ Copy style (question vs statement)
□ Layout (person left vs person right)
□ With vs without numbers
```

### Metrics

```
CTR targets:
- New channel: 4-6%
- Growing channel: 6-10%
- Established channel: 10%+

Improvement cycle:
1. Create 2 variations
2. Check CTR after 48 hours
3. Keep the winner
4. Test a new variation against it
```

---

## Quality Checklist

```
□ Content is clear at 120x68px (tiny size)
□ You can tell what the video is about in 3 seconds
□ Face expression is clearly visible (if using a face)
□ Text is readable
□ Background is NOT cluttered
□ Color contrast is strong
□ Consistent with other channel thumbnails
□ NOT clickbait (matches actual content)
□ Stands out from competitors
□ Verified on mobile
```

---

## OA-Specific Rules

For Orchestrator Academy news thumbnails:

1. **Every thumbnail in a batch must look visually distinct** — vary Leo placement, layout, bg color, accent
2. **Leo placement rotation:** Some left, some right, some with NO Leo
3. **Key stat is the hero element** — largest text, accent color, 120-200px
4. **Outlined text** — thick black stroke on white/colored text for depth
5. **Colored glow behind Leo** — radial gradient matching the accent color
6. **Bold color blocks** — full-height accent bars, split backgrounds, warning stripes
7. **Generate via:** `node video-pipeline/scripts/news-thumbnail.mjs`
8. **Upload via:** `node video-pipeline/scripts/update-thumbnails.mjs`

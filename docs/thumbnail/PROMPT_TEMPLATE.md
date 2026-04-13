# Thumbnail Prompt Template

## Base Structure

```
[Format] {platform} thumbnail ({size})
[Title Text] {title}
[Main Visual] {main_visual}
[Background] {background}
[Color Scheme] {color_scheme}
[Style] {style}

[Layout]
{layout_description}

[Text Placement]
{text_placement}

[Additional Instructions]
- Design for click-through rate (CTR)
- Text should be large and readable
- High contrast for visibility
{additional_notes}
```

---

## Style-Specific Templates

### Text-Dominant

```
[Format] {platform} thumbnail ({size})
[Title Text] {title} (placed large in center of image)
[Main Visual] Text is the hero element
[Background] {background_color} gradient, simple
[Color Scheme] High contrast between {main_color} and {accent_color}
[Style] Text-dominant

[Layout]
- Main title centered
- Subtitle above or below
- Minimal decoration

[Text Placement]
- Main title: Center of image, heavy sans-serif
- Subtitle: Below main, slightly smaller
- Add shadow or outline to text

[Additional Instructions]
- Design for CTR
- Text must be large and readable
- Plenty of whitespace
```

### Person / Character

> **Note**: When using an existing character, attach the base illustration during image generation.

#### Using Existing Character
```
[Format] {platform} thumbnail ({size})
[Title Text] {title}
[Main Visual] Character from attached image
[Background] White (solid, simple)
[Color Scheme] White background, black text, preserve character's original colors
[Style] Person / Character

[Character Instructions]
- Use the character from the attached image as-is
- Maintain art style, touch, and colors
- Change the pose from the original — randomly choose from:
  - Sleeping, running, trying hard, flying, surprised, happy, thinking, waving, etc.

[Layout]
- Character at bottom center
  - Character centered on the horizontal axis
- Title text from top to middle center
- Minimal decoration, clean and simple

[Text Placement]
- Main title: Top center, heavy sans-serif, black, large
- Below main title: hand-drawn style rough underline (thick marker-style line in accent color for emphasis)
- Subtitle: Below main, slightly smaller, black
- Small gap between subtitle and main title
- Simple, readable font

[Additional Instructions]
- Design for CTR
- Faithfully reproduce the attached character's art style and colors
- Simple, clean design
- No unnecessary decoration
- Pay attention to text/character placement, alignment, font size, and balance — keep layout evenly distributed
```

#### Creating New Character
```
[Format] {platform} thumbnail ({size})
[Title Text] {title}
[Main Visual] {character_description}
[Background] {background}, colors that make the character stand out
[Color Scheme] {color_scheme}
[Style] Person / Character

[Layout]
- Character on left or right side (60%)
- Text on opposite side (40%)
- Character's gaze directed toward the text

[Text Placement]
- Title: Opposite side from character, bold
- Subtext: Below title
- Add text backing for readability

[Additional Instructions]
- Design for CTR
- Make character's expression engaging
- Balance between text and character
```

### Concept

```
[Format] {platform} thumbnail ({size})
[Title Text] {title}
[Main Visual] {concept_visual} (abstract graphic)
[Background] {background}
[Color Scheme] {color_scheme}, leverage brand colors
[Style] Concept

[Layout]
- Graphical elements centered
- Title at top or bottom
- Use icons and symbols effectively

[Text Placement]
- Title: Top or bottom of image
- Positioned to not obstruct the graphic
- Readable font size

[Additional Instructions]
- Design for CTR
- Even abstract visuals should convey the content
- Modern, clean design
```

### Comparison

```
[Format] {platform} thumbnail ({size})
[Title Text] {title} ({item_a} vs {item_b})
[Main Visual] Left/right contrast layout
[Background] Color-split left and right
[Color Scheme] {color_a} (left) vs {color_b} (right) for contrast
[Style] Comparison

[Layout]
- Left side: {item_a} visual
- Right side: {item_b} visual
- Center: "VS" or contrast indicator
- Title at top

[Text Placement]
- Title: Top center of image
- Item names: Placed on their respective sides
- VS mark: Large, centered

[Additional Instructions]
- Design for CTR
- Contrast must be obvious at a glance
- Clearly express the differences between both sides
```

---

## Platform-Specific Notes

### YouTube
- Design for mobile display (readable even when small)
- Avoid bottom-right corner (timestamp overlay)
- Account for the play button in the center

### Blog
- Consider how it looks as an SNS share preview
- Will be used as an OGP image
- Edges may get cropped — keep important content centered

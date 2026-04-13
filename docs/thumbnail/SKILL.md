---
name: creating-thumbnails
description: Generates Nano Banana Pro (Gemini) prompts for blog and YouTube thumbnail images. Use when user mentions "thumbnail", "YouTube image", "blog image", or "create thumbnail".
---

# Thumbnail Image Creation

## Workflow

1. **Check ideas**: Review `progress/ideas.md` for matching ideas and suggest them
2. **Confirm platform**:
   - Blog: 1200x630 (OGP)
   - YouTube: 1280x720 (16:9)
3. **Confirm content**: Title (20 characters or fewer recommended), theme
4. **Select style**:
   - Text-dominant
   - Person / Character
   - Concept
   - Comparison
5. **Character check** (for person/character style):
   - Using existing character → Include note to "attach base image when using image generation AI"
   - New character → Include character details in the prompt
6. **Anti-AI-look options**: See [ANTI_AI_STYLE.md](../ANTI_AI_STYLE.md)
   - Confirm whether to include "flat color fills" and "deformed/stylized forms"
7. **Generate prompt**: Use PROMPT_TEMPLATE.md
8. **Save deliverables**:
   - Prompt: `output/thumbnail/{title}.md` (create directory if needed)
   - Generated image: `output/thumbnail/images/{title}.png`
9. **Update progress**: Update `progress/ideas.md` (check off completed ideas)

## Reference Files

- [FORMATS.md](FORMATS.md): Format definitions
- [PROMPT_TEMPLATE.md](PROMPT_TEMPLATE.md): Templates
- [EXAMPLES.md](EXAMPLES.md): Samples

## Required Rules

- High-contrast color schemes
- Design for click-through rate (CTR)
- Text must be readable at small sizes

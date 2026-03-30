import React from "react";
import { Composition, staticFile } from "remotion";
import { ModuleVideo, type ModuleVideoProps } from "./compositions/ModuleVideo";

export const Root: React.FC = () => {
  // Each segment uses a unique HeyGen video — no reuse
  // PIP videos are separate from full-screen talking heads
  // All lip-synced to their specific scripts via ElevenLabs + HeyGen
  const defaultProps: ModuleVideoProps = {
    segments: [
      // 1. Leo introduces the module (full screen)
      {
        type: "talking-head",
        durationInFrames: Math.round(21.6 * 30), // 21.6s
        src: staticFile("intro.mp4"),
      },
      // 2. PRD generation — human instructs, agent outputs full PRD
      //    Leo narrates in PIP with lip-synced voiceover1.mp4
      {
        type: "code-screen",
        durationInFrames: Math.round(25.5 * 30), // match voiceover1 duration
        pipSrc: staticFile("voiceover1.mp4"),
        lines: [
          { type: "command", text: '$ claude "I want to build a customer support app. It should classify incoming tickets, pull relevant docs from a knowledge base, and draft personalized responses. Create a PRD for this."' },
          { type: "output", text: "" },
          { type: "output", text: "# Product Requirements Document" },
          { type: "output", text: "## Customer Support Orchestration App" },
          { type: "output", text: "" },
          { type: "output", text: "### Overview" },
          { type: "output", text: "An AI-powered customer support system that automatically" },
          { type: "output", text: "classifies, researches, and responds to support tickets" },
          { type: "output", text: "with minimal human intervention." },
          { type: "output", text: "" },
          { type: "output", text: "### Core Features" },
          { type: "output", text: "1. Ticket Classification Engine" },
          { type: "output", text: "   - Auto-categorize: billing, shipping, product, complaint" },
          { type: "output", text: "   - Confidence scoring with human escalation threshold" },
          { type: "output", text: "   - Priority detection (urgent vs standard)" },
          { type: "output", text: "" },
          { type: "output", text: "2. Knowledge Base Retrieval" },
          { type: "output", text: "   - RAG pipeline searching help docs + order history" },
          { type: "output", text: "   - Semantic search with relevance ranking" },
          { type: "output", text: "   - Customer context enrichment" },
          { type: "output", text: "" },
          { type: "output", text: "3. Response Generation" },
          { type: "output", text: "   - Draft personalized replies using retrieved context" },
          { type: "output", text: "   - Tone matching (formal, friendly, apologetic)" },
          { type: "output", text: "   - Human review queue before sending" },
          { type: "output", text: "" },
          { type: "output", text: "### Tech Stack" },
          { type: "output", text: "- Next.js + Supabase + Claude API" },
          { type: "output", text: "- Vector embeddings for knowledge search" },
          { type: "output", text: "" },
          { type: "output", text: "### Milestones" },
          { type: "output", text: "M1: Classification pipeline (Week 1)" },
          { type: "output", text: "M2: Knowledge retrieval (Week 2)" },
          { type: "output", text: "M3: Response generation + review UI (Week 3)" },
          { type: "output", text: "" },
          { type: "output", text: "✓ PRD saved to docs/prd.md" },
        ],
      },
      // 3. Leo transitions (full screen) — unique script
      {
        type: "talking-head",
        durationInFrames: Math.round(14.6 * 30), // 14.6s
        src: staticFile("transition.mp4"),
      },
      // 4. Agent builds from PRD — shows files being created, tests passing
      //    Leo narrates in PIP with lip-synced voiceover2.mp4
      {
        type: "code-screen",
        durationInFrames: Math.round(16.0 * 30), // match voiceover2 duration
        pipSrc: staticFile("voiceover2.mp4"),
        lines: [
          { type: "command", text: '$ claude "Now build Milestone 1 from the PRD — the ticket classification pipeline"' },
          { type: "output", text: "" },
          { type: "output", text: "Reading PRD from docs/prd.md..." },
          { type: "output", text: "Planning Milestone 1: Classification Pipeline" },
          { type: "output", text: "" },
          { type: "output", text: "Creating files:" },
          { type: "output", text: "  ✓ src/lib/classify.ts" },
          { type: "output", text: "  ✓ src/app/api/tickets/route.ts" },
          { type: "output", text: "  ✓ supabase/migrations/001_tickets.sql" },
          { type: "output", text: "  ✓ src/app/dashboard/tickets/page.tsx" },
          { type: "output", text: "" },
          { type: "output", text: "Running tests..." },
          { type: "output", text: "  ✓ classify('My order is late') → SHIPPING (98%)" },
          { type: "output", text: "  ✓ classify('Wrong item received') → PRODUCT (95%)" },
          { type: "output", text: "  ✓ classify('Refund request') → BILLING (97%)" },
          { type: "output", text: "  ✓ classify('This is unacceptable') → COMPLAINT (91%)" },
          { type: "output", text: "" },
          { type: "output", text: "All 4 tests passed. Pipeline ready." },
          { type: "output", text: "" },
          { type: "output", text: "✓ Milestone 1 complete — ready for your review" },
        ],
      },
      // 5. Leo outro (full screen) — unique script
      {
        type: "talking-head",
        durationInFrames: Math.round(16.9 * 30), // 16.9s
        src: staticFile("outro.mp4"),
      },
    ],
    transitionDurationInFrames: 20,
  };

  const totalDuration = defaultProps.segments.reduce(
    (sum, s) => sum + s.durationInFrames,
    0
  );

  return (
    <Composition
      id="ModuleVideo"
      component={ModuleVideo}
      durationInFrames={totalDuration}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={defaultProps}
    />
  );
};

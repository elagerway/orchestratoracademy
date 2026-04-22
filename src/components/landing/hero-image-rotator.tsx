"use client";

import { useMemo } from "react";
import Image from "next/image";

const images = [
  { src: "/images/courses/foundations.jpg", alt: "AI Orchestration Foundations" },
  { src: "/images/courses/crewai.jpg", alt: "CrewAI Multi-Agent Systems" },
  { src: "/images/courses/langgraph.jpg", alt: "LangGraph Workflows" },
  { src: "/images/courses/magpipe.jpg", alt: "AI Voice Agents" },
  { src: "/images/courses/context-memory.jpg", alt: "Context & Memory" },
  { src: "/images/courses/paperclip.jpg", alt: "Paperclip A2A" },
  { src: "/images/courses/security.jpg", alt: "AI Security" },
  { src: "/images/courses/self-improving.jpg", alt: "Self-Improving Agents" },
  { src: "/images/courses/claude-code-superpowers.jpg", alt: "Claude Code Superpowers" },
  { src: "/images/courses/monitoring-self-healing.jpg", alt: "Application Monitoring & Self-Healing Systems" },
];

export function HeroImageRotator() {
  const image = useMemo(() => images[Math.floor(Math.random() * images.length)], []);

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/40 bg-white dark:bg-background dark:border-border/20">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-contain p-4 dark:invert dark:hue-rotate-180"
        priority
      />
    </div>
  );
}

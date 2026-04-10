"use client";

import { useState, useEffect } from "react";
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
];

export function HeroImageRotator() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/40 bg-white">
      {images.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-contain p-4"
            priority={i === 0}
          />
        </div>
      ))}
      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 bg-emerald-accent"
                : "w-1.5 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, useCurrentFrame, staticFile } from "remotion";

const FADE = 0.5;

interface Slide {
  name: string;
  subtitle: string;
  image: string;
  accentColor: string;
  appearAt: number;
  disappearAt: number;
}

const SLIDES: Slide[] = [
  {
    name: "CrewAI",
    subtitle: "Multi-agent teams with roles",
    image: "Module 3/Lesson 2/images/crewai.png",
    accentColor: "#f59e0b",
    appearAt: 0,
    disappearAt: 14,
  },
  {
    name: "LangGraph",
    subtitle: "Stateful workflows with branching logic",
    image: "Module 3/Lesson 2/images/langgraph.png",
    accentColor: "#3b82f6",
    appearAt: 14,
    disappearAt: 28,
  },
  {
    name: "LangChain",
    subtitle: "RAG and document retrieval",
    image: "Module 3/Lesson 2/images/langchain.png",
    accentColor: "#10b981",
    appearAt: 28,
    disappearAt: 40,
  },
  {
    name: "Magpipe",
    subtitle: "Voice, chat, and phone automation",
    image: "Module 3/Lesson 2/images/magpipe.png",
    accentColor: "#ef4444",
    appearAt: 40,
    disappearAt: 52,
  },
];

export const FrameworksGraphic: React.FC = () => {
  const frame = useCurrentFrame();
  const currentTime = frame / 25;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <Audio src={staticFile("Module 3/Lesson 2/voiceover-frameworks.mp3")} />

      {SLIDES.map((slide, i) => {
        const fadeIn = interpolate(currentTime, [slide.appearAt, slide.appearAt + FADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fadeOut = interpolate(currentTime, [slide.disappearAt - FADE, slide.disappearAt], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const opacity = Math.min(fadeIn, fadeOut);
        if (opacity <= 0) return null;

        return (
          <AbsoluteFill key={i} style={{ opacity }}>
            {/* Full-screen image */}
            <Img
              src={staticFile(slide.image)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {/* Name + subtitle overlay at bottom */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(transparent, rgba(15, 23, 42, 0.95))",
              padding: "60px 80px 40px",
            }}>
              <div style={{
                fontSize: 48,
                fontWeight: 800,
                color: slide.accentColor,
                fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif",
                marginBottom: 8,
              }}>{slide.name}</div>
              <div style={{
                fontSize: 28,
                color: "#94a3b8",
                fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif",
              }}>{slide.subtitle}</div>
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

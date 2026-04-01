import React from "react";
import { AbsoluteFill, Video, interpolate, useCurrentFrame, staticFile } from "remotion";

interface FrameworkCard {
  name: string;
  icon: string;
  bestFor: string;
  accentColor: string;
  bgGradient: string;
  appearAt: number;
  disappearAt: number;
}

const FRAMEWORKS: FrameworkCard[] = [
  {
    name: "CrewAI",
    icon: "👥",
    bestFor: "Multi-agent teams with roles",
    accentColor: "#d97706",
    bgGradient: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
    appearAt: 2,
    disappearAt: 16,
  },
  {
    name: "LangGraph",
    icon: "🔀",
    bestFor: "Stateful workflows, branching logic",
    accentColor: "#2563eb",
    bgGradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    appearAt: 16,
    disappearAt: 28,
  },
  {
    name: "LangChain",
    icon: "🔗",
    bestFor: "RAG, document retrieval",
    accentColor: "#059669",
    bgGradient: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
    appearAt: 28,
    disappearAt: 38,
  },
  {
    name: "Magpipe",
    icon: "📞",
    bestFor: "Voice, chat, phone automation",
    accentColor: "#dc2626",
    bgGradient: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
    appearAt: 38,
    disappearAt: 51,
  },
];

const FADE = 0.35;

export const FrameworksOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const currentTime = frame / 25;

  return (
    <AbsoluteFill>
      <Video
        src={staticFile("Module 3/Lesson 2/segment2.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 50,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {FRAMEWORKS.map((fw, i) => {
          const fadeIn = interpolate(currentTime, [fw.appearAt, fw.appearAt + FADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const fadeOut = interpolate(currentTime, [fw.disappearAt - FADE, fw.disappearAt], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const opacity = Math.min(fadeIn, fadeOut);
          if (opacity <= 0) return null;
          return (
            <div key={i} style={{ opacity }}>
              <div style={{
                background: fw.bgGradient, borderRadius: 14, padding: "16px 24px", width: 370,
                borderLeft: `5px solid ${fw.accentColor}`, boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 24 }}>{fw.icon}</span>
                  <span style={{ fontSize: 24, fontWeight: 800, color: fw.accentColor, fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif" }}>{fw.name}</span>
                </div>
                <div style={{ fontSize: 19, color: "#374151", fontWeight: 500, fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif" }}>{fw.bestFor}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

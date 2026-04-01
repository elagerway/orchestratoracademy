import React from "react";
import { AbsoluteFill, Video, interpolate, useCurrentFrame, staticFile } from "remotion";

const STEPS = [
  { label: "CrewAI → Role-based teams", icon: "👥", color: "#d97706", bg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)", appearAt: 3 },
  { label: "LangGraph → Stateful workflows", icon: "🔀", color: "#2563eb", bg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", appearAt: 6 },
  { label: "LangChain → Document retrieval", icon: "🔗", color: "#059669", bg: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)", appearAt: 9 },
  { label: "Magpipe → Voice & chat", icon: "📞", color: "#dc2626", bg: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)", appearAt: 12 },
];

const FADE_IN = 0.25;
const FADE_OUT_START = 18;
const FADE_OUT_END = 21;

export const OutroOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const currentTime = frame / 25;
  const fadeOut = interpolate(currentTime, [FADE_OUT_START, FADE_OUT_END], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Video src={staticFile("Module 3/Lesson 2/outro.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", top: 60, right: 60, display: "flex", flexDirection: "column", gap: 12, opacity: fadeOut }}>
        {STEPS.map((step, i) => {
          const fadeIn = interpolate(currentTime, [step.appearAt, step.appearAt + FADE_IN], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (fadeIn === 0) return null;
          return (
            <div key={i} style={{ opacity: fadeIn }}>
              <div style={{ background: step.bg, borderRadius: 12, padding: "10px 22px", borderLeft: `4px solid ${step.color}`, boxShadow: "0 4px 16px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>{step.icon}</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: step.color, fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif" }}>{step.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

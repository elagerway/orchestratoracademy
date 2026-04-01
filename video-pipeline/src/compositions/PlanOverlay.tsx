import React from "react";
import { AbsoluteFill, Video, interpolate, useCurrentFrame, staticFile } from "remotion";

interface Phase {
  label: string;
  details: string;
  icon: string;
  accentColor: string;
  bgGradient: string;
  appearAt: number;
}

const PHASES: Phase[] = [
  {
    label: "Days 1-14",
    details: "Complete foundations, experiment daily",
    icon: "🚀",
    accentColor: "#f59e0b",
    bgGradient: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
    appearAt: 2,
  },
  {
    label: "Days 15-45",
    details: "Advanced course + first project",
    icon: "🔧",
    accentColor: "#3b82f6",
    bgGradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    appearAt: 8,
  },
  {
    label: "Days 46-75",
    details: "Second course, second project, start writing",
    icon: "✍️",
    accentColor: "#8b5cf6",
    bgGradient: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
    appearAt: 14,
  },
  {
    label: "Days 76-90",
    details: "Polish portfolio, launch career",
    icon: "🎯",
    accentColor: "#10b981",
    bgGradient: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
    appearAt: 20,
  },
];

const FADE_IN = 0.3;
const FADE_OUT_START = 28;
const FADE_OUT_END = 31;

export const PlanOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const currentTime = frame / 25;

  const fadeOut = interpolate(
    currentTime,
    [FADE_OUT_START, FADE_OUT_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill>
      <Video
        src={staticFile("Module 2/Lesson 2/segment4.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          top: 50,
          right: 50,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          opacity: fadeOut,
        }}
      >
        {PHASES.map((phase, i) => {
          const fadeIn = interpolate(
            currentTime,
            [phase.appearAt, phase.appearAt + FADE_IN],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          if (fadeIn === 0) return null;

          return (
            <div key={i} style={{ opacity: fadeIn }}>
              <div
                style={{
                  background: phase.bgGradient,
                  borderRadius: 14,
                  padding: "16px 22px",
                  width: 360,
                  borderLeft: `5px solid ${phase.accentColor}`,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 26 }}>{phase.icon}</span>
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: phase.accentColor,
                      fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif",
                    }}
                  >
                    {phase.label}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 18,
                    color: "#4b5563",
                    marginTop: 6,
                    fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif",
                  }}
                >
                  {phase.details}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

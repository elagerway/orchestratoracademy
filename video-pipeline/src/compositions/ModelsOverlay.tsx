import React from "react";
import { AbsoluteFill, Video, interpolate, useCurrentFrame, staticFile } from "remotion";

interface ModelCard {
  name: string;
  icon: string;
  tiers: string;
  strength: string;
  accentColor: string;
  bgGradient: string;
  appearAt: number;
  disappearAt: number;
}

const MODELS: ModelCard[] = [
  {
    name: "Anthropic Claude",
    icon: "🟠",
    tiers: "Opus · Sonnet · Haiku",
    strength: "Reasoning, safety, 200K context",
    accentColor: "#d97706",
    bgGradient: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
    appearAt: 2,
    disappearAt: 16,
  },
  {
    name: "OpenAI GPT",
    icon: "🟢",
    tiers: "GPT-4o · GPT-4o-mini",
    strength: "Multimodal, largest ecosystem",
    accentColor: "#059669",
    bgGradient: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
    appearAt: 16,
    disappearAt: 24,
  },
  {
    name: "Google Gemini",
    icon: "🔵",
    tiers: "Ultra · Pro · Flash",
    strength: "Video processing, Google Cloud",
    accentColor: "#2563eb",
    bgGradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    appearAt: 24,
    disappearAt: 34,
  },
  {
    name: "Open Source",
    icon: "🟣",
    tiers: "Llama · Mistral · DeepSeek",
    strength: "Self-hosted, no API costs",
    accentColor: "#7c3aed",
    bgGradient: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
    appearAt: 34,
    disappearAt: 46,
  },
];

const FADE = 0.35;

export const ModelsOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const currentTime = frame / 25;

  return (
    <AbsoluteFill>
      <Video
        src={staticFile("Module 3/Lesson 1/segment2.mp4")}
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
        {MODELS.map((model, i) => {
          const fadeIn = interpolate(
            currentTime,
            [model.appearAt, model.appearAt + FADE],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const fadeOut = interpolate(
            currentTime,
            [model.disappearAt - FADE, model.disappearAt],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const opacity = Math.min(fadeIn, fadeOut);

          if (opacity <= 0) return null;

          return (
            <div key={i} style={{ opacity }}>
              <div
                style={{
                  background: model.bgGradient,
                  borderRadius: 14,
                  padding: "16px 24px",
                  width: 370,
                  borderLeft: `5px solid ${model.accentColor}`,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 24 }}>{model.icon}</span>
                  <span style={{
                    fontSize: 24, fontWeight: 800, color: model.accentColor,
                    fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif",
                  }}>{model.name}</span>
                </div>
                <div style={{
                  fontSize: 18, color: "#6b7280",
                  fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif",
                }}>{model.tiers}</div>
                <div style={{
                  fontSize: 19, color: "#374151", fontWeight: 600, marginTop: 6,
                  fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif",
                }}>{model.strength}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

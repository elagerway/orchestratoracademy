import React from "react";
import { AbsoluteFill, Video, Img, interpolate, useCurrentFrame, staticFile } from "remotion";

interface Card {
  title: string;
  icon: string;
  lines: string[];
  highlight: string;
  accentColor: string;
  bgGradient: string;
  appearAt: number;
  disappearAt: number;
}

const CARDS: Card[] = [
  {
    title: "Consulting",
    icon: "💼",
    lines: [
      "Sarah — Marketing Ops → Freelance",
      "3 clients in 6 months",
    ],
    highlight: "$5k/month per client",
    accentColor: "#10b981",
    bgGradient: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
    appearAt: 3,
    disappearAt: 22,
  },
  {
    title: "In-House",
    icon: "🏢",
    lines: [
      "Marcus — Business Analyst → AI Lead",
      "Built POC, proposed new role",
    ],
    highlight: "40% raise + $95k-$200k+",
    accentColor: "#6366f1",
    bgGradient: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
    appearAt: 22,
    disappearAt: 40,
  },
];

const FADE = 0.4;

const CardComponent: React.FC<{ card: Card; currentTime: number }> = ({ card, currentTime }) => {
  const fadeIn = interpolate(
    currentTime,
    [card.appearAt, card.appearAt + FADE],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const fadeOut = interpolate(
    currentTime,
    [card.disappearAt - FADE, card.disappearAt],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  if (opacity <= 0) return null;

  return (
    <div style={{ opacity }}>
      <div
        style={{
          background: card.bgGradient,
          borderRadius: 16,
          padding: "22px 28px",
          width: 360,
          borderLeft: `5px solid ${card.accentColor}`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <span style={{ fontSize: 30 }}>{card.icon}</span>
          <span
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: card.accentColor,
              fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif",
            }}
          >
            {card.title}
          </span>
        </div>
        {card.lines.map((line, i) => (
          <div
            key={i}
            style={{
              fontSize: 20,
              color: "#374151",
              lineHeight: 1.5,
              fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif",
            }}
          >
            {line}
          </div>
        ))}
        <div
          style={{
            marginTop: 12,
            fontSize: 22,
            fontWeight: 700,
            color: card.accentColor,
            fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif",
          }}
        >
          {card.highlight}
        </div>
      </div>
    </div>
  );
};

export const CareerPathsOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const currentTime = frame / 25;

  return (
    <AbsoluteFill>
      <Video
        src={staticFile("Module 2/Lesson 2/segment2.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          top: 70,
          right: 50,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {CARDS.map((card, i) => (
          <CardComponent key={i} card={card} currentTime={currentTime} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

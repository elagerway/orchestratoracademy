import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export interface OutroCard {
  label: string;
  icon: string;
  color: string;
  bg: string;
  appearAt: number;
}

export interface OutroCardsProps extends Record<string, unknown> {
  cards: OutroCard[];
  fadeOutStart: number;
  fadeOutEnd: number;
}

export const OutroCards: React.FC<OutroCardsProps> = ({ cards, fadeOutStart, fadeOutEnd }) => {
  const frame = useCurrentFrame();
  const currentTime = frame / 25;
  const FADE_IN = 0.25;
  const fadeOut = interpolate(currentTime, [fadeOutStart, fadeOutEnd], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div style={{ position: "absolute", top: 60, right: 60, display: "flex", flexDirection: "column", gap: 12, opacity: fadeOut }}>
        {cards.map((card, i) => {
          const fadeIn = interpolate(currentTime, [card.appearAt, card.appearAt + FADE_IN], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (fadeIn === 0) return null;
          return (
            <div key={i} style={{ opacity: fadeIn }}>
              <div style={{ background: card.bg, borderRadius: 12, padding: "10px 22px", borderLeft: `4px solid ${card.color}`, boxShadow: "0 4px 16px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>{card.icon}</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: card.color, fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif" }}>{card.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

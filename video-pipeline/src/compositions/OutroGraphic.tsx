import React from "react";
import { AbsoluteFill, Audio, interpolate, useCurrentFrame, staticFile } from "remotion";

/**
 * Full-screen outro graphic with key takeaways.
 * Standalone segment — no video background.
 */

interface Takeaway {
  label: string;
  icon: string;
  accentColor: string;
  bgGradient: string;
  appearAt: number;
}

export interface OutroGraphicProps extends Record<string, unknown> {
  takeaways: Takeaway[];
  title: string;
  audioSrc: string;
  fadeOutStart: number;
  fadeOutEnd: number;
}

export const OutroGraphic: React.FC<OutroGraphicProps> = ({
  takeaways,
  title,
  audioSrc,
  fadeOutStart,
  fadeOutEnd,
}) => {
  const frame = useCurrentFrame();
  const currentTime = frame / 25;
  const FADE_IN = 0.3;

  const globalFadeOut = interpolate(
    currentTime,
    [fadeOutStart, fadeOutEnd],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <Audio src={audioSrc} />

      <div style={{
        position: "absolute", top: 50, left: 0, right: 0, textAlign: "center",
        fontSize: 36, fontWeight: 800, color: "#e2e8f0",
        fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif",
      }}>
        {title}
      </div>

      <div style={{
        position: "absolute", top: 130, left: 0, right: 0, bottom: 50,
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 20, padding: "0 80px", opacity: globalFadeOut,
      }}>
        {takeaways.map((t, i) => {
          const fadeIn = interpolate(currentTime, [t.appearAt, t.appearAt + FADE_IN], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (fadeIn === 0) return null;
          return (
            <div key={i} style={{ opacity: fadeIn, width: 800 }}>
              <div style={{
                background: t.bgGradient, borderRadius: 16, padding: "20px 32px",
                borderLeft: `6px solid ${t.accentColor}`, boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
                display: "flex", alignItems: "center", gap: 16,
              }}>
                <span style={{ fontSize: 36 }}>{t.icon}</span>
                <span style={{
                  fontSize: 28, fontWeight: 700, color: t.accentColor,
                  fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif",
                }}>{t.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

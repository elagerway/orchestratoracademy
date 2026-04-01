import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export interface OverlayItem {
  label: string;
  sublabel?: string;
  icon: string;
  accentColor: string;
  bgGradient: string;
  appearAt: number;
  disappearAt?: number;
}

export interface TransparentOverlayProps extends Record<string, unknown> {
  items: OverlayItem[];
  fadeOutStart?: number;
  fadeOutEnd?: number;
}

export const TransparentOverlay: React.FC<TransparentOverlayProps> = ({
  items,
  fadeOutStart,
  fadeOutEnd,
}) => {
  const frame = useCurrentFrame();
  const currentTime = frame / 25;
  const FADE_IN = 0.3;

  const hasFadeOut = fadeOutStart !== undefined && fadeOutEnd !== undefined;
  const globalFadeOut = hasFadeOut
    ? interpolate(currentTime, [fadeOutStart!, fadeOutEnd!], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 50,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          opacity: globalFadeOut,
        }}
      >
        {items.map((item, i) => {
          const fadeIn = interpolate(
            currentTime,
            [item.appearAt, item.appearAt + FADE_IN],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const fadeOut = item.disappearAt
            ? interpolate(
                currentTime,
                [item.disappearAt - FADE_IN, item.disappearAt],
                [1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              )
            : 1;
          const opacity = Math.min(fadeIn, fadeOut);
          if (opacity <= 0) return null;

          return (
            <div key={i} style={{ opacity }}>
              <div
                style={{
                  background: item.bgGradient,
                  borderRadius: 14,
                  padding: item.sublabel ? "16px 24px" : "10px 22px",
                  width: 370,
                  borderLeft: `5px solid ${item.accentColor}`,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: item.sublabel ? 6 : 0 }}>
                  <span style={{ fontSize: 24 }}>{item.icon}</span>
                  <span style={{ fontSize: 24, fontWeight: 800, color: item.accentColor, fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
                    {item.label}
                  </span>
                </div>
                {item.sublabel && (
                  <div style={{ fontSize: 19, color: "#374151", fontWeight: 500, fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
                    {item.sublabel}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

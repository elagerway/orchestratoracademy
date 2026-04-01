import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const OverlayOnly: React.FC = () => {
  const frame = useCurrentFrame();
  const currentTime = frame / 25;
  
  const opacity = interpolate(currentTime, [1, 1.25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div style={{
        position: "absolute", top: 60, right: 60, opacity,
        background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
        borderRadius: 14, padding: "16px 24px", borderLeft: "5px solid #d97706",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: "#d97706" }}>Test Card</span>
      </div>
    </AbsoluteFill>
  );
};

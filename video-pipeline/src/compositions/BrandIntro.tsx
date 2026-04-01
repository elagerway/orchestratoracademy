import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, staticFile } from "remotion";

/**
 * 1.5-second branded intro: black background, OA icon fades in then out.
 * Prepended to every lesson video.
 */
export const BrandIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const currentTime = frame / 25;

  // Icon fades in 0-0.5s, holds 0.5-1.0s, fades out 1.0-1.5s
  const opacity = interpolate(
    currentTime,
    [0, 0.5, 1.0, 1.5],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}>
        {/* OA icon */}
        <div style={{
          width: 120,
          height: 120,
          borderRadius: 24,
          backgroundColor: "#171717",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 60px rgba(255,255,255,0.1)",
        }}>
          <span style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#ffffff",
            fontFamily: "'SF Pro Display', 'Helvetica Neue', system-ui, sans-serif",
            letterSpacing: -1,
          }}>OA</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import {
  AbsoluteFill,
  Video,
  interpolate,
  useCurrentFrame,
  staticFile,
} from "remotion";

export interface TalkingHeadProps {
  src: string;
  durationInFrames: number;
  transitionDurationInFrames?: number;
}

export const TalkingHead: React.FC<TalkingHeadProps> = ({
  src,
  durationInFrames,
  transitionDurationInFrames = 15,
}) => {
  const frame = useCurrentFrame();

  // Fade in over first N frames
  const fadeIn = interpolate(frame, [0, transitionDurationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out over last N frames
  const fadeOut = interpolate(
    frame,
    [
      durationInFrames - transitionDurationInFrames,
      durationInFrames,
    ],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const opacity = Math.min(fadeIn, fadeOut);

  const isPlaceholder = src.includes("placeholder");

  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor: "#0d1117",
      }}
    >
      {isPlaceholder ? (
        // Placeholder display when no real video URL is available
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 80,
              }}
            >
              🎙️
            </div>
            <div
              style={{
                color: "#ffffff",
                fontSize: 48,
                fontFamily: "system-ui, sans-serif",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              Talking Head Segment
            </div>
            <div
              style={{
                color: "#8892b0",
                fontSize: 28,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              HeyGen Avatar Video Placeholder
            </div>
          </div>
        </AbsoluteFill>
      ) : (
        <Video
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

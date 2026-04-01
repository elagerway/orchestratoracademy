import React from "react";
import { AbsoluteFill, Audio, Sequence, Video, interpolate, useCurrentFrame, staticFile } from "remotion";
import { CodeScreen, type CodeLine } from "../components/CodeScreen";

export interface TalkingHeadSegment {
  type: "talking-head";
  durationInFrames: number;
  src: string;
  audioUrl?: string;
}

export interface CodeScreenSegment {
  type: "code-screen";
  durationInFrames: number;
  lines: CodeLine[];
  voiceoverUrl?: string;
  pipSrc?: string; // Lip-synced talking head for PIP during code
}

export type VideoSegment = TalkingHeadSegment | CodeScreenSegment;

export interface ModuleVideoProps extends Record<string, unknown> {
  segments: VideoSegment[];
  transitionDurationInFrames?: number;
}

/**
 * PIP Talking Head — small video in bottom-right corner during code screens
 * Gives the feeling that Leo is still present, talking over the code
 */
const PipTalkingHead: React.FC<{
  src: string;
  opacity: number;
}> = ({ src, opacity }) => {
  const isPlaceholder = src.includes("placeholder");

  if (isPlaceholder || opacity === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        right: 40,
        width: 320,
        height: 180,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        border: "2px solid rgba(255,255,255,0.15)",
        opacity,
        zIndex: 10,
      }}
    >
      <Video src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
};

/**
 * Full-screen talking head with smooth scale transitions
 */
const FullTalkingHead: React.FC<{
  src: string;
  audioUrl?: string;
  durationInFrames: number;
  transitionFrames: number;
  isTransitioningToCode: boolean;
  isTransitioningFromCode: boolean;
}> = ({ src, audioUrl, durationInFrames, transitionFrames, isTransitioningToCode, isTransitioningFromCode }) => {
  const frame = useCurrentFrame();
  const isPlaceholder = src.includes("placeholder");

  // Fade in from code screen
  const fadeIn = isTransitioningFromCode
    ? interpolate(frame, [0, transitionFrames], [0, 1], { extrapolateRight: "clamp" })
    : 1;

  // Scale down and fade when transitioning to code screen
  const fadeOut = isTransitioningToCode
    ? interpolate(
        frame,
        [durationInFrames - transitionFrames * 2, durationInFrames],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 1;

  const scale = isTransitioningToCode
    ? interpolate(
        frame,
        [durationInFrames - transitionFrames * 2, durationInFrames],
        [1, 0.3],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : isTransitioningFromCode
    ? interpolate(frame, [0, transitionFrames], [0.3, 1], { extrapolateRight: "clamp" })
    : 1;

  const opacity = Math.min(fadeIn, fadeOut);

  if (isPlaceholder) {
    return (
      <AbsoluteFill
        style={{
          opacity,
          transform: `scale(${scale})`,
          backgroundColor: "#1a1a2e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", color: "white" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
          <div style={{ fontSize: 24, fontWeight: "bold" }}>Leo — Talking Head</div>
          <div style={{ fontSize: 16, color: "#888", marginTop: 8 }}>Avatar video will be placed here</div>
        </div>
      </AbsoluteFill>
    );
  }

  // Only apply transforms when actually transitioning — avoids jitter on static segments
  if (scale === 1 && opacity === 1) {
    return (
      <AbsoluteFill>
        <Video src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "bottom right",
      }}
    >
      <Video src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};

export const ModuleVideo: React.FC<ModuleVideoProps> = ({
  segments,
  transitionDurationInFrames = 20,
}) => {
  let currentFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0d1a" }}>
      {segments.map((segment, idx) => {
        const from = currentFrame;
        currentFrame += segment.durationInFrames;

        const nextSegment = segments[idx + 1];
        const prevSegment = segments[idx - 1];
        const isTransitioningToCode = nextSegment?.type === "code-screen";
        const isTransitioningFromCode = prevSegment?.type === "code-screen";

        return (
          <Sequence
            key={idx}
            from={from}
            durationInFrames={segment.durationInFrames}
            name={`${segment.type}-${idx}`}
          >
            {segment.type === "talking-head" ? (
              <FullTalkingHead
                src={segment.src}
                durationInFrames={segment.durationInFrames}
                transitionFrames={transitionDurationInFrames}
                isTransitioningToCode={isTransitioningToCode}
                isTransitioningFromCode={isTransitioningFromCode}
              />
            ) : (
              <>
                <CodeScreen
                  lines={segment.lines}
                  durationInFrames={segment.durationInFrames}
                  transitionDurationInFrames={transitionDurationInFrames}
                  voiceoverUrl={segment.voiceoverUrl}
                />
                {/* PIP: lip-synced Leo talking over the code */}
                {segment.pipSrc && (
                  <PipTalkingHead
                    src={segment.pipSrc}
                    opacity={1}
                  />
                )}
              </>
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

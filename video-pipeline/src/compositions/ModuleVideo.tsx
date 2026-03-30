import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TalkingHead } from "../components/TalkingHead";
import { CodeScreen, type CodeLine } from "../components/CodeScreen";

export interface TalkingHeadSegment {
  type: "talking-head";
  durationInFrames: number;
  src: string;
}

export interface CodeScreenSegment {
  type: "code-screen";
  durationInFrames: number;
  lines: CodeLine[];
  voiceoverUrl?: string;
}

export type VideoSegment = TalkingHeadSegment | CodeScreenSegment;

export interface ModuleVideoProps extends Record<string, unknown> {
  segments: VideoSegment[];
  transitionDurationInFrames?: number;
}

export const ModuleVideo: React.FC<ModuleVideoProps> = ({
  segments,
  transitionDurationInFrames = 15,
}) => {
  let currentFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0d1a" }}>
      {segments.map((segment, idx) => {
        const from = currentFrame;
        currentFrame += segment.durationInFrames;

        return (
          <Sequence
            key={idx}
            from={from}
            durationInFrames={segment.durationInFrames}
            name={`${segment.type}-${idx}`}
          >
            {segment.type === "talking-head" ? (
              <TalkingHead
                src={segment.src}
                durationInFrames={segment.durationInFrames}
                transitionDurationInFrames={transitionDurationInFrames}
              />
            ) : (
              <CodeScreen
                lines={segment.lines}
                voiceoverUrl={segment.voiceoverUrl}
                durationInFrames={segment.durationInFrames}
                transitionDurationInFrames={transitionDurationInFrames}
              />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CodeHighlighter } from "./CodeHighlighter";

export interface CodeLine {
  type: "command" | "output" | "comment";
  text: string;
  /** Delay in frames before this line starts typing */
  delay?: number;
}

export interface CodeScreenProps {
  lines: CodeLine[];
  voiceoverUrl?: string;
  durationInFrames: number;
  transitionDurationInFrames?: number;
}

const TERMINAL_BG = "#1a1a2e";
const TERMINAL_HEADER_BG = "#16213e";
const TERMINAL_BORDER = "#0f3460";

const LINE_COLORS: Record<CodeLine["type"], string> = {
  command: "#c3e88d",
  output: "#eeffff",
  comment: "#546e7a",
};

const PROMPT_COLORS: Record<CodeLine["type"], string> = {
  command: "#82aaff",
  output: "#546e7a",
  comment: "#546e7a",
};

const PROMPTS: Record<CodeLine["type"], string> = {
  command: "$ ",
  output: "  ",
  comment: "  ",
};

/** Characters typed per frame for commands */
const CHARS_PER_FRAME = 1.5;
/** Output appears faster */
const OUTPUT_CHARS_PER_FRAME = 8;
/** Pause frames between lines */
const LINE_PAUSE = 12;

interface LineLayout {
  line: CodeLine;
  startFrame: number;
  typingDuration: number;
  totalChars: number;
}

function computeLineLayouts(
  lines: CodeLine[],
  durationInFrames: number
): LineLayout[] {
  const layouts: LineLayout[] = [];
  let currentFrame = 30; // Start after a brief pause

  for (const line of lines) {
    const delay = line.delay ?? 0;
    const startFrame = currentFrame + delay;
    const speed =
      line.type === "output" ? OUTPUT_CHARS_PER_FRAME : CHARS_PER_FRAME;
    const totalChars = line.text.length;
    const typingDuration = Math.ceil(totalChars / speed);

    layouts.push({
      line,
      startFrame,
      typingDuration,
      totalChars,
    });

    currentFrame = startFrame + typingDuration + LINE_PAUSE;
  }

  return layouts;
}

const TerminalDot: React.FC<{ color: string }> = ({ color }) => (
  <div
    style={{
      width: 14,
      height: 14,
      borderRadius: "50%",
      backgroundColor: color,
    }}
  />
);

const CursorBlink: React.FC = () => {
  const frame = useCurrentFrame();
  const visible = Math.floor(frame / 15) % 2 === 0;

  return (
    <span
      style={{
        display: "inline-block",
        width: 10,
        height: 22,
        backgroundColor: visible ? "#eeffff" : "transparent",
        marginLeft: 2,
        verticalAlign: "text-bottom",
      }}
    />
  );
};

export const CodeScreen: React.FC<CodeScreenProps> = ({
  lines,
  voiceoverUrl,
  durationInFrames,
  transitionDurationInFrames = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineLayouts = computeLineLayouts(lines, durationInFrames);

  // Fade in/out
  const fadeIn = interpolate(frame, [0, transitionDurationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - transitionDurationInFrames, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  // Find the last active line (where cursor should be)
  let lastActiveLine = -1;
  for (let i = 0; i < lineLayouts.length; i++) {
    if (frame >= lineLayouts[i].startFrame) {
      lastActiveLine = i;
    }
  }

  // Auto-scroll: if content would overflow, scroll down
  const visibleLineCount = lineLayouts.filter(
    (l) => frame >= l.startFrame
  ).length;
  const maxVisibleLines = 18;
  const scrollOffset = Math.max(0, visibleLineCount - maxVisibleLines);

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: "#0d0d1a" }}>
      {voiceoverUrl && <Audio src={voiceoverUrl} />}

      {/* Terminal window */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          right: 80,
          bottom: 60,
          borderRadius: 16,
          overflow: "hidden",
          border: `1px solid ${TERMINAL_BORDER}`,
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Terminal header */}
        <div
          style={{
            backgroundColor: TERMINAL_HEADER_BG,
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderBottom: `1px solid ${TERMINAL_BORDER}`,
          }}
        >
          <TerminalDot color="#ff5f57" />
          <TerminalDot color="#febc2e" />
          <TerminalDot color="#28c840" />
          <div
            style={{
              flex: 1,
              textAlign: "center",
              color: "#8892b0",
              fontSize: 16,
              fontFamily:
                "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code', 'Consolas', monospace",
              fontWeight: 500,
              letterSpacing: 0.5,
            }}
          >
            Claude Code — orchestrator-academy
          </div>
        </div>

        {/* Terminal body */}
        <div
          style={{
            flex: 1,
            backgroundColor: TERMINAL_BG,
            padding: "24px 28px",
            overflow: "hidden",
            fontFamily:
              "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code', 'Consolas', monospace",
            fontSize: 20,
            lineHeight: 1.7,
          }}
        >
          {lineLayouts.map((layout, idx) => {
            // Skip lines that are scrolled out of view
            if (idx < scrollOffset) return null;

            if (frame < layout.startFrame) return null;

            const elapsed = frame - layout.startFrame;
            const speed =
              layout.line.type === "output"
                ? OUTPUT_CHARS_PER_FRAME
                : CHARS_PER_FRAME;
            const visibleChars = Math.min(
              Math.floor(elapsed * speed),
              layout.totalChars
            );

            const isComplete = visibleChars >= layout.totalChars;
            const isLastActive = idx === lastActiveLine;
            const showCursor = isLastActive && !isComplete;

            const promptText = PROMPTS[layout.line.type];
            const promptColor = PROMPT_COLORS[layout.line.type];

            return (
              <div key={idx} style={{ whiteSpace: "pre-wrap", minHeight: 34 }}>
                <span style={{ color: promptColor }}>{promptText}</span>
                {layout.line.type === "command" ? (
                  <CodeHighlighter
                    code={layout.line.text}
                    visibleChars={visibleChars}
                  />
                ) : (
                  <span style={{ color: LINE_COLORS[layout.line.type] }}>
                    {layout.line.text.slice(0, visibleChars)}
                  </span>
                )}
                {showCursor && <CursorBlink />}
              </div>
            );
          })}

          {/* Show blinking cursor at the end when all lines are done */}
          {lineLayouts.length > 0 &&
            frame >=
              lineLayouts[lineLayouts.length - 1].startFrame +
                lineLayouts[lineLayouts.length - 1].typingDuration && (
              <div style={{ whiteSpace: "pre-wrap", minHeight: 34 }}>
                <span style={{ color: PROMPT_COLORS.command }}>$ </span>
                <CursorBlink />
              </div>
            )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

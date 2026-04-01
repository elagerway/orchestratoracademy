import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

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

// Claude Code actual colors
const BG = "#0d1117";
const USER_PROMPT_COLOR = "#7ee787"; // green for user input
const CLAUDE_TEXT_COLOR = "#e6edf3"; // light gray for output
const DIM_COLOR = "#484f58"; // dimmed text
const ACCENT_COLOR = "#58a6ff"; // blue accent
const SUCCESS_COLOR = "#3fb950"; // green checkmarks
const WARNING_COLOR = "#d29922"; // yellow warnings
const BORDER_COLOR = "#21262d";

/** Characters typed per frame for commands */
const CHARS_PER_FRAME = 1.2;
/** Output appears faster */
const OUTPUT_CHARS_PER_FRAME = 6;
/** Pause frames between lines */
const LINE_PAUSE = 10;

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
  let currentFrame = 25;

  for (const line of lines) {
    const delay = line.delay ?? 0;
    const startFrame = currentFrame + delay;
    const speed =
      line.type === "output" || line.type === "comment"
        ? OUTPUT_CHARS_PER_FRAME
        : CHARS_PER_FRAME;
    const totalChars = line.text.length;
    const typingDuration = Math.ceil(totalChars / speed);

    layouts.push({
      line,
      startFrame,
      typingDuration,
      totalChars,
    });

    // Add extra pause after commands (thinking time)
    const pause = line.type === "command" ? LINE_PAUSE * 3 : LINE_PAUSE;
    currentFrame = startFrame + typingDuration + pause;
  }

  return layouts;
}

const CursorBlink: React.FC = () => {
  const frame = useCurrentFrame();
  const visible = Math.floor(frame / 15) % 2 === 0;

  return (
    <span
      style={{
        display: "inline-block",
        width: 9,
        height: 20,
        backgroundColor: visible ? "#e6edf3" : "transparent",
        marginLeft: 1,
        verticalAlign: "text-bottom",
      }}
    />
  );
};

/** Thinking dots animation that shows after a command before output */
const ThinkingDots: React.FC = () => {
  const frame = useCurrentFrame();
  const dotCount = (Math.floor(frame / 8) % 3) + 1;
  return (
    <span style={{ color: DIM_COLOR, fontSize: 18 }}>
      {"  "}thinking{".".repeat(dotCount)}
    </span>
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

  // Find the last active line
  let lastActiveLine = -1;
  for (let i = 0; i < lineLayouts.length; i++) {
    if (frame >= lineLayouts[i].startFrame) {
      lastActiveLine = i;
    }
  }

  // Auto-scroll
  const visibleLineCount = lineLayouts.filter(
    (l) => frame >= l.startFrame
  ).length;
  const maxVisibleLines = 20;
  const scrollOffset = Math.max(0, visibleLineCount - maxVisibleLines);

  // Check if we're in the "thinking" phase after a command
  const isThinking = (() => {
    if (lastActiveLine < 0) return false;
    const current = lineLayouts[lastActiveLine];
    if (current.line.type !== "command") return false;
    const elapsed = frame - current.startFrame;
    const isCommandDone = elapsed * CHARS_PER_FRAME >= current.totalChars;
    const next = lineLayouts[lastActiveLine + 1];
    const nextStarted = next && frame >= next.startFrame;
    return isCommandDone && !nextStarted;
  })();

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: BG }}>
      {voiceoverUrl && <Audio src={voiceoverUrl} />}

      {/* Terminal window — full screen with padding */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            backgroundColor: "#161b22",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderBottom: `1px solid ${BORDER_COLOR}`,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#febc2e" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28c840" }} />
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              color: DIM_COLOR,
              fontSize: 14,
              fontFamily: "'SF Mono', 'Menlo', 'Consolas', monospace",
            }}
          >
            ~/projects/orchestrator-academy
          </div>
        </div>

        {/* Claude Code header */}
        <div
          style={{
            backgroundColor: BG,
            padding: "16px 32px 8px",
            borderBottom: `1px solid ${BORDER_COLOR}`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#e6edf3",
              fontFamily: "'SF Mono', 'Menlo', 'Consolas', monospace",
            }}
          >
            <span style={{ color: "#f0883e" }}>{">"}</span>
            {" "}
            <span style={{ color: ACCENT_COLOR }}>claude</span>
          </div>
          <div style={{ flex: 1 }} />
          <div
            style={{
              fontSize: 13,
              color: DIM_COLOR,
              fontFamily: "'SF Mono', 'Menlo', 'Consolas', monospace",
            }}
          >
            opus &bull; auto
          </div>
        </div>

        {/* Terminal body */}
        <div
          style={{
            flex: 1,
            backgroundColor: BG,
            padding: "20px 32px",
            overflow: "hidden",
            fontFamily: "'SF Mono', 'Menlo', 'Consolas', monospace",
            fontSize: 18,
            lineHeight: 1.8,
          }}
        >
          {lineLayouts.map((layout, idx) => {
            if (idx < scrollOffset) return null;
            if (frame < layout.startFrame) return null;

            const elapsed = frame - layout.startFrame;
            const speed =
              layout.line.type === "output" || layout.line.type === "comment"
                ? OUTPUT_CHARS_PER_FRAME
                : CHARS_PER_FRAME;
            const visibleChars = Math.min(
              Math.floor(elapsed * speed),
              layout.totalChars
            );

            const isComplete = visibleChars >= layout.totalChars;
            const isLastActive = idx === lastActiveLine;
            const showCursor = isLastActive && !isComplete;

            if (layout.line.type === "command") {
              // User input line — green > prompt
              const displayText = layout.line.text.replace(/^\$ /, "").replace(/^\$ claude /, "");
              const isClaudeCommand = layout.line.text.startsWith("$ claude");
              const promptText = isClaudeCommand
                ? layout.line.text.replace(/^\$ claude /, "")
                : layout.line.text.replace(/^\$ /, "");

              return (
                <div key={idx} style={{ whiteSpace: "pre-wrap", minHeight: 32, marginBottom: 4 }}>
                  <span style={{ color: USER_PROMPT_COLOR, fontWeight: 600 }}>{">"} </span>
                  <span style={{ color: "#e6edf3" }}>
                    {promptText.slice(0, visibleChars)}
                  </span>
                  {showCursor && <CursorBlink />}
                </div>
              );
            }

            if (layout.line.type === "comment") {
              return (
                <div key={idx} style={{ whiteSpace: "pre-wrap", minHeight: 32, marginBottom: 2 }}>
                  <span style={{ color: DIM_COLOR }}>
                    {layout.line.text.slice(0, visibleChars)}
                  </span>
                </div>
              );
            }

            // Output lines
            const text = layout.line.text;
            let color = CLAUDE_TEXT_COLOR;

            // Color checkmarks green, warnings yellow
            if (text.includes("✓")) color = SUCCESS_COLOR;
            if (text.includes("⚠")) color = WARNING_COLOR;
            // Dim empty lines
            if (text.trim() === "") {
              return <div key={idx} style={{ minHeight: 16 }} />;
            }

            return (
              <div key={idx} style={{ whiteSpace: "pre-wrap", minHeight: 32, marginBottom: 2 }}>
                <span style={{ color }}>
                  {text.slice(0, visibleChars)}
                </span>
                {showCursor && <CursorBlink />}
              </div>
            );
          })}

          {/* Thinking animation after command */}
          {isThinking && <ThinkingDots />}

          {/* Final cursor */}
          {lineLayouts.length > 0 &&
            !isThinking &&
            frame >=
              lineLayouts[lineLayouts.length - 1].startFrame +
                lineLayouts[lineLayouts.length - 1].typingDuration && (
              <div style={{ whiteSpace: "pre-wrap", minHeight: 32, marginTop: 8 }}>
                <span style={{ color: USER_PROMPT_COLOR, fontWeight: 600 }}>{">"} </span>
                <CursorBlink />
              </div>
            )}
        </div>

        {/* Status bar at bottom */}
        <div
          style={{
            backgroundColor: "#161b22",
            padding: "8px 32px",
            borderTop: `1px solid ${BORDER_COLOR}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "'SF Mono', 'Menlo', 'Consolas', monospace",
            fontSize: 13,
            color: DIM_COLOR,
          }}
        >
          <div style={{ display: "flex", gap: 16 }}>
            <span><span style={{ color: SUCCESS_COLOR }}>●</span> Connected</span>
            <span>orchestrator-academy</span>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <span>tokens: ~2.4k</span>
            <span>cost: $0.08</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

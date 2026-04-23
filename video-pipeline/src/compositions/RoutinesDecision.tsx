import React from "react";
import { AbsoluteFill, Audio, useVideoConfig, useCurrentFrame, interpolate, spring } from "remotion";

// VO2 — "The decision tree"
// Four rules fade in sequentially matched to narration beats.

const OA_GREEN = "#3ECF8E";
const DARK = "#0a0a0a";
const PANEL = "#141414";
const BORDER = "#262626";
const DIM = "rgba(255,255,255,0.55)";

interface Rule {
  number: string;
  question: string;
  tool: string;
  toolColor: string;
  examples: string;
  startSec: number;
}

const RULES: Rule[] = [
  {
    number: "1",
    question: "Primarily reading or writing a codebase?",
    tool: "Claude Routines",
    toolColor: OA_GREEN,
    examples: "code review, release checks, dependency bumping",
    startSec: 1.0,
  },
  {
    number: "2",
    question: "Engineers own it, self-host or complex branching?",
    tool: "n8n",
    toolColor: "#fb923c",
    examples: "cross-SaaS glue, custom code nodes, on-prem",
    startSec: 9.0,
  },
  {
    number: "3",
    question: "Non-engineer owner, primarily SaaS glue?",
    tool: "Make.com",
    toolColor: "#a78bfa",
    examples: "friendliest UX, 1,500+ connectors, marketing & ecommerce",
    startSec: 15.0,
  },
  {
    number: "+",
    question: "Needs reasoning in the middle of a flow?",
    tool: "Routine inside n8n or Make",
    toolColor: OA_GREEN,
    examples: "drop it in as a step",
    startSec: 24.0,
  },
];

export const RoutinesDecision: React.FC<{ voiceoverUrl?: string }> = ({ voiceoverUrl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleFade = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK, fontFamily: "'Sora', system-ui, sans-serif" }}>
      {voiceoverUrl && <Audio src={voiceoverUrl} />}

      {/* Title */}
      <div style={{ position: "absolute", top: 56, left: 0, right: 0, textAlign: "center", opacity: titleFade }}>
        <div style={{ color: OA_GREEN, fontSize: 22, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>
          the decision tree
        </div>
        <div style={{ color: "#fff", fontSize: 60, fontWeight: 900, marginTop: 12, letterSpacing: -2 }}>
          Ask these in order
        </div>
      </div>

      {/* Rule cards — 2x2 grid */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 80,
          right: 80,
          bottom: 80,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 32,
        }}
      >
        {RULES.map((rule) => {
          const startFrame = Math.round(rule.startSec * fps);
          const appear = spring({
            frame: frame - startFrame,
            fps,
            config: { damping: 20, stiffness: 140 },
          });
          if (appear <= 0.01) {
            return <div key={rule.number} />;
          }
          const translateY = (1 - appear) * 20;

          return (
            <div
              key={rule.number}
              style={{
                background: PANEL,
                border: `1px solid ${BORDER}`,
                borderRadius: 24,
                padding: 40,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                opacity: appear,
                transform: `translateY(${translateY}px)`,
              }}
            >
              {/* Number badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: `${rule.toolColor}22`,
                    border: `2px solid ${rule.toolColor}`,
                    color: rule.toolColor,
                    fontSize: 30,
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {rule.number}
                </div>
                <div
                  style={{
                    color: DIM,
                    fontSize: 16,
                    letterSpacing: 2,
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  ask yourself
                </div>
              </div>

              {/* Question */}
              <div style={{ color: "#fff", fontSize: 30, fontWeight: 600, lineHeight: 1.25 }}>
                {rule.question}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: BORDER, margin: "4px 0" }} />

              {/* Answer */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
                <div
                  style={{
                    color: DIM,
                    fontSize: 18,
                    fontWeight: 600,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  use
                </div>
                <div style={{ color: rule.toolColor, fontSize: 36, fontWeight: 900, letterSpacing: -1 }}>
                  {rule.tool}
                </div>
              </div>

              {/* Examples */}
              <div style={{ color: DIM, fontSize: 18, lineHeight: 1.4, marginTop: "auto" }}>
                {rule.examples}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

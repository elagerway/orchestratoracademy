import React from "react";
import { AbsoluteFill, Audio, staticFile, useVideoConfig, useCurrentFrame, interpolate, spring } from "remotion";

// VO1 — "Natural language vs knobs"
// Left: the plain-English sentence grows in as if being written.
// Right: a messy wiring diagram (nodes + cables) slowly assembles.

const OA_GREEN = "#3ECF8E";
const DARK = "#0a0a0a";
const PANEL = "#141414";
const BORDER = "#262626";
const DIM = "rgba(255,255,255,0.55)";

const ENGLISH = `Every morning, read the main branch, check for dependency vulnerabilities, open a pull request that bumps them safely, run the tests.`;

const NODES: { id: string; label: string; x: number; y: number; color: string }[] = [
  { id: "cron", label: "cron\n07:00", x: 60, y: 100, color: "#60a5fa" },
  { id: "github1", label: "github:\nread repo", x: 60, y: 260, color: "#f472b6" },
  { id: "scan", label: "cve scan", x: 60, y: 420, color: "#facc15" },
  { id: "if", label: "if\nCVEs?", x: 260, y: 260, color: "#fb923c" },
  { id: "bump", label: "bump\ndeps", x: 460, y: 140, color: "#a78bfa" },
  { id: "test", label: "npm test", x: 460, y: 300, color: "#34d399" },
  { id: "pr", label: "github:\nopen PR", x: 460, y: 460, color: "#ef4444" },
];

const EDGES: [string, string][] = [
  ["cron", "github1"],
  ["github1", "scan"],
  ["scan", "if"],
  ["if", "bump"],
  ["if", "test"],
  ["bump", "test"],
  ["test", "pr"],
];

function centerOf(id: string) {
  const n = NODES.find((n) => n.id === id)!;
  return { x: n.x + 70, y: n.y + 40 };
}

export const RoutinesKnobs: React.FC<{ voiceoverUrl?: string }> = ({ voiceoverUrl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Left: typewriter reveal over ~4s after a 0.5s delay
  const typeStart = Math.round(0.5 * fps);
  const typeDuration = Math.round(4 * fps);
  const typed = Math.max(0, Math.min(1, (frame - typeStart) / typeDuration));
  const typedChars = Math.floor(ENGLISH.length * typed);

  // Right: each node appears staggered after 1s, then edges animate
  const nodeStart = Math.round(1 * fps);
  const perNode = Math.round(0.25 * fps);
  const edgeStart = nodeStart + NODES.length * perNode;
  const perEdge = Math.round(0.18 * fps);

  // Brand frame fade-in on both panels
  const panelFade = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK, fontFamily: "'Sora', system-ui, sans-serif" }}>
      {voiceoverUrl && <Audio src={voiceoverUrl} />}

      {/* Title bar */}
      <div style={{ position: "absolute", top: 48, left: 0, right: 0, textAlign: "center", opacity: panelFade }}>
        <div style={{ color: OA_GREEN, fontSize: 22, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>
          How you configure it
        </div>
        <div style={{ color: "#fff", fontSize: 56, fontWeight: 900, marginTop: 12, letterSpacing: -2 }}>
          Natural language <span style={{ color: DIM }}>vs</span> knobs
        </div>
      </div>

      {/* Left panel — plain English */}
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 80,
          width: 820,
          height: 700,
          borderRadius: 24,
          background: PANEL,
          border: `1px solid ${BORDER}`,
          padding: 48,
          opacity: panelFade,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: OA_GREEN }} />
          <div style={{ color: DIM, fontSize: 18, letterSpacing: 2, fontWeight: 600, textTransform: "uppercase" }}>
            claude routines
          </div>
        </div>
        <div style={{ color: "#fff", fontSize: 36, lineHeight: 1.35, fontWeight: 500 }}>
          <span>&ldquo;</span>
          {ENGLISH.slice(0, typedChars)}
          <span
            style={{
              display: "inline-block",
              width: 3,
              height: 36,
              marginLeft: 6,
              background: OA_GREEN,
              verticalAlign: "middle",
              opacity: Math.floor(frame / 12) % 2 === 0 ? 1 : 0.1,
            }}
          />
          {typedChars >= ENGLISH.length && <span>&rdquo;</span>}
        </div>
        <div style={{ marginTop: "auto", color: DIM, fontSize: 18 }}>
          that sentence is the configuration
        </div>
      </div>

      {/* Right panel — wiring mess */}
      <div
        style={{
          position: "absolute",
          top: 220,
          right: 80,
          width: 820,
          height: 700,
          borderRadius: 24,
          background: PANEL,
          border: `1px solid ${BORDER}`,
          padding: 48,
          opacity: panelFade,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: "#facc15" }} />
          <div style={{ color: DIM, fontSize: 18, letterSpacing: 2, fontWeight: 600, textTransform: "uppercase" }}>
            n8n / make
          </div>
        </div>

        <svg viewBox="0 0 620 540" style={{ width: "100%", flex: 1 }}>
          {/* Edges (drawn before nodes) */}
          {EDGES.map(([a, b], i) => {
            const edgeFrame = edgeStart + i * perEdge;
            const progress = Math.max(0, Math.min(1, (frame - edgeFrame) / (fps * 0.4)));
            if (progress <= 0) return null;
            const pa = centerOf(a);
            const pb = centerOf(b);
            const midX = (pa.x + pb.x) / 2;
            return (
              <g key={i} opacity={progress}>
                <path
                  d={`M ${pa.x} ${pa.y} C ${midX} ${pa.y}, ${midX} ${pb.y}, ${pb.x} ${pb.y}`}
                  stroke="#facc15"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4 4"
                />
              </g>
            );
          })}

          {/* Nodes */}
          {NODES.map((n, i) => {
            const appear = nodeStart + i * perNode;
            const progress = spring({ frame: frame - appear, fps, config: { damping: 12, stiffness: 180 } });
            if (progress <= 0.01) return null;
            const lines = n.label.split("\n");
            return (
              <g key={n.id} transform={`translate(${n.x}, ${n.y}) scale(${progress})`}>
                <rect
                  x="0"
                  y="0"
                  width="140"
                  height="80"
                  rx="10"
                  fill={DARK}
                  stroke={n.color}
                  strokeWidth="2"
                />
                <circle cx="14" cy="16" r="4" fill={n.color} />
                {lines.map((ln, j) => (
                  <text
                    key={j}
                    x="70"
                    y={lines.length === 1 ? 48 : 36 + j * 18}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="14"
                    fontWeight="600"
                    fontFamily="'Sora', system-ui, sans-serif"
                  >
                    {ln}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>

        <div style={{ color: DIM, fontSize: 18 }}>
          oauth &middot; connectors &middot; field mapping &middot; branching &middot; retries &middot; cron
        </div>
      </div>
    </AbsoluteFill>
  );
};

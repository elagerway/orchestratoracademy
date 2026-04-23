"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { ChevronRight, Play, RotateCcw, Copy, Check } from "lucide-react";
import { BuyMeCoffeeButton } from "@/components/buy-me-coffee";
import { BookCallButton } from "@/components/book-call";

interface LessonContentProps {
  content: string;
  videoUrl?: string | null;
  contentType: string;
  lessonSlug: string;
  lessonTitle: string;
  courseSlug: string;
  nextLessonSlug?: string | null;
  nextLessonTitle?: string | null;
}

function CodeBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const text = typeof children === "string"
      ? children
      : (children as any)?.props?.children ?? "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <pre
      className="group relative my-6 overflow-x-auto rounded-lg border border-border/60 bg-neutral-900 p-5 pr-12 text-sm text-emerald-accent"
      {...props}
    >
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 rounded-md p-1.5 text-neutral-500 opacity-0 transition-all hover:bg-neutral-800 hover:text-emerald-accent group-hover:opacity-100"
        title="Copy"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
      {children}
    </pre>
  );
}

const GREEN = "#00C853";
const WHITE = "#ffffff";
const DIM = "rgba(255,255,255,0.35)";
const DIM_GREEN = "rgba(0,200,83,0.25)";

type DiagramType = "orchestra" | "landscape" | "dayloop" | "paths" | "models" | "frameworks" | "prompt" | "chain" | "workflow" | "agent" | "shield" | "checklist" | "recap" | "rocket";

const SLUG_TO_DIAGRAM: Record<string, DiagramType> = {
  "what-is-ai-orchestration": "orchestra",
  "ai-landscape-2026": "landscape",
  "day-in-the-life": "dayloop",
  "career-paths": "paths",
  "ai-models-providers": "models",
  "orchestration-frameworks": "frameworks",
  "anatomy-of-great-prompt": "prompt",
  "advanced-prompt-techniques": "chain",
  "workflow-design-principles": "workflow",
  "build-research-agent": "agent",
  "ethics-for-orchestrators": "shield",
  "building-responsible-systems": "checklist",
  "what-youve-learned": "recap",
  "advanced-courses-certification": "rocket",
};

function LessonDiagram({ slug }: { slug: string }) {
  const type = SLUG_TO_DIAGRAM[slug] || "orchestra";

  switch (type) {
    case "orchestra":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="24" fill="none" stroke={GREEN} strokeWidth="2.5"/>
          <text x="100" y="106" textAnchor="middle" fill={GREEN} fontSize="14" fontFamily="sans-serif">ORC</text>
          {[[100,20],[180,100],[100,180],[20,100]].map(([x,y],i) => (
            <g key={i}>
              <line x1="100" y1="100" x2={x} y2={y} stroke={DIM} strokeWidth="1.5" strokeDasharray="4 3"/>
              <circle cx={x} cy={y} r="14" fill="none" stroke={WHITE} strokeWidth="1.5"/>
              <text x={x} y={y+5} textAnchor="middle" fill={WHITE} fontSize="10" fontFamily="sans-serif">AI</text>
            </g>
          ))}
        </svg>
      );
    case "landscape":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[{y:30,w:160,label:"LLMs",c:GREEN},{y:65,w:130,label:"Vision",c:WHITE},{y:100,w:150,label:"Agents",c:GREEN},{y:135,w:110,label:"Multi-modal",c:WHITE},{y:170,w:170,label:"Open Source",c:GREEN}].map(({y,w,label,c},i) => (
            <g key={i}>
              <rect x={(200-w)/2} y={y} width={w} height="24" rx="4" fill="none" stroke={c} strokeWidth="1.5" opacity="0.7"/>
              <text x="100" y={y+16} textAnchor="middle" fill={c} fontSize="11" fontFamily="sans-serif">{label}</text>
            </g>
          ))}
        </svg>
      );
    case "dayloop":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="70" fill="none" stroke={DIM_GREEN} strokeWidth="2" strokeDasharray="6 4"/>
          {[{a:-90,l:"Plan"},{a:30,l:"Build"},{a:150,l:"Monitor"}].map(({a,l},i) => {
            const rad = (a*Math.PI)/180;
            const x = 100+70*Math.cos(rad);
            const y = 100+70*Math.sin(rad);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="18" fill="#0a0a0a" stroke={GREEN} strokeWidth="2"/>
                <text x={x} y={y+4} textAnchor="middle" fill={WHITE} fontSize="10" fontFamily="sans-serif">{l}</text>
              </g>
            );
          })}
        </svg>
      );
    case "paths":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="40" r="16" fill="none" stroke={GREEN} strokeWidth="2"/>
          <text x="100" y="44" textAnchor="middle" fill={GREEN} fontSize="9" fontFamily="sans-serif">YOU</text>
          {[{x:40,l:"Consult"},{x:100,l:"In-House"},{x:160,l:"Architect"}].map(({x,l},i) => (
            <g key={i}>
              <line x1="100" y1="56" x2={x} y2="120" stroke={DIM} strokeWidth="1.5"/>
              <rect x={x-30} y="120" width="60" height="28" rx="4" fill="none" stroke={WHITE} strokeWidth="1.5"/>
              <text x={x} y="138" textAnchor="middle" fill={WHITE} fontSize="9" fontFamily="sans-serif">{l}</text>
            </g>
          ))}
          <line x1="100" y1="148" x2="100" y2="174" stroke={DIM} strokeWidth="1.5"/>
          <rect x="70" y="170" width="60" height="24" rx="4" fill="none" stroke={GREEN} strokeWidth="1.5"/>
          <text x="100" y="186" textAnchor="middle" fill={GREEN} fontSize="9" fontFamily="sans-serif">Coach</text>
        </svg>
      );
    case "models":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[{x:15,y:20,l:"Claude",c:GREEN},{x:110,y:20,l:"GPT",c:WHITE},{x:15,y:85,l:"Gemini",c:WHITE},{x:110,y:85,l:"Llama",c:GREEN},{x:62,y:150,l:"Mistral",c:WHITE}].map(({x,y,l,c},i) => (
            <g key={i}>
              <rect x={x} y={y} width="75" height="50" rx="6" fill="none" stroke={c} strokeWidth="1.5" opacity="0.8"/>
              <text x={x+37} y={y+30} textAnchor="middle" fill={c} fontSize="12" fontFamily="sans-serif">{l}</text>
            </g>
          ))}
        </svg>
      );
    case "frameworks":
      return (
        <svg viewBox="0 0 220 200" className="w-full h-full">
          {[{x:10,y:85,l:"CrewAI",c:GREEN},{x:80,y:85,l:"LangGraph",c:WHITE},{x:155,y:85,l:"Magpipe",c:GREEN}].map(({x,y,l,c},i) => (
            <g key={i}>
              <rect x={x} y={y} width="62" height="32" rx="5" fill="none" stroke={c} strokeWidth="1.5"/>
              <text x={x+31} y={y+20} textAnchor="middle" fill={c} fontSize="10" fontFamily="sans-serif">{l}</text>
            </g>
          ))}
          <text x="110" y="150" textAnchor="middle" fill={DIM} fontSize="10" fontFamily="sans-serif">Choose the right tool for the task</text>
        </svg>
      );
    case "prompt":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[{y:10,letter:"R",label:"Role",c:GREEN},{y:55,letter:"A",label:"Action",c:WHITE},{y:100,letter:"C",label:"Context",c:GREEN},{y:145,letter:"E",label:"Expect",c:WHITE}].map(({y,letter,label,c},i) => (
            <g key={i}>
              <circle cx="30" cy={y+18} r="14" fill="none" stroke={c} strokeWidth="2"/>
              <text x="30" y={y+23} textAnchor="middle" fill={c} fontSize="14" fontWeight="bold" fontFamily="sans-serif">{letter}</text>
              <line x1="48" y1={y+18} x2="64" y2={y+18} stroke={DIM} strokeWidth="1"/>
              <text x="68" y={y+23} fill={c} fontSize="13" fontFamily="sans-serif">{label}</text>
            </g>
          ))}
        </svg>
      );
    case "chain":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[{x:40,y:30,l:"Think"},{x:100,y:70,l:"Step"},{x:60,y:120,l:"Reason"},{x:130,y:160,l:"Answer"}].map(({x,y,l},i,arr) => (
            <g key={i}>
              <circle cx={x} cy={y} r="16" fill="none" stroke={i%2===0?GREEN:WHITE} strokeWidth="2"/>
              <text x={x} y={y+4} textAnchor="middle" fill={i%2===0?GREEN:WHITE} fontSize="9" fontFamily="sans-serif">{l}</text>
              {arr[i+1] && <line x1={x} y1={y+16} x2={arr[i+1].x} y2={arr[i+1].y-16} stroke={DIM} strokeWidth="1.5" strokeDasharray="4 3"/>}
            </g>
          ))}
        </svg>
      );
    case "workflow":
      return (
        <svg viewBox="0 0 200 220" className="w-full h-full">
          {[{y:10,l:"Input"},{y:65,l:"Process"},{y:120,l:"Review"},{y:175,l:"Output"}].map(({y,l},i) => (
            <g key={i}>
              <rect x="50" y={y} width="100" height="36" rx="6" fill="none" stroke={i%2===0?GREEN:WHITE} strokeWidth="2"/>
              <text x="100" y={y+22} textAnchor="middle" fill={i%2===0?GREEN:WHITE} fontSize="12" fontFamily="sans-serif">{l}</text>
              {i<3 && <line x1="100" y1={y+36} x2="100" y2={y+55} stroke={DIM} strokeWidth="1.5"/>}
            </g>
          ))}
        </svg>
      );
    case "agent":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect x="55" y="55" width="90" height="90" rx="10" fill="none" stroke={DIM_GREEN} strokeWidth="1.5"/>
          {[{x:100,y:20,l:"Question"},{x:180,y:100,l:"Search"},{x:100,y:180,l:"Analyse"},{x:20,y:100,l:"Report"}].map(({x,y,l},i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="18" fill="#0a0a0a" stroke={i%2===0?GREEN:WHITE} strokeWidth="2"/>
              <text x={x} y={y+4} textAnchor="middle" fill={i%2===0?GREEN:WHITE} fontSize="8" fontFamily="sans-serif">{l}</text>
            </g>
          ))}
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path d="M 100 20 L 170 55 L 170 110 C 170 150 140 180 100 195 C 60 180 30 150 30 110 L 30 55 Z" fill="none" stroke={GREEN} strokeWidth="2.5"/>
          <polyline points="65,105 90,130 140,75" fill="none" stroke={WHITE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <text x="100" y="170" textAnchor="middle" fill={DIM} fontSize="10" fontFamily="sans-serif">Ethical AI</text>
        </svg>
      );
    case "checklist":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[{y:25,l:"Transparency",done:true},{y:65,l:"Bias checks",done:true},{y:105,l:"Privacy",done:true},{y:145,l:"Audit trails",done:false}].map(({y,l,done},i) => (
            <g key={i}>
              <rect x="20" y={y} width="20" height="20" rx="3" fill="none" stroke={done?GREEN:DIM} strokeWidth="1.5"/>
              {done && <polyline points={`24,${y+10} 28,${y+15} 36,${y+5}`} fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round"/>}
              <text x="50" y={y+15} fill={done?WHITE:DIM} fontSize="13" fontFamily="sans-serif">{l}</text>
            </g>
          ))}
        </svg>
      );
    case "recap":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="35" fill="none" stroke={GREEN} strokeWidth="2.5"/>
          <text x="100" y="96" textAnchor="middle" fill={GREEN} fontSize="11" fontFamily="sans-serif" fontWeight="bold">7</text>
          <text x="100" y="112" textAnchor="middle" fill={WHITE} fontSize="9" fontFamily="sans-serif">Modules</text>
          {[0,60,120,180,240,300].map((angle,i) => {
            const rad = (angle-90)*Math.PI/180;
            const x1 = 100+40*Math.cos(rad);
            const y1 = 100+40*Math.sin(rad);
            const x2 = 100+65*Math.cos(rad);
            const y2 = 100+65*Math.sin(rad);
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={DIM_GREEN} strokeWidth="2"/>
                <circle cx={x2} cy={y2} r="5" fill={GREEN} opacity="0.6"/>
              </g>
            );
          })}
        </svg>
      );
    case "rocket":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path d="M 100 20 L 120 80 L 110 80 L 110 150 L 90 150 L 90 80 L 80 80 Z" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinejoin="round"/>
          <circle cx="100" cy="60" r="6" fill="none" stroke={WHITE} strokeWidth="1.5"/>
          <line x1="92" y1="150" x2="85" y2="175" stroke={DIM} strokeWidth="1.5"/>
          <line x1="100" y1="150" x2="100" y2="180" stroke={DIM} strokeWidth="1.5"/>
          <line x1="108" y1="150" x2="115" y2="175" stroke={DIM} strokeWidth="1.5"/>
          <circle cx="40" cy="50" r="2" fill={WHITE} opacity="0.5"/>
          <circle cx="160" cy="35" r="2" fill={WHITE} opacity="0.5"/>
          <circle cx="150" cy="120" r="1.5" fill={WHITE} opacity="0.4"/>
          <circle cx="50" cy="140" r="1.5" fill={WHITE} opacity="0.4"/>
        </svg>
      );
  }
}

function LessonHero({ slug, title }: { slug: string; title: string }) {
  return (
    <div className="flex h-56 sm:h-64 items-stretch overflow-hidden rounded-xl border border-border/60 bg-[#0a0a0a]">
      <div className="flex flex-1 flex-col justify-start px-8 pt-6">
        <div className="mb-3 h-1 w-12 rounded bg-[#00C853]" />
        <h2 className="mb-6 text-lg font-bold text-white leading-tight sm:text-xl">{title}</h2>
        <div className="w-32 h-32 sm:w-40 sm:h-40">
          <LessonDiagram slug={slug} />
        </div>
      </div>
    </div>
  );
}

// Custom components with better spacing
const markdownComponents: Components = {
  h1: ({ children, ...props }) => (
    <h1 className="mb-6 mt-10 text-3xl font-bold tracking-tight first:mt-0" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mb-4 mt-10 text-2xl font-semibold tracking-tight" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mb-3 mt-8 text-xl font-semibold" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-5 leading-7 text-foreground/90" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="mb-6 ml-1 space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mb-6 ml-1 space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-7 pl-1" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-6 border-l-2 border-emerald-accent/50 bg-emerald-accent/5 py-3 pl-5 pr-4 rounded-r-lg italic text-foreground/80"
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: (props) => <hr className="my-10 border-border/60" {...props} />,
  pre: ({ children, ...props }) => <CodeBlock {...props}>{children}</CodeBlock>,
  table: ({ children, ...props }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-border/60">
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th className="border-b border-border/60 bg-secondary/50 px-4 py-2.5 text-left font-semibold" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border-b border-border/30 px-4 py-2.5" {...props}>
      {children}
    </td>
  ),
};

export function LessonContent({ content, videoUrl, contentType, lessonSlug, lessonTitle, courseSlug, nextLessonSlug, nextLessonTitle }: LessonContentProps) {
  const [videoEnded, setVideoEnded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Use Vimeo Player SDK to detect video end
  useEffect(() => {
    if (contentType !== "video" || !videoUrl || !iframeRef.current) return;

    let player: any;
    import("@vimeo/player").then((Vimeo) => {
      player = new Vimeo.default(iframeRef.current!);
      player.on("ended", () => {
        setVideoEnded(true);
      });
    });

    return () => {
      if (player) {
        player.off("ended");
      }
    };
  }, [contentType, videoUrl]);

  function handleReplay() {
    setVideoEnded(false);
    import("@vimeo/player").then((Vimeo) => {
      if (iframeRef.current) {
        const player = new Vimeo.default(iframeRef.current);
        player.setCurrentTime(0).then(() => player.play());
      }
    });
  }

  return (
    <div className="mb-12 max-w-none">
      {/* Hero diagram — only show when there's no video */}
      {!(contentType === "video" && videoUrl) && (
        <div className="mb-10">
          <LessonHero slug={lessonSlug} title={lessonTitle} />
        </div>
      )}

      {/* Video section */}
      {contentType === "video" && videoUrl ? (
        <div className="mb-10">
          <div className="relative aspect-video overflow-hidden rounded-xl border border-border/60 bg-muted">
            <iframe
              ref={iframeRef}
              src={videoUrl}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {/* OA watermark — links to course overview */}
            <Link
              href={`/courses/${courseSlug}`}
              className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900/30 backdrop-blur-sm opacity-30 transition-opacity hover:opacity-100"
            >
              <span className="text-sm font-bold text-white">OA</span>
            </Link>

            {/* End screen overlay */}
            {videoEnded && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-neutral-950/90 backdrop-blur-sm transition-opacity">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <span className="text-lg font-bold text-white">OA</span>
                </div>
                <p className="mb-6 text-sm text-neutral-400">{lessonTitle}</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReplay}
                    className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-700"
                  >
                    <RotateCcw className="size-4" />
                    Replay
                  </button>
                  {nextLessonSlug && (
                    <Link
                      href={`/courses/${courseSlug}/lessons/${nextLessonSlug}`}
                      className="flex items-center gap-2 rounded-lg bg-emerald-accent px-4 py-2.5 text-sm font-medium text-emerald-accent-foreground transition-colors hover:bg-emerald-accent/90"
                    >
                      {nextLessonTitle ?? "Next Lesson"}
                      <ChevronRight className="size-4" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-10">
          <div className="relative aspect-video overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-secondary to-muted">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-foreground/10 backdrop-blur-sm transition-transform hover:scale-105">
                <Play className="size-7 text-foreground/60 ml-0.5" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground/70">Video lesson coming soon</p>
                <p className="mt-1 text-xs text-muted-foreground">Read the written content below</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Written content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* Support the Academy — every lesson footer */}
      <div className="mt-10 space-y-3 border-t border-border pt-6">
        <BuyMeCoffeeButton variant="card" />
        <BookCallButton variant="card" />
      </div>
    </div>
  );
}

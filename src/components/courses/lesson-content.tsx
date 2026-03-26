"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { Play } from "lucide-react";

interface LessonContentProps {
  content: string;
  videoUrl?: string | null;
  contentType: string;
}

// Contextual illustrations mapped to content keywords
const ILLUSTRATIONS: Record<string, { src: string; alt: string }> = {
  "orchestrat": {
    src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    alt: "AI systems working together",
  },
  "prompt": {
    src: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&h=400&fit=crop",
    alt: "Writing effective AI prompts",
  },
  "workflow": {
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    alt: "Workflow automation and design",
  },
  "api": {
    src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    alt: "API connections and data flow",
  },
  "security": {
    src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
    alt: "AI security and compliance",
  },
  "deploy": {
    src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
    alt: "Deploying to production",
  },
  "team": {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop",
    alt: "Team collaboration",
  },
  "career": {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    alt: "Career growth and opportunities",
  },
  "ethic": {
    src: "https://images.unsplash.com/photo-1589254065878-42c014d49724?w=800&h=400&fit=crop",
    alt: "Responsible AI development",
  },
  "database": {
    src: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop",
    alt: "Database and data architecture",
  },
  "agent": {
    src: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop",
    alt: "AI agents at work",
  },
  "code": {
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    alt: "Writing code",
  },
};

function getIllustration(content: string): { src: string; alt: string } | null {
  const lower = content.toLowerCase().slice(0, 500);
  for (const [keyword, img] of Object.entries(ILLUSTRATIONS)) {
    if (lower.includes(keyword)) return img;
  }
  return ILLUSTRATIONS["orchestrat"];
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
  pre: ({ children, ...props }) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg border border-border/60 bg-secondary p-5 text-sm"
      {...props}
    >
      {children}
    </pre>
  ),
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

export function LessonContent({ content, videoUrl, contentType }: LessonContentProps) {
  const illustration = getIllustration(content);

  return (
    <div className="mb-12 max-w-none">
      {/* Hero illustration */}
      {illustration && (
        <div className="mb-10 overflow-hidden rounded-xl border border-border/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={illustration.src}
            alt={illustration.alt}
            className="h-56 w-full object-cover sm:h-64"
            loading="lazy"
          />
        </div>
      )}

      {/* Video section */}
      {contentType === "video" && videoUrl ? (
        <div className="mb-10">
          <div className="relative aspect-video overflow-hidden rounded-xl border border-border/60 bg-muted">
            <iframe
              src={videoUrl}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
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
    </div>
  );
}

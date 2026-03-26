"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { Play } from "lucide-react";

interface LessonContentProps {
  content: string;
  videoUrl?: string | null;
  contentType: string;
  lessonSlug: string;
  lessonTitle: string;
}

// 64 unique Unsplash photos — modern tech only
// Dark screens, glowing code, abstract data, circuits, neon. No papers, no desks, no offices.
const PHOTO_POOL = [
  "photo-1555066931-4365d14bab8c",    // Dark code on screen
  "photo-1487058792275-0ad4aaf24ca7",  // Neon code dark IDE
  "photo-1488590528505-98d2b5aba04b",  // Colorful syntax on black
  "photo-1526374965328-7f61d4dc18c5",  // Green circuit board macro
  "photo-1518770660439-4636190af475",  // Microchip gold traces
  "photo-1550745165-9bc0b252726f",    // PCB neon traces
  "photo-1558494949-ef010cbdcc31",    // Blue server room
  "photo-1581291518857-4e27b48ff24e",  // Server rack neon cables
  "photo-1451187580459-43490279c0fa",  // Earth from space night
  "photo-1526628953301-3e589a6a8b74",  // Globe with glowing connections
  "photo-1523961131990-5ea7c61b2107",  // Network mesh glow
  "photo-1485827404703-89b55fcc595e",  // Abstract network nodes
  "photo-1535378917042-10a22c95931a",  // Abstract cloud particles
  "photo-1573164713988-8665fc963095",  // Data viz neon chart
  "photo-1551288049-bebda4e38f71",    // Analytics dashboard screen
  "photo-1504868584819-f8e8b4b6d7e3",  // Abstract light streaks
  "photo-1509966756634-9c23dd6e6815",  // Light speed tunnel
  "photo-1537432376149-e84978a29e4b",  // Abstract gradient mesh
  "photo-1535223289827-42f1e9919769",  // City lights at night
  "photo-1580894894513-541e068a3e2b",  // Holographic display
  "photo-1633356122102-3fe601e05bd2",  // Terminal prompt dark
  "photo-1629654297299-c8506221ca97",  // GitHub dark mode UI
  "photo-1614064641938-3bbee52942c7",  // RGB neon keyboard
  "photo-1605379399642-870262d3d051",  // Code screen dark purple
  "photo-1610563166150-b34df4f0bcd6",  // VS Code dark editor
  "photo-1562813733-b31f71025d54",    // Terminal green on black
  "photo-1607799279861-4dd421887fc5",  // Multi-monitor setup dark
  "photo-1516116216624-53e697fedbea",  // Dual screens code
  "photo-1504639725590-34d0984388bd",  // Terminal green matrix
  "photo-1461749280684-dccba630e2f6",  // Monitor code dark
  "photo-1498050108023-c5249f4df085",  // Code macro dark screen
  "photo-1517694712202-14dd9538aa97",  // Laptop code dark room
  "photo-1550751827-4bd374c3f58b",    // Cyber lock neon
  "photo-1563013544-824ae1b704d3",    // Digital security
  "photo-1551808525-51a94da548ce",    // Rocket launch night
  "photo-1573164574572-cb89e39749b4",  // Chat interface dark
  "photo-1485856407642-7f9ba0f24571",  // Audio waveform neon
  "photo-1460925895917-afdab827c52f",  // Trading charts dark
  "photo-1639762681057-408e52192e55",  // AI neural abstract
  "photo-1676299081847-824916de030a",  // ChatGPT style interface
  "photo-1679083216051-aa510a1a2c0e",  // AI abstract blue
  "photo-1684369175833-4b445ad6bfb5",  // Glowing data streams
  "photo-1635070041078-e363dbe005cb",  // Abstract geometric
  "photo-1620712943543-bcc4688e7485",  // Digital face wireframe
  "photo-1677442136019-21780ecad995",  // AI chip abstract
  "photo-1696446702183-cbd13d78e1e7",  // Code reflection glasses
  "photo-1618401471353-b98afee0b2eb",  // Abstract colorful
  "photo-1558591710-4b4a1ae0f04d",    // Matrix rain
  "photo-1504384764586-bb4cdc1707b0",  // Satellite view
  "photo-1519389950473-47ba0277781c",  // Modern glass office
  "photo-1542744094-3a31f272c490",    // Tech conference stage
  "photo-1531297484001-80022131f5a1",  // Clean modern monitor
  "photo-1527474305487-b87b222841cc",  // Drone aerial abstract
  "photo-1506748686214-e9df14d4d9d0",  // Vast landscape minimal
  "photo-1519681393784-d120267933ba",  // Mountain peak sunrise
  "photo-1635070041078-e363dbe005cb",  // Geometric abstract
  "photo-1611532736597-de2d4265fba3",  // Blockchain visual
  "photo-1639322537228-f710d846310a",  // AI processor
  "photo-1636690513351-0af1363a6b0e",  // Digital tunnel
  "photo-1635070041078-e363dbe005cb",  // Geometric light
  "photo-1581092160607-ee22621dd758",  // Fiber optic
  "photo-1504384308090-c894fdcc538d",  // Brain network
  "photo-1576091160550-2173dba999ef",  // DNA data helix
  "photo-1544197150-b99a580bb7a8",    // Laptop dark ambient
];

// Simple hash function to get a consistent index from a string
function hashStr(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function getIllustration(slug: string, title: string): { src: string; alt: string } {
  const index = hashStr(slug) % PHOTO_POOL.length;
  const photoId = PHOTO_POOL[index];
  return {
    src: `https://images.unsplash.com/${photoId}?w=800&h=400&fit=crop&q=80`,
    alt: title,
  };
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

export function LessonContent({ content, videoUrl, contentType, lessonSlug, lessonTitle }: LessonContentProps) {
  const illustration = getIllustration(lessonSlug, lessonTitle);

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

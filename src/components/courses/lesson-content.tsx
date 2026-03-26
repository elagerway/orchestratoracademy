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

// 64 unique Unsplash photos — no robots, no humanoids
// Terminal screens, code editors, abstract tech, data viz, real workspaces
const PHOTO_POOL = [
  "photo-1555066931-4365d14bab8c",    // Code on dark screen
  "photo-1504639725590-34d0984388bd",  // Terminal with green text
  "photo-1517694712202-14dd9538aa97",  // Laptop with code editor
  "photo-1461749280684-dccba630e2f6",  // Monitor with code
  "photo-1498050108023-c5249f4df085",  // Code closeup on screen
  "photo-1488590528505-98d2b5aba04b",  // Colorful syntax highlighting
  "photo-1487058792275-0ad4aaf24ca7",  // Dark IDE with neon code
  "photo-1526374965328-7f61d4dc18c5",  // Circuit board macro
  "photo-1518770660439-4636190af475",  // Microchip closeup
  "photo-1550745165-9bc0b252726f",    // PCB circuit pattern
  "photo-1558494949-ef010cbdcc31",    // Server room blue
  "photo-1581291518857-4e27b48ff24e",  // Server rack cables
  "photo-1551288049-bebda4e38f71",    // Analytics dashboard
  "photo-1573164713988-8665fc963095",  // Data visualization chart
  "photo-1460925895917-afdab827c52f",  // Financial charts
  "photo-1535378917042-10a22c95931a",  // Cloud abstract
  "photo-1451187580459-43490279c0fa",  // Earth from space night
  "photo-1526628953301-3e589a6a8b74",  // Globe with connections
  "photo-1523961131990-5ea7c61b2107",  // Network mesh
  "photo-1485827404703-89b55fcc595e",  // Abstract network nodes
  "photo-1531297484001-80022131f5a1",  // Minimal laptop workspace
  "photo-1496065187959-7f07c4e546b2",  // Workspace flat lay
  "photo-1454165804606-c3d57bc86b40",  // Clean desk setup
  "photo-1551434678-e076c223a692",    // Developer at desk
  "photo-1522071820081-009f0129c71c",  // Team at whiteboard
  "photo-1519389950473-47ba0277781c",  // Team meeting
  "photo-1552664730-d307ca884978",    // Brainstorm session
  "photo-1557804506-669a67965ba0",    // Conference room
  "photo-1553877522-43269d4ea984",    // Strategy whiteboard
  "photo-1559028012-481c04fa702d",    // Flowchart diagram
  "photo-1516321497487-e288fb19713f",  // Sticky notes planning
  "photo-1467232004584-a241de8bcf5d",  // Design tools
  "photo-1550751827-4bd374c3f58b",    // Lock on keyboard
  "photo-1563013544-824ae1b704d3",    // Security padlock
  "photo-1537432376149-e84978a29e4b",  // Abstract gradient
  "photo-1504868584819-f8e8b4b6d7e3",  // Abstract light
  "photo-1509966756634-9c23dd6e6815",  // Light tunnel
  "photo-1542744094-3a31f272c490",    // Conference stage
  "photo-1544383835-bda2bc66a55d",    // Library bookshelves
  "photo-1589254065878-42c014d49724",  // Balance scale
  "photo-1434494878577-86c23bcb06b9",  // Phone in hand
  "photo-1512756290469-ec264b7fbf87",  // Inbox interface
  "photo-1542744173-8e7e91415657",    // Typing on keyboard
  "photo-1519681393784-d120267933ba",  // Mountain sunrise
  "photo-1470071459604-3b5ec3a7fe05",  // Forest canopy
  "photo-1506748686214-e9df14d4d9d0",  // Mountain vista
  "photo-1485856407642-7f9ba0f24571",  // Sound wave pattern
  "photo-1573164574572-cb89e39749b4",  // Chat UI mockup
  "photo-1551808525-51a94da548ce",    // Rocket launch
  "photo-1535223289827-42f1e9919769",  // Night city lights
  "photo-1527474305487-b87b222841cc",  // Aerial drone view
  "photo-1483478550801-ceba5fe50e8e",  // Compass direction
  "photo-1580894894513-541e068a3e2b",  // Holographic screen
  "photo-1581091226825-a6a2a5aee158",  // Tablet dashboard
  "photo-1581092795360-fd1ca04f0952",  // Screen with data
  "photo-1633356122102-3fe601e05bd2",  // Terminal prompt
  "photo-1629654297299-c8506221ca97",  // GitHub dark UI
  "photo-1607799279861-4dd421887fc5",  // Multiple monitors
  "photo-1614064641938-3bbee52942c7",  // Neon keyboard
  "photo-1544197150-b99a580bb7a8",    // Coffee and laptop
  "photo-1516116216624-53e697fedbea",  // Dual monitors code
  "photo-1605379399642-870262d3d051",  // Purple code screen
  "photo-1610563166150-b34df4f0bcd6",  // VS Code editor
  "photo-1562813733-b31f71025d54",    // Clean terminal
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

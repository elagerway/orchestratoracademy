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

// 64 unique Unsplash photos — code on screens, clean abstracts
// No people, no robots, no motherboards, no charts, no nature
const PHOTO_POOL = [
  "photo-1517694712202-14dd9538aa97",  // 1  MacBook with Python code
  "photo-1498050108023-c5249f4df085",  // 2  Laptop code lines
  "photo-1488590528505-98d2b5aba04b",  // 3  Colorful syntax screen
  "photo-1461749280684-dccba630e2f6",  // 4  Monitor code overhead
  "photo-1555066931-4365d14bab8c",    // 5  Laptop code side angle
  "photo-1504639725590-34d0984388bd",  // 6  Terminal code screen
  "photo-1516116216624-53e697fedbea",  // 7  Dual screens code
  "photo-1551288049-bebda4e38f71",    // 8  Dashboard screen
  "photo-1460925895917-afdab827c52f",  // 9  Screen with data
  "photo-1605379399642-870262d3d051",  // 10 Code editor purple
  "photo-1562813733-b31f71025d54",    // 11 Terminal commands
  "photo-1629654297299-c8506221ca97",  // 12 GitHub interface
  "photo-1487058792275-0ad4aaf24ca7",  // 13 IDE syntax highlighting
  "photo-1633356122102-3fe601e05bd2",  // 14 Terminal cursor
  "photo-1542903660-eedba2cda473",    // 15 Laptop code macro
  "photo-1580927752452-89d86da3fa0a",  // 16 Code reflection
  "photo-1607705703571-c5a8695f18f6",  // 17 Code on bright laptop
  "photo-1534972195531-d756b9bfa9f2",  // 18 Laptop code table
  "photo-1555949963-ff9fe0c870eb",    // 19 Code closeup
  "photo-1544256718-3bcf237f3974",    // 20 Coding session
  "photo-1537498425277-c283d32ef9db",  // 21 Monitor workspace
  "photo-1509718443690-d8e2fb3474b7",  // 22 Screen code bright
  "photo-1587620962725-abab7fe55159",  // 23 JS code laptop
  "photo-1542831371-29b0f74f9713",    // 24 HTML CSS code
  "photo-1579468118864-1b9ea3c0db4a",  // 25 Code dark laptop
  "photo-1547658719-da2b51169166",    // 26 Laptop screen code bright
  "photo-1484417894907-623942c8ee29",  // 27 Code screen bright
  "photo-1566837945700-30057527ade0",  // 28 Code syntax monitor
  "photo-1550063873-ab792950096b",    // 29 Code text display
  "photo-1544197150-b99a580bb7a8",    // 30 Laptop with coffee
  "photo-1531297484001-80022131f5a1",  // 31 Clean laptop desk
  "photo-1603468620905-8de7d86b781e",  // 32 Wide monitor code
  "photo-1619410283995-43d9134e7656",  // 33 Python script laptop
  "photo-1526498460520-4c246339dccb",  // 34 Code lines screen
  "photo-1571171637578-41bc2dd41cd2",  // 35 Laptop code window
  "photo-1558494949-ef010cbdcc31",    // 36 Server room
  "photo-1581291518857-4e27b48ff24e",  // 37 Server rack
  "photo-1535378917042-10a22c95931a",  // 38 Cloud abstract
  "photo-1451187580459-43490279c0fa",  // 39 Earth from space
  "photo-1526628953301-3e589a6a8b74",  // 40 Globe connections
  "photo-1523961131990-5ea7c61b2107",  // 41 Network mesh
  "photo-1485827404703-89b55fcc595e",  // 42 Network nodes
  "photo-1519389950473-47ba0277781c",  // 43 Modern glass room
  "photo-1504868584819-f8e8b4b6d7e3",  // 44 Light abstract
  "photo-1550751827-4bd374c3f58b",    // 45 Lock on keyboard
  "photo-1563013544-824ae1b704d3",    // 46 Digital padlock
  "photo-1573164574572-cb89e39749b4",  // 47 Chat interface
  "photo-1614064641938-3bbee52942c7",  // 48 RGB keyboard
  "photo-1535223289827-42f1e9919769",  // 49 City lights
  "photo-1580894894513-541e068a3e2b",  // 50 Holographic display
  "photo-1509966756634-9c23dd6e6815",  // 51 Light tunnel
  "photo-1618401471353-b98afee0b2eb",  // 52 Abstract colorful
  "photo-1558591710-4b4a1ae0f04d",    // 53 Matrix code
  "photo-1611532736597-de2d4265fba3",  // 54 Blockchain visual
  "photo-1639762681057-408e52192e55",  // 55 Neural abstract
  "photo-1581092160607-ee22621dd758",  // 56 Fiber optic
  "photo-1576091160550-2173dba999ef",  // 57 Data helix
  "photo-1551808525-51a94da548ce",    // 58 Rocket launch
  "photo-1527474305487-b87b222841cc",  // 59 Aerial view
  "photo-1559028012-481c04fa702d",    // 60 Flowchart screen
  "photo-1573164713988-8665fc963095",  // 61 Data viz screen
  "photo-1512756290469-ec264b7fbf87",  // 62 Inbox interface
  "photo-1434494878577-86c23bcb06b9",  // 63 Phone screen
  "photo-1454165804606-c3d57bc86b40",  // 64 Clean laptop desk
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
      {/* Hero illustration — only show when there's no video */}
      {!(contentType === "video" && videoUrl) && illustration && (
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
            {/* OA watermark */}
            <div className="pointer-events-none absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900/30 backdrop-blur-sm">
              <span className="text-sm font-bold text-white/20">OA</span>
            </div>
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

"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface LessonContentProps {
  content: string;
  videoUrl?: string | null;
  contentType: string;
}

export function LessonContent({ content, videoUrl, contentType }: LessonContentProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert mb-12 max-w-none prose-headings:font-heading prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-code:before:content-none prose-code:after:content-none prose-code:rounded prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-pre:bg-secondary prose-pre:border prose-pre:border-border/60">
      {contentType === "video" && videoUrl ? (
        <div className="mb-8">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
            <iframe
              src={videoUrl}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {content && (
            <div className="mt-8">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      ) : (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      )}
    </div>
  );
}

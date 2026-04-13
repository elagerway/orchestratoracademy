"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;
const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|svg|bmp|avif)(\?[^\s]*)?$/i;

function isImageUrl(url: string) {
  return IMAGE_EXTENSIONS.test(url);
}

/** Create a fresh regex each time to avoid stateful lastIndex issues */
function urlRegex() {
  return new RegExp(URL_PATTERN.source, "g");
}

function LinkPreview({ url }: { url: string }) {
  const [meta, setMeta] = useState<{
    title?: string;
    description?: string;
    image?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/link-preview?url=${encodeURIComponent(url)}`
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled) setMeta(data);
      } catch {
        if (!cancelled) setMeta(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (loading) {
    return (
      <div className="mt-2 animate-pulse rounded-lg border border-border/40 bg-muted/50 p-3">
        <div className="h-3 w-2/3 rounded bg-muted" />
        <div className="mt-1.5 h-2 w-full rounded bg-muted" />
      </div>
    );
  }

  if (!meta?.title && !meta?.description && !meta?.image) return null;

  const hostname = (() => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  })();

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 block overflow-hidden rounded-lg border border-border/40 transition-colors hover:border-border"
    >
      {meta?.image && (
        <div className="relative h-32 w-full bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={meta.image}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="bg-muted/30 p-3">
        <p className="text-xs text-muted-foreground">{hostname}</p>
        {meta?.title && (
          <p className="mt-0.5 text-sm font-medium leading-snug line-clamp-2">
            {meta.title}
          </p>
        )}
        {meta?.description && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
            {meta.description}
          </p>
        )}
      </div>
    </a>
  );
}

/**
 * Renders text with clickable links, image previews, and link preview cards.
 *
 * @param text - The raw text to render
 * @param variant - "light" for light backgrounds (default), "dark" for dark bubble backgrounds
 */
export function RichText({
  text,
  variant = "light",
}: {
  text: string;
  variant?: "light" | "dark";
}) {
  const urls = text.match(urlRegex()) ?? [];
  const imageUrls = urls.filter(isImageUrl);
  const linkUrls = urls.filter((u) => !isImageUrl(u));

  const linkColor =
    variant === "dark"
      ? "text-emerald-300 hover:text-emerald-200"
      : "text-emerald-accent hover:text-emerald-accent/80";

  function renderBody() {
    if (!urls.length) {
      return <p className="whitespace-pre-wrap">{text}</p>;
    }

    const parts = text.split(urlRegex());
    return (
      <p className="whitespace-pre-wrap break-words">
        {parts.map((part, i) => {
          if (urlRegex().test(part)) {
            return (
              <a
                key={i}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-0.5 underline decoration-1 underline-offset-2 ${linkColor}`}
              >
                {part.length > 50 ? part.slice(0, 50) + "..." : part}
                <ExternalLink className="inline size-3 shrink-0" />
              </a>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </p>
    );
  }

  return (
    <div>
      {renderBody()}

      {/* Image previews */}
      {imageUrls.map((url, i) => (
        <a
          key={`img-${i}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 block overflow-hidden rounded-xl border border-border/40"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt=""
            className="max-h-64 w-full object-cover"
            loading="lazy"
          />
        </a>
      ))}

      {/* Link previews */}
      {linkUrls.slice(0, 2).map((url, i) => (
        <LinkPreview key={`link-${i}`} url={url} />
      ))}
    </div>
  );
}

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronLeft, Calendar, Share2 } from "lucide-react";
import { ShareButtons } from "./share-buttons";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt, featured_image_url")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} — AI Orchestrator Academy`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featured_image_url ? [post.featured_image_url] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) notFound();

  const postUrl = `https://orchestratoracademy.com/blog/${slug}`;

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <Link
        href="/blog"
        className="mb-8 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Back to Blog
      </Link>

      {post.featured_image_url && (
        <img
          src={post.featured_image_url}
          alt={post.title}
          className="mb-8 w-full rounded-xl object-cover"
          style={{ maxHeight: 400 }}
        />
      )}

      <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        {post.title}
      </h1>

      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="size-3.5" />
          {new Date(post.published_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <ShareButtons url={postUrl} title={post.title} excerpt={post.excerpt} />
      </div>

      <div className="mt-8 border-t border-border pt-8">
        <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-heading prose-p:leading-relaxed prose-a:text-emerald-accent">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </article>
      </div>

      {/* Bottom share */}
      <div className="mt-12 border-t border-border pt-8">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <Share2 className="mr-1.5 inline size-3.5" />
            Share this post
          </p>
          <ShareButtons url={postUrl} title={post.title} excerpt={post.excerpt} />
        </div>
      </div>
    </div>
  );
}

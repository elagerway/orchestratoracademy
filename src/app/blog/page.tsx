import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — AI Orchestrator Academy",
  description: "Latest updates, tutorials, and insights on AI orchestration, agent workflows, and building with AI.",
};

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, featured_image_url, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      <div className="mb-12">
        <h1 className="font-heading text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Updates, tutorials, and insights from the AI Orchestrator Academy.
        </p>
      </div>

      {(!posts || posts.length === 0) ? (
        <p className="text-center text-muted-foreground py-12">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <Card className="overflow-hidden transition-all hover:shadow-md">
                <div className="flex flex-col sm:flex-row">
                  {post.featured_image_url && (
                    <div className="sm:w-64 shrink-0">
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="h-48 w-full object-cover sm:h-full"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardHeader>
                      <CardTitle className="text-xl group-hover:text-emerald-accent transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1.5 text-xs">
                        <Calendar className="size-3" />
                        {new Date(post.published_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

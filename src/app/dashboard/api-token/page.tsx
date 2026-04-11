"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Copy, Check, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ApiTokenPage() {
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setToken(session.access_token);
    });
  }, [supabase.auth]);

  const copyToken = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">API Token</h1>
        <p className="mt-1 text-muted-foreground">
          Use this token with the CLI assessment and deploy tools.
        </p>
      </div>

      {token ? (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="flex items-center justify-between bg-muted/50 px-4 py-2">
              <span className="text-sm font-medium">Access Token</span>
              <Button variant="ghost" size="sm" onClick={copyToken} className="h-7 gap-1.5 text-xs">
                {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <div className="bg-neutral-950 p-4">
              <code className="block break-all font-mono text-xs text-emerald-400">
                {token.slice(0, 40)}...{token.slice(-20)}
              </code>
            </div>
          </div>

          <div className="rounded-lg border border-border p-5">
            <h3 className="flex items-center gap-2 font-medium">
              <Terminal className="size-4" />
              How to use
            </h3>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">1. Assess your team</p>
                <code className="mt-1 block rounded bg-muted px-3 py-2 font-mono text-xs">
                  claude &quot;/assess-team {token.slice(0, 20)}...&quot;
                </code>
              </div>
              <div>
                <p className="font-medium text-foreground">2. Deploy a project</p>
                <code className="mt-1 block rounded bg-muted px-3 py-2 font-mono text-xs">
                  claude &quot;/deploy-project {token.slice(0, 20)}...&quot;
                </code>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            This token expires when your session ends. Refresh the page to get a new one.
          </p>
        </div>
      ) : (
        <p className="text-muted-foreground">Loading token...</p>
      )}
    </div>
  );
}

#!/usr/bin/env node
/**
 * Create blog posts for batch 2 videos and schedule them every 3 days.
 * Schedule: Apr 25, 28, May 1, 4, 7, 10, 13, 16, 19, 22
 */

import { createReadStream, readFileSync, existsSync } from "fs";

// Load .env.local
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq > 0) process.env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Schedule: every 3 days starting Apr 25, 2026 at 3:00 PM PDT (10:00 PM UTC)
const SCHEDULE_START = new Date("2026-04-25T22:00:00Z");

const POSTS = [
  {
    slug: "gpt-54-uses-your-computer-better-than-you",
    title: "GPT-5.4 Can Use Your Computer Better Than You",
    videoId: "Aquq62R3g34",
    shortId: "s3HnRniqQC0",
    excerpt: "OpenAI shipped GPT-5.4 — the first AI model that scores higher than humans on computer use benchmarks. Here's what it means for orchestrators.",
    metaDescription: "GPT-5.4 scores 75% on computer use tasks vs 72% for humans. OpenAI's latest model handles coding, computer use, and knowledge work at frontier level.",
    tags: ["GPT-5.4", "OpenAI", "computer use", "AI agents", "agentic AI"],
    content: `<iframe width="100%" height="400" src="https://www.youtube.com/embed/Aquq62R3g34" frameborder="0" allowfullscreen></iframe>

<h2>What Happened</h2>

<p>OpenAI just shipped GPT-5.4 — and it's the first model that can use your computer better than you can. On the OSWorld benchmark for computer use tasks, GPT-5.4 scores 75%. Humans score 72%.</p>

<p>This isn't a chatbot upgrade. GPT-5.4 combines reasoning, coding, and agentic workflows into a single frontier model. It's available in ChatGPT (as GPT-5.4 Thinking and GPT-5.4 Pro) and in the API alongside Codex.</p>

<h2>Why This Matters</h2>

<p>Computer use is the bridge between "AI that talks" and "AI that does." When a model can navigate interfaces, fill out forms, extract data from dashboards, and chain together multi-step workflows across applications — it stops being a tool and starts being a coworker.</p>

<p>For orchestrators, this changes the game. You're no longer limited to API integrations. You can now build agents that interact with any software that has a screen — including legacy systems with no API at all.</p>

<h2>The Numbers</h2>

<ul>
<li><strong>75%</strong> — GPT-5.4's score on OSWorld computer use benchmark</li>
<li><strong>72%</strong> — Human score on the same benchmark</li>
<li><strong>First model</strong> to credibly handle coding, computer use, and knowledge work at frontier level</li>
</ul>

<h2>What Orchestrators Should Do</h2>

<p>If you're building agent workflows, test GPT-5.4's computer use capabilities against your existing tool-calling pipelines. In many cases, screen-based interaction will be simpler and more reliable than building custom API integrations — especially for tools that update their APIs frequently or don't have them at all.</p>

<p>The age of the screen-aware agent is here. <a href="/courses">Learn to orchestrate them</a>.</p>`,
  },
  {
    slug: "amazon-cuts-16000-jobs-ai-takes-over",
    title: "Amazon Cuts 16,000 Jobs as AI Takes Over",
    videoId: "3jkIbCOb08c",
    shortId: "m4PyX_Bf7BU",
    excerpt: "Amazon laid off 16,000 employees. The reason? AI is making middle management and admin roles redundant. Here's what's really happening.",
    metaDescription: "Amazon lays off 16,000 as AI replaces middle management and admin roles. CEO Andy Jassy says it's about efficiency, not cost savings.",
    tags: ["Amazon", "layoffs", "AI jobs", "automation", "workforce"],
    content: `<iframe width="100%" height="400" src="https://www.youtube.com/embed/3jkIbCOb08c" frameborder="0" allowfullscreen></iframe>

<h2>What Happened</h2>

<p>Amazon just cut 16,000 jobs — and they're saying the quiet part out loud. The cuts target middle management and administrative roles that have become redundant as the company integrates more sophisticated AI systems.</p>

<p>CEO Andy Jassy said the layoffs are about efficiency rather than cost savings. Amazon is redirecting resources toward AI and data center buildout.</p>

<h2>The Pattern</h2>

<p>This isn't an isolated event. Across the Fortune 500, companies are discovering that AI agents can handle coordination, reporting, scheduling, and data synthesis — the exact tasks that middle management was hired to do.</p>

<p>The roles most at risk aren't the ones doing the technical work. They're the ones doing the <em>routing</em> work — deciding who should do what, tracking progress, summarizing status. That's exactly what orchestration frameworks do.</p>

<h2>The Numbers</h2>

<ul>
<li><strong>16,000</strong> — jobs cut in this round</li>
<li><strong>Middle management and admin</strong> — the targeted roles</li>
<li><strong>AI + data centers</strong> — where the money is being redirected</li>
</ul>

<h2>What This Means for You</h2>

<p>If your job is primarily about coordinating information between people and systems, you have two choices: become the person who builds the AI that does the coordinating, or become the person being coordinated by it.</p>

<p>AI orchestration isn't just a technical skill — it's career insurance. <a href="/courses">Start learning now</a>.</p>`,
  },
  {
    slug: "mcp-97-million-installs-agentic-infrastructure",
    title: "MCP Just Hit 97 Million Installs — It's Now Foundational Infrastructure",
    videoId: "xwp1ZyoeFiQ",
    shortId: "uQIsaRtjpyw",
    excerpt: "Model Context Protocol crossed 97 million installs. It's no longer experimental — it's the default way AI agents connect to the real world.",
    metaDescription: "MCP crosses 97 million installs in March 2026. Every major AI provider now ships MCP-compatible tooling. The protocol is foundational agentic infrastructure.",
    tags: ["MCP", "Model Context Protocol", "AI agents", "API", "agentic AI"],
    content: `<iframe width="100%" height="400" src="https://www.youtube.com/embed/xwp1ZyoeFiQ" frameborder="0" allowfullscreen></iframe>

<h2>What Happened</h2>

<p>Model Context Protocol crossed 97 million installs in March 2026, cementing its transition from experimental standard to foundational agentic infrastructure. Every major AI provider now ships MCP-compatible tooling.</p>

<p>MCP has become the default mechanism by which agents connect to external tools, APIs, and data sources. If you're building agents that need to interact with the real world — databases, APIs, file systems, SaaS tools — MCP is the protocol that makes it work.</p>

<h2>Why 97 Million Matters</h2>

<p>Adoption at this scale means MCP is no longer optional. It's like HTTPS — you don't debate whether to support it. You just do. Tool vendors are building MCP servers as a first-class integration path, not an afterthought.</p>

<p>For orchestrators, this means the ecosystem of pre-built MCP connectors is massive and growing. You can wire an agent to Slack, GitHub, Supabase, Stripe, and hundreds of other tools without writing custom API code.</p>

<h2>The Numbers</h2>

<ul>
<li><strong>97 million</strong> — total MCP installs as of March 2026</li>
<li><strong>Every major AI provider</strong> — ships MCP-compatible tooling</li>
<li><strong>Default protocol</strong> — for agent-to-tool connections</li>
</ul>

<h2>Get Started with MCP</h2>

<p>If you're not building with MCP yet, you're building with one hand tied behind your back. Our courses cover MCP integration from first principles. <a href="/courses">Start here</a>.</p>`,
  },
  {
    slug: "owasp-top-10-risks-ai-agents-2026",
    title: "OWASP's Top 10 Risks for AI Agents — Prompt Injection Still #1",
    videoId: "x_JexGHnO8U",
    shortId: "tmLDVJbJaYY",
    excerpt: "OWASP just published their top 10 risks for agentic AI. Prompt injection leads the list with attacks up 340% in 2026.",
    metaDescription: "OWASP publishes top 10 risks for agentic AI applications in 2026. Prompt injection attacks up 340%. Malicious MCP servers and unauthorized code execution round out threats.",
    tags: ["OWASP", "AI security", "prompt injection", "cybersecurity", "AI risks"],
    content: `<iframe width="100%" height="400" src="https://www.youtube.com/embed/x_JexGHnO8U" frameborder="0" allowfullscreen></iframe>

<h2>What Happened</h2>

<p>OWASP just published their top 10 risks for agentic AI applications, and the results should make every orchestrator pay attention. Prompt injection is still the number one vulnerability — with attacks up 340% in 2026.</p>

<p>But the list goes beyond prompt injection. Attackers are exploiting AI agents through malicious MCP servers, unexpected code execution, and techniques that expose sensitive data and enable unauthorized access.</p>

<h2>The Top Threats</h2>

<ul>
<li><strong>#1 Prompt Injection</strong> — attacks up 340%, still the highest-severity vulnerability</li>
<li><strong>Malicious MCP Servers</strong> — poisoned tool servers that exfiltrate data</li>
<li><strong>Unexpected Code Execution</strong> — agents running arbitrary code without sandboxing</li>
<li><strong>Data Exfiltration</strong> — agents inadvertently leaking sensitive context</li>
<li><strong>Excessive Permissions</strong> — agents with more access than they need</li>
</ul>

<h2>Why Orchestrators Must Care</h2>

<p>If you're building multi-agent systems, every agent in your pipeline is an attack surface. A single compromised MCP server can inject instructions that propagate through your entire workflow. A poorly scoped agent can access data it was never meant to see.</p>

<p>Security isn't a feature you bolt on at the end. It's a design principle that shapes how you build from day one.</p>

<h2>What to Do About It</h2>

<p>Validate every MCP server you connect to. Scope agent permissions to the minimum required. Sandbox code execution. And assume that every piece of external data an agent ingests could contain injection attempts.</p>

<p>Our AI Security course covers all of this in depth. <a href="/courses">Learn to build secure agents</a>.</p>`,
  },
  {
    slug: "openai-852-billion-most-valuable-private-company",
    title: "OpenAI Is Now Worth $852 Billion — The Most Valuable Private Company Ever",
    videoId: "aOgkzw-343I",
    shortId: "RKDAyPf8c9Y",
    excerpt: "OpenAI just became the most valuable private company in history. $852 billion valuation, $25B annual revenue, and a potential IPO by late 2026.",
    metaDescription: "OpenAI valued at $852 billion — the most valuable private company in history. $25B annual revenue with potential IPO by end of 2026.",
    tags: ["OpenAI", "valuation", "IPO", "AI funding", "AI business"],
    content: `<iframe width="100%" height="400" src="https://www.youtube.com/embed/aOgkzw-343I" frameborder="0" allowfullscreen></iframe>

<h2>What Happened</h2>

<p>OpenAI has secured a major funding round valuing the company at $852 billion, making it the most valuable private company in history. The company has surpassed $25 billion in annualized revenue and is reportedly taking early steps toward a public listing — potentially as soon as late 2026.</p>

<h2>What $852 Billion Tells Us</h2>

<p>This valuation isn't just about ChatGPT subscriptions. It reflects the market's belief that AI infrastructure will be as fundamental as cloud computing. OpenAI isn't just selling a chatbot — they're selling the operating layer for the next generation of software.</p>

<p>For context, that's bigger than most public companies. Bigger than most <em>countries'</em> GDP. And they're still private.</p>

<h2>The Numbers</h2>

<ul>
<li><strong>$852 billion</strong> — new valuation</li>
<li><strong>$25 billion</strong> — annualized revenue</li>
<li><strong>Late 2026</strong> — potential IPO timeline</li>
<li><strong>#1</strong> — most valuable private company in history</li>
</ul>

<h2>What This Means for the Industry</h2>

<p>When this much capital flows into AI, everything downstream accelerates — tooling, infrastructure, hiring, and adoption. Companies that know how to orchestrate AI systems will be the ones capturing value. The demand for orchestrators isn't going down. It's going exponential.</p>

<p><a href="/courses">Position yourself for the AI economy</a>.</p>`,
  },
  {
    slug: "perplexity-450m-arr-fastest-growing-saas",
    title: "Perplexity Hits $450M ARR — The Fastest-Growing SaaS Company in History",
    videoId: "7IE5A_9q-4A",
    shortId: "ZHal0a10SkI",
    excerpt: "Perplexity's revenue jumped 50% in a single month to $450M ARR with 100M monthly users. They're rewriting what's possible in SaaS growth.",
    metaDescription: "Perplexity AI reaches $450M ARR with 100M monthly users. Revenue jumped 50% in one month — the fastest SaaS growth rate ever recorded.",
    tags: ["Perplexity", "AI search", "SaaS", "ARR", "AI business"],
    content: `<iframe width="100%" height="400" src="https://www.youtube.com/embed/7IE5A_9q-4A" frameborder="0" allowfullscreen></iframe>

<h2>What Happened</h2>

<p>Perplexity's annual recurring revenue hit $450 million in March after a 50% jump in a single month, fueled by over 100 million monthly active users. The AI search startup is now the fastest-growing SaaS company in history by revenue growth rate.</p>

<h2>Why This Is Different</h2>

<p>Traditional SaaS companies took years to reach $100M ARR. Perplexity did $450M in months. The difference? AI-native products don't just solve problems — they replace entire workflows. When your product is genuinely better than Google for certain queries, growth isn't linear. It's viral.</p>

<p>Perplexity didn't build a better search box. They built an AI agent that researches, synthesizes, and presents answers — the kind of workflow an orchestrator would design.</p>

<h2>The Numbers</h2>

<ul>
<li><strong>$450M</strong> — annual recurring revenue</li>
<li><strong>100M</strong> — monthly active users</li>
<li><strong>50%</strong> — revenue growth in a single month</li>
<li><strong>#1</strong> — fastest SaaS growth rate ever</li>
</ul>

<h2>The Lesson for Orchestrators</h2>

<p>AI-native products that replace workflows (not just augment them) can achieve growth rates that were previously impossible. If you're building AI products, think about what workflows you can completely replace, not just assist. <a href="/courses">Learn to build AI-native products</a>.</p>`,
  },
  {
    slug: "242-billion-invested-ai-q1-2026",
    title: "$242 Billion Invested in AI in Q1 2026 — 4x Year-Over-Year",
    videoId: "R600y_Iy3wc",
    shortId: "_gqxEkuC_t8",
    excerpt: "$242 billion invested in AI in just Q1 2026 — four times what was invested in the same period last year. AI is no longer experimental.",
    metaDescription: "$242 billion invested in AI in Q1 2026 vs $59.6B in Q1 2025. AI moves from experimental to core operating layer for global industry.",
    tags: ["AI investment", "venture capital", "AI industry", "Q1 2026", "AI growth"],
    content: `<iframe width="100%" height="400" src="https://www.youtube.com/embed/R600y_Iy3wc" frameborder="0" allowfullscreen></iframe>

<h2>What Happened</h2>

<p>$242 billion was invested in AI in Q1 2026, dwarfing the $59.6 billion from the same period in 2025. AI has moved from experimental infrastructure to a core operating layer for global industry.</p>

<p>Fortune 500 companies announced production agentic deployments across manufacturing, logistics, and finance. This isn't R&D spending anymore. It's operational spending.</p>

<h2>What 4x Means</h2>

<p>A 4x year-over-year increase in a single quarter tells you something fundamental has shifted. Companies aren't experimenting with AI anymore — they're betting on it. They're replacing existing systems, hiring AI teams, and restructuring around agent-first workflows.</p>

<h2>The Numbers</h2>

<ul>
<li><strong>$242 billion</strong> — AI investment in Q1 2026</li>
<li><strong>$59.6 billion</strong> — AI investment in Q1 2025</li>
<li><strong>4x</strong> — year-over-year increase</li>
<li><strong>Fortune 500</strong> — production agentic deployments in manufacturing, logistics, finance</li>
</ul>

<h2>What This Means for Your Career</h2>

<p>$242 billion creates demand — for engineers, for architects, for orchestrators. The companies spending this money need people who can design, build, and manage AI agent systems. That's the opportunity. <a href="/courses">Start building AI orchestration skills</a>.</p>`,
  },
  {
    slug: "meta-rebuilds-ai-stack-muse-spark",
    title: "Meta Rebuilds Its Entire AI Stack — Introduces Muse Spark",
    videoId: "wEaax-oZXm8",
    shortId: "ohPqb1eGGRc",
    excerpt: "Meta spent $14 billion rebuilding its AI stack from scratch and released Muse Spark. They hired Alexandr Wang's team to catch up with OpenAI and Google.",
    metaDescription: "Meta rebuilds AI stack from scratch, releases Muse Spark model. $14B investment and Alexandr Wang's team hired to compete with OpenAI and Google.",
    tags: ["Meta", "Muse Spark", "AI model", "AI competition", "Alexandr Wang"],
    content: `<iframe width="100%" height="400" src="https://www.youtube.com/embed/wEaax-oZXm8" frameborder="0" allowfullscreen></iframe>

<h2>What Happened</h2>

<p>Meta just rebuilt its AI stack from the ground up and released Muse Spark, a closed-source model that ranked fourth on the Artificial Analysis Intelligence Index. The company spent $14 billion and brought in Alexandr Wang's team to catch up with OpenAI and Google.</p>

<h2>The Strategy Shift</h2>

<p>This is a dramatic pivot for Meta. After years of championing open-source AI with Llama, they've released a closed-source model — signaling that they believe the frontier requires proprietary investment that open-source can't sustain.</p>

<p>The $14 billion investment and the hiring of Alexandr Wang (founder of Scale AI) shows Meta is serious about competing at the frontier, not just in the open-source tier.</p>

<h2>The Numbers</h2>

<ul>
<li><strong>$14 billion</strong> — investment in AI rebuild</li>
<li><strong>#4</strong> — Muse Spark's ranking on Artificial Analysis Intelligence Index</li>
<li><strong>Alexandr Wang</strong> — Scale AI founder, hired to lead efforts</li>
<li><strong>Closed-source</strong> — departure from Meta's open-source strategy</li>
</ul>

<h2>What This Means</h2>

<p>More competition at the frontier means better models for everyone. For orchestrators, the model layer is becoming commoditized — the value is increasingly in how you connect, sequence, and manage these models, not in which one you pick. <a href="/courses">Learn orchestration skills that work with any model</a>.</p>`,
  },
  {
    slug: "92-percent-developers-ai-coding-tools-2026",
    title: "92% of Developers Now Use AI Coding Tools — But 45% of the Code Has Vulnerabilities",
    videoId: "L096RJF8uGs",
    shortId: "N8UVFrj6Md4",
    excerpt: "92% of US developers use AI coding tools. 40% of new SaaS is built through vibe coding. But 45% of AI-generated code has security vulnerabilities.",
    metaDescription: "92% of developers use AI coding tools in 2026. 40% of SaaS built via vibe coding. But 45% of AI-generated code contains security vulnerabilities.",
    tags: ["vibe coding", "AI coding", "developers", "code security", "AI tools"],
    content: `<iframe width="100%" height="400" src="https://www.youtube.com/embed/L096RJF8uGs" frameborder="0" allowfullscreen></iframe>

<h2>What Happened</h2>

<p>As of early 2026, 92% of US-based developers have adopted some form of AI coding in their workflows. 40% of new SaaS MVPs are being built primarily using vibe coding. 25% of startups in Y Combinator's latest batch run on codebases that are 95% AI-generated.</p>

<p>But here's the number nobody talks about: <strong>45% of AI-generated code contains security vulnerabilities.</strong></p>

<h2>The Double-Edged Sword</h2>

<p>AI coding tools have made development dramatically faster. A solo founder can build what used to require a team. But speed without security creates a different kind of debt — one that attackers can collect on.</p>

<p>The developers who understand AI orchestration can build systems that catch vulnerabilities before they ship. The ones who just "vibe" without reviewing are building future breach headlines.</p>

<h2>The Numbers</h2>

<ul>
<li><strong>92%</strong> — of US developers use AI coding tools</li>
<li><strong>40%</strong> — of new SaaS MVPs built primarily through vibe coding</li>
<li><strong>25%</strong> — of YC startups run on 95%+ AI-generated code</li>
<li><strong>45%</strong> — of AI-generated code has security vulnerabilities</li>
</ul>

<h2>The Orchestrator Advantage</h2>

<p>Orchestrators don't just generate code — they build pipelines that generate, review, test, and validate code. That's the difference between vibe coding and production engineering. <a href="/courses">Learn to build secure AI workflows</a>.</p>`,
  },
  {
    slug: "chatgpt-super-app-400-million-users",
    title: "ChatGPT Becomes a Super App — 400 Million Weekly Users",
    videoId: "TyQSWQLMQmA",
    shortId: "cihaAjmdlYo",
    excerpt: "ChatGPT is no longer a chatbot. With 400M weekly users, it's now a super app for research, coding, browsing, presentations, and software deployment.",
    metaDescription: "ChatGPT evolves into a super app with 400M weekly users. Research, code, browse, create presentations, analyze spreadsheets, deploy software — all from one interface.",
    tags: ["ChatGPT", "super app", "OpenAI", "GPT-5.4", "AI assistant"],
    content: `<iframe width="100%" height="400" src="https://www.youtube.com/embed/TyQSWQLMQmA" frameborder="0" allowfullscreen></iframe>

<h2>What Happened</h2>

<p>ChatGPT is no longer a chatbot — it's a super app. With GPT-5.4 powering the backend, users can now research, code, browse, create presentations, analyze spreadsheets, and deploy software, all from one interface. Over 400 million weekly active users are using it this way.</p>

<h2>From Chatbot to Operating System</h2>

<p>The evolution of ChatGPT mirrors what happened with WeChat in China — start as a messaging app, then add payments, shopping, services, until it becomes the interface through which people do everything. ChatGPT is doing the same thing for knowledge work.</p>

<p>The difference is that ChatGPT doesn't just route you to other apps. It does the work itself. Research that took an afternoon now takes 90 seconds. A spreadsheet analysis that required an analyst can be done in a conversation.</p>

<h2>The Numbers</h2>

<ul>
<li><strong>400 million</strong> — weekly active users</li>
<li><strong>GPT-5.4</strong> — powering all capabilities</li>
<li><strong>One interface</strong> — for research, coding, browsing, presentations, spreadsheets, deployment</li>
</ul>

<h2>Why Orchestrators Should Pay Attention</h2>

<p>ChatGPT becoming a super app validates the core thesis of AI orchestration — the value isn't in individual AI capabilities, it's in combining them into unified workflows. OpenAI built the consumer version. You can build the enterprise version for your domain. <a href="/courses">Learn how to orchestrate AI systems</a>.</p>`,
  },
];

async function main() {
  const results = [];

  for (let i = 0; i < POSTS.length; i++) {
    const post = POSTS[i];
    const scheduledAt = new Date(SCHEDULE_START.getTime() + i * 3 * 24 * 60 * 60 * 1000);

    const body = {
      slug: post.slug,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      meta_description: post.metaDescription,
      tags: post.tags,
      author_name: "Orchestrator Academy",
      status: "scheduled",
      published: false,
      scheduled_at: scheduledAt.toISOString(),
      youtube_video_id: post.videoId,
      youtube_short_id: post.shortId,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
      method: "POST",
      headers: {
        "apikey": SERVICE_KEY,
        "Authorization": `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`✗ ${post.slug}: ${res.status} ${text}`);
    } else {
      console.log(`✓ [${i + 1}/10] ${post.slug} → scheduled ${scheduledAt.toISOString().slice(0, 10)} 3:00 PM PDT`);
      results.push({ slug: post.slug, scheduledAt: scheduledAt.toISOString(), videoId: post.videoId, shortId: post.shortId });
    }
  }

  console.log("\n=== SCHEDULE ===");
  for (const r of results) {
    const date = new Date(r.scheduledAt);
    console.log(`${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} — ${r.slug} (${r.videoId} / ${r.shortId})`);
  }
}

main().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});

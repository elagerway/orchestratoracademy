import Link from "next/link"
import Image from "next/image"
import {
  BrainCircuit,
  Workflow,
  MessageSquare,
  Bot,
  Check,
  ArrowRight,
  Shield,
  Database,
  RefreshCw,
  GitBranch,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroImageRotator } from "@/components/landing/hero-image-rotator"
import { createClient } from "@/lib/supabase/server"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { BuyMeCoffeeButton } from "@/components/buy-me-coffee"
import { BookCallButton } from "@/components/book-call"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const skills = [
  {
    icon: BrainCircuit,
    title: "Prompt Engineering",
    description:
      "Craft precise prompts that get reliable, high-quality outputs from any AI model.",
  },
  {
    icon: Bot,
    title: "Multi-Agent Systems",
    description:
      "Design teams of AI agents that collaborate, delegate, and hire each other.",
  },
  {
    icon: Workflow,
    title: "AI Workflows",
    description:
      "Build automation pipelines that connect AI models, APIs, and business logic.",
  },
  {
    icon: MessageSquare,
    title: "AI Communications",
    description:
      "Build voice and chat agents that handle real customer conversations.",
  },
  {
    icon: Shield,
    title: "Security & Governance",
    description:
      "Lock down deployments with OWASP compliance, deny rules, sandboxing, and security agents.",
  },
  {
    icon: Database,
    title: "Context & Memory",
    description:
      "Build compounding knowledge bases that make your AI smarter every day.",
  },
  {
    icon: RefreshCw,
    title: "Self-Improving Agents",
    description:
      "Agents that optimize their own prompts and skills overnight using autoresearch.",
  },
  {
    icon: GitBranch,
    title: "Model Routing",
    description:
      "Route tasks to the right model at the right cost — Haiku for speed, Opus for reasoning.",
  },
]

const courseModules = [
  "Welcome to AI Orchestration",
  "The AI Orchestrator Role",
  "Tools & Platforms Landscape",
  "Prompt Engineering Fundamentals",
  "Building Your First AI Workflow",
  "AI Ethics & Responsible Use",
  "Understanding APIs & AI APIs",
  "MCP (Model Context Protocol)",
  "Claude Code Fundamentals",
  "RAG & AI Tool Use",
  "Next.js, Supabase & Vercel",
  "TypeScript, Git & Deployment",
  "Building Full-Stack AI Apps",
]

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Start with the foundations.",
    features: [
      "AI Orchestration Foundations (28 modules)",
      "Community discussion access",
      "Course completion certificate",
      "Basic prompt templates",
    ],
    cta: "Start Free Course",
    href: "/auth/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "Unlock every course and project.",
    features: [
      "Everything in Free",
      "All current & future courses",
      "Hands-on projects & labs",
      "Downloadable resources & templates",
      "Priority community support",
      "Monthly live Q&A sessions",
    ],
    cta: "Go Pro",
    href: "/auth/signup?plan=pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$99",
    period: "/mo",
    description: "Upskill your entire team.",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Team progress dashboard",
      "Admin & reporting tools",
      "Custom learning paths",
      "Dedicated onboarding call",
    ],
    cta: "Contact Us",
    href: "/auth/signup?plan=team",
    highlighted: false,
  },
]

const faqItems = [
  {
    question: "What is an AI Orchestrator?",
    answer:
      "An AI Orchestrator designs, connects, and manages AI-powered systems and workflows. Rather than building models from scratch, orchestrators combine existing AI tools, APIs, and agents to solve real business problems.",
  },
  {
    question: "Do I need coding experience?",
    answer:
      "No. The foundations course is designed for complete beginners. We start with concepts and no-code tools, then gradually introduce light scripting in the Pro courses.",
  },
  {
    question: "Is everything really free?",
    answer:
      "Yes. Every course — Foundations, Superpowers, the advanced courses — is free with no credit card required. If the Academy helps you, you can tip us via Buy Me a Coffee.",
  },
  {
    question: "How long does the free course take?",
    answer:
      "Most learners complete it in 4\u20136 hours. Go at your own pace and pick up where you left off.",
  },
  {
    question: "Can I work with Erik directly?",
    answer:
      "Yes. You can book a 1:1 consultation for help applying AI orchestration to your own project, team, or business. See the scheduling link on the home page or in your dashboard.",
  },
  {
    question: "Do I get a certificate?",
    answer:
      "Yes. Every completed course earns a verifiable certificate you can share on LinkedIn or include on your resume.",
  },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const startHref = user ? "/courses/ai-orchestration-foundations" : "/auth/signup";

  return (
    <>
      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden bg-background">
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28 lg:pb-40 lg:pt-36">
          <div className="relative">
            {/* Background image — behind copy */}
            <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block lg:w-[480px] xl:w-[540px]">
              <div className="opacity-80">
                <HeroImageRotator />
              </div>
            </div>

            {/* Copy — always on top */}
            <div className="relative z-10">
              <div className="animate-fade-up">
                <span className="inline-block rounded-full border border-emerald-accent/30 bg-emerald-accent/8 px-4 py-1.5 text-[13px] font-medium text-emerald-accent">
                  Now available — 8 courses, 155+ lessons
                </span>
              </div>

              <h1 className="animate-fade-up-delay-1 mt-8 max-w-3xl font-heading text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                Become an
                <br />
                <span className="text-emerald-accent">AI Orchestrator</span>
              </h1>

              <p className="animate-fade-up-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                The world doesn&rsquo;t need more AI tools&thinsp;&mdash;&thinsp;it
                needs people who know how to orchestrate them. Learn to design,
                connect, and manage AI systems that deliver real results.
              </p>

              <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap items-center gap-4">
                <Link href={startHref}>
                  <Button
                    size="lg"
                    className="bg-emerald-accent px-7 text-emerald-accent-foreground hover:bg-emerald-accent/90"
                  >
                    Start Free Course
                    <ArrowRight className="ml-1.5 size-4" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button variant="outline" size="lg" className="px-7">
                    Explore Courses
                  </Button>
                </Link>
              </div>

              <p className="mt-12 text-sm tracking-wide text-muted-foreground">
                8 courses &middot; 155+ lessons &middot; Free to start
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- What You'll Learn ---- */}
      <section id="courses" className="border-t border-border/60 bg-secondary/50 dark:bg-secondary/30">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="max-w-lg">
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              What you&rsquo;ll learn
            </h2>
            <p className="mt-3 text-muted-foreground">
              Core skills every AI Orchestrator needs to master.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((skill) => (
              <Card
                key={skill.title}
                className="group border-border/60 bg-background transition-colors duration-300 hover:border-emerald-accent/40"
              >
                <CardHeader>
                  <div className="flex size-10 items-center justify-center rounded-lg border border-border/60 bg-secondary/60 transition-colors duration-300 group-hover:border-emerald-accent/30 group-hover:bg-emerald-accent/8">
                    <skill.icon className="size-5 text-muted-foreground transition-colors duration-300 group-hover:text-emerald-accent" />
                  </div>
                  <CardTitle className="mt-3 text-[15px] font-semibold">
                    {skill.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {skill.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Course Preview ---- */}
      <section className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              AI Orchestration Foundations
            </h2>
            <p className="mt-3 text-muted-foreground">
              28 modules covering AI orchestration, MCP, Claude Code, APIs, and the full-stack infrastructure. Completely free.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-2xl">
            <div className="divide-y divide-border/60 rounded-xl border border-border/60 bg-card">
              {courseModules.map((title, i) => (
                <div
                  key={i}
                  className="group flex items-center gap-5 px-6 py-4 transition-colors duration-200 hover:bg-secondary/50"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center font-heading text-sm font-semibold text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-[15px] font-medium">{title}</span>
                  <span className="rounded-full bg-emerald-accent/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-accent">
                    Free
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href={startHref}>
                <Button
                  size="lg"
                  className="bg-emerald-accent px-7 text-emerald-accent-foreground hover:bg-emerald-accent/90"
                >
                  Enroll for Free
                  <ArrowRight className="ml-1.5 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Pricing (free, tip jar, 1:1 paid) ---- */}
      <section id="pricing" className="border-t border-border/60 bg-secondary/50 dark:bg-secondary/30">
        <div className="mx-auto max-w-4xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Every course is free
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Every course, every lesson, every quiz. No paywall, no credit card, no trial.
              If the Academy helped you, a coffee goes a long way toward the next course.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <BuyMeCoffeeButton />
              <Link href="/courses" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                or browse the courses &rarr;
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-2xl rounded-xl border border-border bg-background p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <h3 className="font-heading text-xl font-semibold">Want 1:1 help?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Book a paid consultation for hands-on help applying AI orchestration to
                  your project, team, or business. Free courses for everyone; paid time
                  for teams that want it applied to their specific situation.
                </p>
              </div>
              <BookCallButton />
            </div>
          </div>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section id="faq" className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-muted-foreground">
              Everything you need to know before getting started.
            </p>
          </div>
          <div className="mt-14">
            <Accordion>
              {faqItems.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-[15px]">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="leading-relaxed text-muted-foreground">
                      {item.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ---- Final CTA ---- */}
      <section className="border-t border-border/60 bg-secondary/50 dark:bg-secondary/30">
        <div className="mx-auto max-w-6xl px-5 py-24 text-center sm:px-8 sm:py-32">
          <h2 className="mx-auto max-w-lg font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to start your journey?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Join learners building the most in-demand skill set in AI. The
            foundations course is completely free&thinsp;&mdash;&thinsp;no credit
            card required.
          </p>
          <div className="mt-9">
            <Link href={startHref}>
              <Button
                size="lg"
                className="bg-emerald-accent px-9 text-emerald-accent-foreground hover:bg-emerald-accent/90"
              >
                Start Free Course
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

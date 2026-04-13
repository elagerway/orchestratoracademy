import Link from "next/link"
import {
  ArrowRight,
  Check,
  TrendingUp,
  DollarSign,
  Trophy,
  ClipboardCheck,
  GraduationCap,
  Rocket,
  Users,
  BarChart3,
  Settings,
  Route,
  Phone,
  BookOpen,
  MessageSquare,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const benefits = [
  {
    icon: TrendingUp,
    title: "Boost Productivity",
    stat: "40%",
    statLabel: "faster workflows",
    description:
      "Teams trained in AI orchestration automate repetitive work and build smarter pipelines, freeing hours every week for high-impact tasks.",
  },
  {
    icon: DollarSign,
    title: "Reduce Costs",
    stat: "60%",
    statLabel: "less tool sprawl",
    description:
      "Stop paying for overlapping AI subscriptions. Orchestrators know how to consolidate tools and get more from fewer platforms.",
  },
  {
    icon: Trophy,
    title: "Competitive Advantage",
    stat: "3x",
    statLabel: "faster adoption",
    description:
      "Companies with trained AI orchestrators adopt new AI capabilities three times faster than those without dedicated expertise.",
  },
]

const steps = [
  {
    icon: ClipboardCheck,
    step: "01",
    title: "Assess",
    description:
      "We evaluate your team's current AI readiness and identify the highest-impact skills gaps to close first.",
  },
  {
    icon: GraduationCap,
    step: "02",
    title: "Train",
    description:
      "Your team works through structured courses, hands-on labs, and real-world projects at their own pace.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Deploy",
    description:
      "Graduates apply their skills immediately, building AI workflows and automations that drive measurable results.",
  },
]

const teamFeatures = [
  { icon: Users, text: "Up to 10 team members included" },
  { icon: BookOpen, text: "All current & future courses" },
  { icon: BarChart3, text: "Team progress dashboard" },
  { icon: Settings, text: "Admin & reporting tools" },
  { icon: Route, text: "Custom learning paths" },
  { icon: Phone, text: "Dedicated onboarding call" },
  { icon: MessageSquare, text: "Priority community support" },
  { icon: GraduationCap, text: "Monthly live Q&A sessions" },
]

const testimonials = [
  {
    quote:
      "Our ops team automated three entire workflows in the first month. The ROI was immediate.",
    name: "Sarah K.",
    role: "VP of Operations",
    company: "TechCorp",
  },
  {
    quote:
      "Finally, a training program that teaches people how to actually use AI tools together, not just individually.",
    name: "Marcus L.",
    role: "Head of Learning & Development",
    company: "ScaleUp Inc.",
  },
  {
    quote:
      "The team plan paid for itself before the first billing cycle ended. Highly recommend.",
    name: "Priya R.",
    role: "CTO",
    company: "DataFlow",
  },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ForCompaniesPage() {
  return (
    <>
      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden bg-background">
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28 lg:pb-40 lg:pt-36">
          <div className="animate-fade-up">
            <span className="inline-block rounded-full border border-emerald-accent/30 bg-emerald-accent/8 px-4 py-1.5 text-[13px] font-medium text-emerald-accent">
              For teams &amp; organizations
            </span>
          </div>

          <h1 className="animate-fade-up-delay-1 mt-8 max-w-3xl font-heading text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Elevate Your Team with{" "}
            <span className="text-emerald-accent">AI Orchestration</span>
          </h1>

          <p className="animate-fade-up-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Give your team the skills to design, connect, and manage AI systems
            that deliver real business results. Structured training, hands-on
            projects, and measurable outcomes.
          </p>

          <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap items-center gap-4">
            <Link href="/auth/signup?plan=team">
              <Button
                size="lg"
                className="bg-emerald-accent px-7 text-emerald-accent-foreground hover:bg-emerald-accent/90"
              >
                Get Started with Team Plan
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </Link>
            <Link href="#contact">
              <Button variant="outline" size="lg" className="px-7">
                Contact Us
              </Button>
            </Link>
          </div>

          <p className="mt-12 text-sm tracking-wide text-muted-foreground">
            $99/mo &middot; Up to 10 members &middot; Cancel anytime
          </p>
        </div>
      </section>

      {/* ---- Benefits ---- */}
      <section className="border-t border-border/60 bg-secondary/50 dark:bg-secondary/30">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="max-w-lg">
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Why train your team?
            </h2>
            <p className="mt-3 text-muted-foreground">
              AI orchestration skills deliver measurable impact across every
              department.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <Card
                key={benefit.title}
                className="group border-border/60 bg-background transition-colors duration-300 hover:border-emerald-accent/40"
              >
                <CardHeader>
                  <div className="flex size-10 items-center justify-center rounded-lg border border-border/60 bg-secondary/60 transition-colors duration-300 group-hover:border-emerald-accent/30 group-hover:bg-emerald-accent/8">
                    <benefit.icon className="size-5 text-muted-foreground transition-colors duration-300 group-hover:text-emerald-accent" />
                  </div>
                  <CardTitle className="mt-3 text-[15px] font-semibold">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <span className="font-heading text-3xl font-bold tracking-tight text-emerald-accent">
                      {benefit.stat}
                    </span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {benefit.statLabel}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ---- How It Works ---- */}
      <section className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              A proven three-step process to upskill your team.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-8 lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-xl border border-border/60 bg-secondary/60">
                  <step.icon className="size-6 text-emerald-accent" />
                </div>
                <span className="mt-5 block font-heading text-sm font-semibold uppercase tracking-wider text-emerald-accent">
                  Step {step.step}
                </span>
                <h3 className="mt-2 font-heading text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Team Plan Features ---- */}
      <section className="border-t border-border/60 bg-secondary/50 dark:bg-secondary/30">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything in the Team Plan
            </h2>
            <p className="mt-3 text-muted-foreground">
              One subscription, full access for your entire team.
            </p>
            <div className="mt-4">
              <span className="font-heading text-5xl font-bold tracking-tight">
                $99
              </span>
              <span className="ml-1 text-sm text-muted-foreground">/mo</span>
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-2">
            {teamFeatures.map((feature) => (
              <div
                key={feature.text}
                className="flex items-center gap-4 rounded-xl border border-border/60 bg-background px-5 py-4 transition-colors duration-200 hover:border-emerald-accent/30"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-accent/10">
                  <feature.icon className="size-4 text-emerald-accent" />
                </div>
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/auth/signup?plan=team">
              <Button
                size="lg"
                className="bg-emerald-accent px-9 text-emerald-accent-foreground hover:bg-emerald-accent/90"
              >
                Get Started with Team Plan
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Testimonials ---- */}
      <section className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Trusted by teams
            </h2>
            <p className="mt-3 text-muted-foreground">
              Hear from companies already upskilling with AI Orchestrator
              Academy.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <Card
                key={t.name}
                className="border-border/60 bg-background"
              >
                <CardContent className="pt-2">
                  <p className="text-sm leading-relaxed text-muted-foreground italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-5">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Contact CTA ---- */}
      <section
        id="contact"
        className="border-t border-border/60 bg-secondary/50 dark:bg-secondary/30"
      >
        <div className="mx-auto max-w-6xl px-5 py-24 text-center sm:px-8 sm:py-32">
          <h2 className="mx-auto max-w-lg font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Need a custom plan?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            For teams larger than 10 or enterprise requirements, reach out and
            we&rsquo;ll put together a tailored package.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href="/auth/signup?plan=team">
              <Button
                size="lg"
                className="bg-emerald-accent px-9 text-emerald-accent-foreground hover:bg-emerald-accent/90"
              >
                Get Started with Team Plan
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </Link>
            <a href="mailto:hello@orchestratoracademy.com">
              <Button variant="outline" size="lg" className="px-7">
                <Mail className="mr-1.5 size-4" />
                Contact Us
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

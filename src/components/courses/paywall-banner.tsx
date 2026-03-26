"use client"

import Link from "next/link"
import { Lock, Check, ArrowRight, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

interface PaywallBannerProps {
  courseName: string
}

const proFeatures = [
  "All current & future courses",
  "Hands-on projects & labs",
  "Downloadable resources & templates",
  "Priority community support",
  "Monthly live Q&A sessions",
]

export function PaywallBanner({ courseName }: PaywallBannerProps) {
  const handleUpgrade = async () => {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro" }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card className="border-emerald-accent/40 bg-background">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border border-border/60 bg-secondary/60">
            <Lock className="size-5 text-emerald-accent" />
          </div>
          <CardTitle className="font-heading text-xl font-semibold">
            This is a premium course
          </CardTitle>
          <CardDescription className="mt-1 text-base">
            <span className="font-medium text-foreground">{courseName}</span>{" "}
            requires a Pro or Team subscription to access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 rounded-lg border border-border/60 bg-secondary/30 p-5">
            <p className="mb-3 text-sm font-semibold">
              What&apos;s included with Pro:
            </p>
            <ul className="space-y-2.5">
              {proFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-accent" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="w-full bg-emerald-accent text-emerald-accent-foreground hover:bg-emerald-accent/90"
              onClick={handleUpgrade}
            >
              Upgrade to Pro — $29/mo
              <ArrowRight className="ml-1.5 size-4" />
            </Button>
            <Link href="/courses" className="w-full">
              <Button variant="outline" size="lg" className="w-full">
                <BookOpen className="mr-1.5 size-4" />
                Start with Free Courses
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

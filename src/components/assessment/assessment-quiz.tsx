"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Assessment } from "@/lib/types/database";

interface AssessmentQuizProps {
  assessment: Assessment;
  courseSlug: string;
}

type QuizState = "intro" | "quiz" | "submitting" | "results";

interface QuizResult {
  passed: boolean;
  score: number;
  passingScore?: number;
  certificateNumber?: string;
}

export function AssessmentQuiz({ assessment, courseSlug }: AssessmentQuizProps) {
  const [state, setState] = useState<QuizState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(assessment.questions.length).fill(null)
  );
  const [result, setResult] = useState<QuizResult | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(
    assessment.time_limit_minutes
      ? assessment.time_limit_minutes * 60
      : null
  );

  const totalQuestions = assessment.questions.length;
  const question = assessment.questions[currentQuestion];
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const allAnswered = answers.every((a) => a !== null);

  const handleSubmit = useCallback(async () => {
    setState("submitting");

    try {
      const res = await fetch("/api/assessments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessment_id: assessment.id,
          answers: answers as number[],
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit assessment");
      }

      const data = await res.json();
      setResult(data);
      setState("results");
    } catch {
      setState("quiz");
      alert("Failed to submit assessment. Please try again.");
    }
  }, [assessment.id, answers]);

  // Countdown timer
  useEffect(() => {
    if (state !== "quiz" || timeLeft === null) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [state, timeLeft, handleSubmit]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleTryAgain = () => {
    setAnswers(new Array(assessment.questions.length).fill(null));
    setCurrentQuestion(0);
    setResult(null);
    setTimeLeft(
      assessment.time_limit_minutes
        ? assessment.time_limit_minutes * 60
        : null
    );
    setState("intro");
  };

  // Intro screen
  if (state === "intro") {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-heading">
            {assessment.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            {assessment.description}
          </p>

          <div className="mx-auto grid max-w-sm gap-3">
            <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <span className="text-sm text-muted-foreground">Questions</span>
              <span className="font-medium">{totalQuestions}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <span className="text-sm text-muted-foreground">
                Passing Score
              </span>
              <span className="font-medium">{assessment.passing_score}%</span>
            </div>
            {assessment.time_limit_minutes && (
              <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                <span className="text-sm text-muted-foreground">
                  Time Limit
                </span>
                <span className="font-medium">
                  {assessment.time_limit_minutes} minutes
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Button size="lg" onClick={() => setState("quiz")}>
              Start Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Results screen
  if (state === "results" && result) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
          {result.passed ? (
            <>
              <div className="flex size-20 items-center justify-center rounded-full bg-emerald-accent/10">
                <CheckCircle2 className="size-10 text-emerald-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-heading">
                  Congratulations!
                </h2>
                <p className="mt-2 text-muted-foreground">
                  You passed with a score of{" "}
                  <span className="font-semibold text-emerald-accent">
                    {result.score}%
                  </span>
                </p>
              </div>
              <div className="flex gap-3">
                {result.certificateNumber && (
                  <Link href={`/certificates/${result.certificateNumber}`}>
                    <Button size="lg">
                      <Award className="size-4" />
                      View Certificate
                    </Button>
                  </Link>
                )}
                <Link href={`/courses/${courseSlug}`}>
                  <Button variant="outline" size="lg">
                    Back to Course
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="flex size-20 items-center justify-center rounded-full bg-destructive/10">
                <XCircle className="size-10 text-destructive" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-heading">
                  Not Quite There
                </h2>
                <p className="mt-2 text-muted-foreground">
                  You scored{" "}
                  <span className="font-semibold">{result.score}%</span>. You
                  need at least{" "}
                  <span className="font-semibold">
                    {result.passingScore}%
                  </span>{" "}
                  to pass.
                </p>
              </div>
              <div className="flex gap-3">
                <Button size="lg" onClick={handleTryAgain}>
                  <RotateCcw className="size-4" />
                  Try Again
                </Button>
                <Link href={`/courses/${courseSlug}`}>
                  <Button variant="outline" size="lg">
                    Review Course
                  </Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  // Submitting screen
  if (state === "submitting") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Submitting your answers...</p>
        </CardContent>
      </Card>
    );
  }

  // Quiz screen
  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          Question {currentQuestion + 1} of {totalQuestions}
        </p>
        {timeLeft !== null && (
          <Badge
            variant={timeLeft < 60 ? "destructive" : "secondary"}
            className="gap-1 tabular-nums"
          >
            <Clock className="size-3" />
            {formatTime(timeLeft)}
          </Badge>
        )}
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {assessment.questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentQuestion(i)}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i === currentQuestion
                ? "bg-emerald-accent"
                : answers[i] !== null
                  ? "bg-emerald-accent/40"
                  : "bg-muted"
            )}
            aria-label={`Go to question ${i + 1}`}
          />
        ))}
      </div>

      {/* Question card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.options.map((option, optionIndex) => (
            <button
              key={optionIndex}
              onClick={() => handleSelectAnswer(optionIndex)}
              className={cn(
                "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                answers[currentQuestion] === optionIndex
                  ? "border-emerald-accent bg-emerald-accent/5 text-foreground ring-1 ring-emerald-accent"
                  : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
              )}
            >
              <span className="mr-3 inline-flex size-6 items-center justify-center rounded-full border text-xs font-medium">
                {String.fromCharCode(65 + optionIndex)}
              </span>
              {option}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion((prev) => prev - 1)}
          disabled={currentQuestion === 0}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>

        {isLastQuestion ? (
          <Button onClick={handleSubmit} disabled={!allAnswered}>
            Submit Assessment
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentQuestion((prev) => prev + 1)}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Confetti } from "./confetti";
import { AchievementToast } from "./achievement-toast";
import { ArrowRight, Brain, RotateCcw, Sparkles } from "lucide-react";
import type { ModuleQuiz as ModuleQuizType } from "@/lib/types/database";

interface ModuleQuizProps {
  quiz: ModuleQuizType;
  moduleTitle: string;
  courseSlug: string;
}

type QuizState = "intro" | "active" | "feedback" | "results";

interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
  xpEarned: number;
  newLevel: number;
  achievements: string[];
}

export function ModuleQuiz({ quiz, moduleTitle, courseSlug }: ModuleQuizProps) {
  const router = useRouter();
  const [state, setState] = useState<QuizState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [xpAnimating, setXpAnimating] = useState(false);

  const questions = quiz.questions;
  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question?.correct;

  const handleStartQuiz = () => {
    setState("active");
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setResult(null);
  };

  const advanceToNext = useCallback(() => {
    const newAnswers = [...answers, selectedAnswer!];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setState("active");
    } else {
      // Submit quiz
      submitQuiz(newAnswers);
    }
  }, [answers, selectedAnswer, currentQuestion, questions.length]);

  useEffect(() => {
    if (state !== "feedback") return;
    const timer = setTimeout(() => {
      advanceToNext();
    }, 1500);
    return () => clearTimeout(timer);
  }, [state, advanceToNext]);

  const handleSelectAnswer = (optionIndex: number) => {
    if (state !== "active") return;
    setSelectedAnswer(optionIndex);
    setState("feedback");
  };

  async function submitQuiz(finalAnswers: number[]) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/gamification/quiz-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module_quiz_id: quiz.id,
          answers: finalAnswers,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit quiz");

      const data: QuizResult = await res.json();
      setResult(data);
      setState("results");

      if (data.passed) {
        setShowConfetti(true);
        setTimeout(() => setXpAnimating(true), 300);
      }

      if (data.achievements.length > 0) {
        setUnlockedAchievements(data.achievements);
      }
    } catch (error) {
      console.error("Quiz submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const getResultEmoji = (score: number, total: number) => {
    if (score === total) return { emoji: "🏆", label: "Perfect Score!", sub: "You absolutely crushed it!" };
    if (score >= Math.ceil(total * 2 / 3)) return { emoji: "🎯", label: "Great Job!", sub: "You passed with flying colors!" };
    return { emoji: "💪", label: "Keep Going!", sub: "Review the material and try again — you got this!" };
  };

  // Intro screen
  if (state === "intro") {
    return (
      <Card className="mx-auto max-w-lg overflow-hidden">
        <CardContent className="flex flex-col items-center gap-6 py-10 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-accent/10">
            <Brain className="size-8 text-emerald-accent" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold">Module Quiz: {moduleTitle}</h3>
            <p className="mt-2 text-muted-foreground">
              {questions.length} quick questions to test what you learned
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-accent/10 px-4 py-2 text-sm font-medium text-emerald-accent">
            <Sparkles className="size-4" />
            Earn up to {quiz.xp_reward} XP
          </div>
          <Button size="lg" className="w-full max-w-xs" onClick={handleStartQuiz}>
            Start Quiz
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Results screen
  if (state === "results" && result) {
    const { emoji, label, sub } = getResultEmoji(result.score, result.total);

    return (
      <>
        <Confetti show={showConfetti} />
        {unlockedAchievements.map((title, i) => (
          <AchievementToast
            key={title}
            title={title}
            description="New achievement unlocked!"
            icon="trophy"
            xpReward={0}
            onDismiss={() =>
              setUnlockedAchievements((prev) => prev.filter((_, j) => j !== i))
            }
          />
        ))}
        <Card className="mx-auto max-w-lg overflow-hidden">
          <CardContent className="flex flex-col items-center gap-6 py-10 text-center">
            <span className="text-6xl" role="img" aria-label="result">
              {emoji}
            </span>
            <div>
              <h3 className="font-heading text-2xl font-bold">{label}</h3>
              <p className="mt-1 text-muted-foreground">{sub}</p>
            </div>
            <div className="text-4xl font-bold">
              {result.score} / {result.total}
            </div>
            {result.xpEarned > 0 && (
              <div
                className={`transform text-lg font-bold text-emerald-accent transition-all duration-700 ${
                  xpAnimating ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                +{result.xpEarned} XP earned!
              </div>
            )}
            <div className="flex w-full max-w-xs flex-col gap-3">
              {result.passed ? (
                <Button size="lg" onClick={() => router.push(`/courses/${courseSlug}`)}>
                  Continue to Next Module
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              ) : (
                <Button size="lg" onClick={handleStartQuiz}>
                  <RotateCcw className="mr-2 size-4" />
                  Retake Quiz
                </Button>
              )}
              <Button variant="outline" size="lg" onClick={() => router.push(`/courses/${courseSlug}`)}>
                Back to Course
              </Button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  // Active question + feedback
  return (
    <Card className="mx-auto max-w-lg overflow-hidden">
      <CardContent className="py-8">
        {/* Progress dots */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentQuestion
                  ? "w-8 bg-emerald-accent"
                  : i < currentQuestion
                    ? "w-2 bg-emerald-accent/50"
                    : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        <p className="mb-2 text-center text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </p>

        <h3 className="mb-6 text-center font-heading text-lg font-semibold">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            let variant: "default" | "correct" | "wrong" | "idle" = "idle";
            if (state === "feedback") {
              if (index === question.correct) variant = "correct";
              else if (index === selectedAnswer) variant = "wrong";
            }

            const baseClasses =
              "w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all duration-200";
            const variantClasses = {
              idle: "border-border bg-background hover:border-emerald-accent hover:bg-emerald-accent/5 cursor-pointer",
              correct:
                "border-emerald-accent bg-emerald-accent/10 text-emerald-accent animate-bounce-subtle",
              wrong: "border-destructive bg-destructive/10 text-destructive animate-shake",
              default: "border-border bg-background opacity-50",
            };

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={state === "feedback" || isSubmitting}
                className={`${baseClasses} ${variantClasses[variant]}`}
              >
                <span className="mr-3 inline-flex size-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {state === "feedback" && (
          <div className="mt-4 text-center">
            {isCorrect ? (
              <p className="text-sm font-medium text-emerald-accent">Correct! 🎉</p>
            ) : (
              <p className="text-sm font-medium text-destructive">
                Not quite! The answer is {String.fromCharCode(65 + question.correct)}: {question.options[question.correct]}
              </p>
            )}
          </div>
        )}
      </CardContent>

      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 0.4s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </Card>
  );
}

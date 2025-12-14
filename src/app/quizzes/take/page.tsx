"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight, HelpCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Navbar } from "~/components/layout/navbar";
import { EmptyState } from "~/components/shared";
import { QuizQuestionComponent } from "~/components/quizzes/quiz-question";
import { QuizProgress } from "~/components/quizzes/quiz-progress";
import { QuizResults } from "~/components/quizzes/quiz-results";
import { decodeQuizConfig } from "~/lib/utils/quiz-params";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner";

function TakeQuizContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Parse URL params using shared utility
  const config = decodeQuizConfig(searchParams);
  const { topic, questionCount, isTimed, timePerQuestion, tags } = config;

  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | undefined>(isTimed ? timePerQuestion : undefined);
  const [showResults, setShowResults] = useState(false);
  const [quizStartTime] = useState(Date.now());

  // Generate quiz
  const { data: quizData, isLoading } = api.quiz.generateQuiz.useQuery({
    topic,
    questionCount,
    tags,
    isTimed,
    timePerQuestion,
  });

  // Submit quiz mutation
  const submitQuiz = api.quiz.submitQuiz.useMutation({
    onSuccess: () => {
      toast.success("Quiz submitted successfully!");
      setShowResults(true);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit quiz");
    },
  });

  const questions = quizData?.questions ?? [];
  const currentQuestion = questions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    if (!isTimed || !timeRemaining || showResults) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === undefined || prev <= 1) {
          // Time's up - move to next question
          handleNextQuestion();
          return isTimed ? timePerQuestion : undefined;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, isTimed, timeRemaining, showResults]);

  const handleAnswer = (answerId: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerId,
    }));
  };

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeRemaining(isTimed ? timePerQuestion : undefined);
    } else {
      handleSubmitQuiz();
    }
  }, [currentQuestionIndex, questions.length, isTimed, timePerQuestion]);

  const handleSubmitQuiz = () => {
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);

    const answersArray = questions.map((q) => ({
      questionId: q.id,
      topic: q.topic,
      selectedAnswer: answers[q.id] ?? "",
      correctAnswer: q.correctAnswer,
      isCorrect: answers[q.id] === q.correctAnswer,
    }));

    if (session) {
      // Submit to backend for authenticated users
      submitQuiz.mutate({
        topic,
        tags,
        totalQuestions: questions.length,
        isTimed,
        timeTaken: isTimed ? timeTaken : undefined,
        answers: answersArray,
      });
    } else {
      // Show results immediately for guests
      setShowResults(true);
    }
  };

  const calculateResults = () => {
    const correctAnswers = questions.filter(
      (q) => answers[q.id] === q.correctAnswer
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const timeElapsed = Math.floor((Date.now() - quizStartTime) / 1000);

    return { score, correctAnswers, timeElapsed };
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setTimeRemaining(isTimed ? timePerQuestion : undefined);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navbar />
        <section className="relative overflow-hidden bg-gradient-to-br from-kkpsi-navy via-kkpsi-navy-light to-kkpsi-navy py-8">
          <div className="container mx-auto px-4">
            <Skeleton className="mx-auto h-12 w-64 bg-white/20" />
          </div>
        </section>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl space-y-6">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-[400px] w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!quizData || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navbar />
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl">
              <EmptyState
                icon={HelpCircle}
                title="No Questions Available"
                description="We couldn't generate a quiz with your selected criteria."
                action={{
                  label: "Back to Quiz Setup",
                  onClick: () => window.location.href = "/quizzes",
                }}
              />
            </div>
          </div>
        </section>
      </div>
    );
  }

  const results = calculateResults();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-kkpsi-navy via-kkpsi-navy-light to-kkpsi-navy py-6 md:py-8">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-kkpsi-gold/10 blur-3xl"></div>
        </div>

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            {!showResults && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="mb-3 text-white/80 hover:bg-white/10 hover:text-white"
              >
                <Link href="/quizzes">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Exit Quiz
                </Link>
              </Button>
            )}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-kkpsi-gold" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-white md:text-3xl">
                {showResults ? "Quiz Complete!" : "Quiz in Progress"}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {showResults ? (
            <QuizResults
              score={results.score}
              totalQuestions={questions.length}
              correctAnswers={results.correctAnswers}
              timeElapsed={results.timeElapsed}
              onRetry={handleRetry}
            />
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {/* Progress */}
              <QuizProgress
                currentQuestion={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                timeRemaining={timeRemaining}
                isTimed={isTimed}
              />

              {/* Question */}
              {currentQuestion && (
                <QuizQuestionComponent
                  question={currentQuestion}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                  onAnswer={handleAnswer}
                  selectedAnswer={answers[currentQuestion.id]}
                />
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200/50">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentQuestionIndex > 0) {
                      setCurrentQuestionIndex((prev) => prev - 1);
                      setTimeRemaining(isTimed ? timePerQuestion : undefined);
                    }
                  }}
                  disabled={currentQuestionIndex === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="hidden text-sm text-gray-500 sm:block">
                  {Object.keys(answers).length} of {questions.length} answered
                </div>

                <Button
                  onClick={handleNextQuestion}
                  disabled={!currentQuestion || !answers[currentQuestion.id]}
                  className="gap-2 bg-kkpsi-navy shadow-lg shadow-kkpsi-navy/25 hover:bg-kkpsi-navy-light"
                >
                  {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function TakeQuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navbar />
        <section className="relative overflow-hidden bg-gradient-to-br from-kkpsi-navy via-kkpsi-navy-light to-kkpsi-navy py-8">
          <div className="container mx-auto px-4">
            <Skeleton className="mx-auto h-12 w-64 bg-white/20" />
          </div>
        </section>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl space-y-6">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-[400px] w-full rounded-2xl" />
            </div>
          </div>
        </section>
      </div>
    }>
      <TakeQuizContent />
    </Suspense>
  );
}

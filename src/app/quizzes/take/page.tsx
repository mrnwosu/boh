"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronLeft, HelpCircle } from "lucide-react";
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
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl space-y-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-[400px] w-full" />
              <Skeleton className="h-16 w-full" />
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
      <section className="bg-gradient-to-br from-kkpsi-navy via-kkpsi-navy-light to-kkpsi-navy py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            {!showResults && (
              <Button
                asChild
                variant="ghost"
                className="mb-4 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/quizzes">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Exit Quiz
                </Link>
              </Button>
            )}
            <h1 className="font-serif text-4xl font-bold text-white">
              {showResults ? "Quiz Complete!" : "Quiz in Progress"}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
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
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentQuestionIndex > 0) {
                      setCurrentQuestionIndex((prev) => prev - 1);
                      setTimeRemaining(isTimed ? timePerQuestion : undefined);
                    }
                  }}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>

                <Button
                  onClick={handleNextQuestion}
                  disabled={!currentQuestion || !answers[currentQuestion.id]}
                  className="bg-kkpsi-navy hover:bg-kkpsi-navy-light"
                >
                  {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
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
    <Suspense fallback={<div>Loading...</div>}>
      <TakeQuizContent />
    </Suspense>
  );
}

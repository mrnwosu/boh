"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Navbar } from "~/components/layout/navbar";
import { QuizQuestionComponent } from "~/components/quizzes/quiz-question";
import { QuizProgress } from "~/components/quizzes/quiz-progress";
import { QuizResults } from "~/components/quizzes/quiz-results";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner";

export default function TakeQuizPage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Parse URL params
  const topics = searchParams.get("topics")?.split(",") ?? [];
  const questionCount = parseInt(searchParams.get("count") ?? "10");
  const isTimed = searchParams.get("timed") === "true";
  const timePerQuestion = parseInt(searchParams.get("time") ?? "10");
  const tags = searchParams.get("tags")?.split(",").filter(Boolean);

  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(isTimed ? timePerQuestion : undefined);
  const [showResults, setShowResults] = useState(false);
  const [quizStartTime] = useState(Date.now());

  // Generate quiz
  const { data: quizData, isLoading } = api.quiz.generateQuiz.useQuery({
    topics,
    questionCount,
    tags,
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
    const timeElapsed = Math.floor((Date.now() - quizStartTime) / 1000);

    const answersArray = questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: answers[q.id] ?? "",
    }));

    if (session) {
      // Submit to backend for authenticated users
      submitQuiz.mutate({
        topic: topics[0] ?? "mixed",
        answers: answersArray,
        timeElapsed,
      });
    } else {
      // Show results immediately for guests
      setShowResults(true);
    }
  };

  const calculateResults = () => {
    const correctAnswers = questions.filter(
      (q) => answers[q.id] === q.correctAnswerId
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
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                No Questions Available
              </h1>
              <p className="mb-8 text-gray-600">
                We couldn't generate a quiz with your selected criteria.
              </p>
              <Button asChild>
                <Link href="/quizzes">Back to Quiz Setup</Link>
              </Button>
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

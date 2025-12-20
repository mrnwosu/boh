"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight, HelpCircle, Sparkles, ListChecks, Keyboard } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Navbar } from "~/components/layout/navbar";
import { EmptyState } from "~/components/shared";
import { QuizQuestionComponent } from "~/components/quizzes/quiz-question";
import { QuizProgress } from "~/components/quizzes/quiz-progress";
import { QuizResults } from "~/components/quizzes/quiz-results";
import { QuizReview } from "~/components/quizzes/quiz-review";
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
  const [showReview, setShowReview] = useState(false);
  const [quizStartTime] = useState(Date.now());
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);
  const [celebratingProgress, setCelebratingProgress] = useState(false);
  const [lastCelebration, setLastCelebration] = useState<number>(0);

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
      setShowReview(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit quiz");
    },
  });

  const questions = quizData?.questions ?? [];
  const currentQuestion = questions[currentQuestionIndex];

  // Progress celebration effect
  useEffect(() => {
    if (questions.length === 0) return;
    const answeredCount = Object.keys(answers).length;
    const progress = Math.round((answeredCount / questions.length) * 100);

    // Celebrate at 25%, 50%, 75%, 100%
    const milestones = [25, 50, 75, 100];
    const currentMilestone = milestones.find(m => progress >= m && m > lastCelebration);

    if (currentMilestone && answeredCount > 0) {
      setLastCelebration(currentMilestone);
      setCelebratingProgress(true);

      if (currentMilestone === 50) {
        toast.success("Halfway there! Keep going!", { duration: 2000 });
      } else if (currentMilestone === 100) {
        toast.success("All questions answered!", { duration: 2000 });
      }

      setTimeout(() => setCelebratingProgress(false), 500);
    }
  }, [answers, questions.length, lastCelebration]);

  // Keyboard navigation
  useEffect(() => {
    if (showResults || showReview || !currentQuestion) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();

      // Number keys 1-4 or letter keys A-D to select answer
      const keyToIndex: Record<string, number> = {
        "1": 0, "a": 0,
        "2": 1, "b": 1,
        "3": 2, "c": 2,
        "4": 3, "d": 3,
      };

      const mappedIndex = keyToIndex[key];
      if (mappedIndex !== undefined && currentQuestion.options[mappedIndex]) {
        e.preventDefault();
        const option = currentQuestion.options[mappedIndex];
        if (option) {
          setFocusedOptionIndex(mappedIndex);
          setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: option,
          }));
        }
      }

      // Arrow keys for navigation between questions
      if (e.key === "ArrowLeft" && currentQuestionIndex > 0) {
        e.preventDefault();
        setCurrentQuestionIndex((prev) => prev - 1);
        setTimeRemaining(isTimed ? timePerQuestion : undefined);
        setFocusedOptionIndex(-1);
      }

      if (e.key === "ArrowRight" && answers[currentQuestion.id]) {
        e.preventDefault();
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setTimeRemaining(isTimed ? timePerQuestion : undefined);
          setFocusedOptionIndex(-1);
        } else {
          // Last question - go to review
          setShowReview(true);
        }
      }

      // Arrow up/down to navigate between options
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedOptionIndex((prev) =>
          prev <= 0 ? currentQuestion.options.length - 1 : prev - 1
        );
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedOptionIndex((prev) =>
          prev >= currentQuestion.options.length - 1 ? 0 : prev + 1
        );
      }

      // Enter to select focused option or proceed
      if (e.key === "Enter") {
        e.preventDefault();
        if (focusedOptionIndex >= 0 && focusedOptionIndex < currentQuestion.options.length) {
          const option = currentQuestion.options[focusedOptionIndex];
          if (option) {
            setAnswers((prev) => ({
              ...prev,
              [currentQuestion.id]: option,
            }));
          }
        } else if (answers[currentQuestion.id]) {
          // Move to next question or review
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setTimeRemaining(isTimed ? timePerQuestion : undefined);
            setFocusedOptionIndex(-1);
          } else {
            setShowReview(true);
          }
        }
      }

      // R to go to review (when available)
      if (key === "r" && Object.keys(answers).length > 0) {
        e.preventDefault();
        setShowReview(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showResults, showReview, currentQuestion, currentQuestionIndex, questions.length, answers, isTimed, timePerQuestion, focusedOptionIndex]);

  // Reset focus when question changes
  useEffect(() => {
    setFocusedOptionIndex(-1);
  }, [currentQuestionIndex]);

  // Timer effect
  useEffect(() => {
    if (!isTimed || !timeRemaining || showResults || showReview) return;

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
  }, [currentQuestionIndex, isTimed, timeRemaining, showResults, showReview]);

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
      // Go to review instead of submitting directly
      setShowReview(true);
    }
  }, [currentQuestionIndex, questions.length, isTimed, timePerQuestion]);

  const handleSubmitQuiz = useCallback(() => {
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
      setShowReview(false);
    }
  }, [answers, questions, quizStartTime, session, submitQuiz, topic, tags, isTimed]);

  const calculateResults = () => {
    const correctAnswers = questions.filter(
      (q) => answers[q.id] === q.correctAnswer
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const timeElapsed = Math.floor((Date.now() - quizStartTime) / 1000);

    return { score, correctAnswers, timeElapsed, answers };
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setShowReview(false);
    setTimeRemaining(isTimed ? timePerQuestion : undefined);
    setLastCelebration(0);
  };

  const handleReviewQuestionClick = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowReview(false);
    setTimeRemaining(isTimed ? timePerQuestion : undefined);
  };

  // Countdown state
  const [countdown, setCountdown] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);

  // Start countdown when quiz data is loaded
  useEffect(() => {
    if (quizData && questions.length > 0 && !quizStarted && countdown === null) {
      setCountdown(3);
    }
  }, [quizData, questions.length, quizStarted, countdown]);

  // Countdown timer
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;

    const timer = setTimeout(() => {
      if (countdown === 1) {
        setCountdown(null);
        setQuizStarted(true);
      } else {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
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
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
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

      {/* Countdown Overlay */}
      {countdown !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-kkpsi-navy/90 backdrop-blur-sm">
          <div className="text-center">
            <div className="mb-4 text-lg font-medium text-white/80">Get Ready!</div>
            <div className="animate-countdown text-9xl font-bold text-kkpsi-gold drop-shadow-lg">
              {countdown}
            </div>
            <div className="mt-6 text-sm text-white/60">
              {isTimed ? `${timePerQuestion} seconds per question` : "Take your time"}
            </div>
          </div>
        </div>
      )}

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
              questions={questions}
              answers={results.answers}
            />
          ) : showReview ? (
            <QuizReview
              questions={questions}
              answers={answers}
              onQuestionClick={handleReviewQuestionClick}
              onSubmit={handleSubmitQuiz}
              onBack={() => setShowReview(false)}
              isSubmitting={submitQuiz.isPending}
            />
          ) : (
            <div className={`mx-auto max-w-3xl space-y-6 transition-all duration-300 ${countdown !== null ? "pointer-events-none blur-sm" : ""}`}>
              {/* Progress */}
              <div className={celebratingProgress ? "animate-progress-celebrate" : ""}>
                <QuizProgress
                  currentQuestion={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                  timeRemaining={quizStarted ? timeRemaining : undefined}
                  isTimed={isTimed && quizStarted}
                />
              </div>

              {/* Question */}
              {currentQuestion && (
                <QuizQuestionComponent
                  question={currentQuestion}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                  onAnswer={handleAnswer}
                  selectedAnswer={answers[currentQuestion.id]}
                  focusedIndex={focusedOptionIndex}
                  onFocusChange={setFocusedOptionIndex}
                />
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
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
                  <span className="hidden sm:inline">Previous</span>
                </Button>

                <div className="flex items-center gap-2">
                  <div className="hidden text-sm text-muted-foreground sm:block">
                    {Object.keys(answers).length} of {questions.length} answered
                  </div>
                  {Object.keys(answers).length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowReview(true)}
                      className="gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                      <ListChecks className="h-4 w-4" />
                      <span className="hidden sm:inline">Review</span>
                    </Button>
                  )}
                </div>

                <Button
                  onClick={handleNextQuestion}
                  disabled={!currentQuestion || !answers[currentQuestion.id]}
                  className="gap-2 bg-kkpsi-navy shadow-lg shadow-kkpsi-navy/25 hover:bg-kkpsi-navy-light"
                >
                  <span className="hidden sm:inline">
                    {currentQuestionIndex === questions.length - 1 ? "Review" : "Next"}
                  </span>
                  <span className="sm:hidden">
                    {currentQuestionIndex === questions.length - 1 ? "Review" : "Next"}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Keyboard shortcuts hint */}
              <div className="hidden items-center justify-center gap-6 text-xs text-muted-foreground sm:flex">
                <div className="flex items-center gap-1.5">
                  <Keyboard className="h-3.5 w-3.5" />
                  <span>Shortcuts:</span>
                </div>
                <span><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">1-4</kbd> or <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">A-D</kbd> Select</span>
                <span><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">←</kbd> <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">→</kbd> Navigate</span>
                <span><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">Enter</kbd> Confirm</span>
                <span><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">R</kbd> Review</span>
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
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
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

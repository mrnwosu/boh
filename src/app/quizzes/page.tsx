"use client";

import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { Navbar } from "~/components/layout/navbar";
import { PageHero } from "~/components/shared";
import { QuizConfigForm } from "~/components/quizzes/quiz-config";
import { TOPICS } from "~/lib/content/topics";
import { createQuizUrl, type QuizConfigParams } from "~/lib/utils/quiz-params";

export default function QuizzesPage() {
  const router = useRouter();

  const handleStartQuiz = (config: QuizConfigParams) => {
    router.push(createQuizUrl(config));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <PageHero
        icon={BookOpen}
        title="Quizzes"
        description="Test your knowledge with customizable quizzes"
      />

      {/* Quiz Configuration */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <QuizConfigForm topics={TOPICS} onStartQuiz={handleStartQuiz} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center font-serif text-3xl font-bold text-kkpsi-navy">
              Quiz Features
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-3 text-4xl">⏱️</div>
                <h3 className="mb-2 text-lg font-semibold">Timed Mode</h3>
                <p className="text-sm text-gray-600">
                  Challenge yourself with timed questions or take your time in untimed mode
                </p>
              </div>
              <div className="text-center">
                <div className="mb-3 text-4xl">🎯</div>
                <h3 className="mb-2 text-lg font-semibold">Instant Feedback</h3>
                <p className="text-sm text-gray-600">
                  See detailed results with correct answers highlighted
                </p>
              </div>
              <div className="text-center">
                <div className="mb-3 text-4xl">📊</div>
                <h3 className="mb-2 text-lg font-semibold">Track Progress</h3>
                <p className="text-sm text-gray-600">
                  Monitor your quiz history and improvement over time (sign in required)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

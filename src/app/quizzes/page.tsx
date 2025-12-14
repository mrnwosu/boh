"use client";

import { useRouter } from "next/navigation";
import { Clock, Target, TrendingUp, Sparkles } from "lucide-react";
import { Navbar } from "~/components/layout/navbar";
import { AnimatedSection } from "~/components/shared";
import { QuizConfigForm } from "~/components/quizzes/quiz-config";
import { TOPICS } from "~/lib/content/topics";
import { createQuizUrl, type QuizConfigParams } from "~/lib/utils/quiz-params";

export default function QuizzesPage() {
  const router = useRouter();

  const handleStartQuiz = (config: QuizConfigParams) => {
    router.push(createQuizUrl(config));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-kkpsi-navy via-kkpsi-navy-light to-kkpsi-navy py-16 md:py-20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-kkpsi-gold/10 blur-3xl animate-float"></div>
          <div className="absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-kkpsi-gold/5 blur-3xl animate-float-delayed"></div>
        </div>

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-kkpsi-gold/30 bg-kkpsi-gold/10 px-4 py-2 text-sm font-medium text-kkpsi-gold backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>Test Your Knowledge</span>
            </div>

            <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-white md:text-5xl">
              KKPsi Quizzes
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-300">
              Challenge yourself with customizable quizzes and track your progress
            </p>
          </div>
        </div>
      </section>

      {/* Quiz Configuration */}
      <section className="relative py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <QuizConfigForm topics={TOPICS} onStartQuiz={handleStartQuiz} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-16">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-kkpsi-navy/5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-kkpsi-gold/5 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-kkpsi-navy/5 dark:bg-kkpsi-navy/20 px-4 py-2 text-sm font-medium text-kkpsi-navy dark:text-kkpsi-navy-light">
              <Target className="h-4 w-4" />
              Features
            </div>
            <h2 className="mb-4 font-serif text-3xl font-bold text-kkpsi-navy dark:text-foreground md:text-4xl">
              Quiz Features
            </h2>
          </div>

          <AnimatedSection className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {[
              {
                icon: Clock,
                title: "Timed Mode",
                description:
                  "Challenge yourself with timed questions or take your time in untimed mode",
                accent: "from-blue-500 to-blue-600",
              },
              {
                icon: Target,
                title: "Instant Feedback",
                description:
                  "See detailed results with correct answers highlighted immediately",
                accent: "from-kkpsi-gold to-amber-500",
              },
              {
                icon: TrendingUp,
                title: "Track Progress",
                description:
                  "Monitor your quiz history and improvement over time (sign in required)",
                accent: "from-emerald-500 to-emerald-600",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className={`animate-on-scroll stagger-${index + 1} group relative rounded-xl bg-card p-6 shadow-sm ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-md hover:ring-ring/50`}
              >
                {/* Accent line */}
                <div
                  className={`absolute left-0 top-6 h-10 w-1 rounded-r-full bg-gradient-to-b ${feature.accent}`}
                />

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-muted/80">
                  <feature.icon className="h-6 w-6 text-kkpsi-navy dark:text-kkpsi-navy-light" strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

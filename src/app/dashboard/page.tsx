import { redirect } from "next/navigation";
import Link from "next/link";
import { Brain, Trophy, Target } from "lucide-react";
import { Navbar } from "~/components/layout/navbar";
import { StatsCard } from "~/components/dashboard/stats-card";
import { StreakDisplay } from "~/components/dashboard/streak-display";
import { RecentActivity } from "~/components/dashboard/recent-activity";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  // Fetch user stats
  const flashcardSummary = await api.flashcard.getProgressSummary();
  const quizHistory = await api.quiz.getHistory({ limit: 10 });

  // Calculate stats
  const totalFlashcards = flashcardSummary.reduce((sum, topic) => sum + topic.total, 0);
  const masteredCards = flashcardSummary.reduce((sum, topic) => sum + topic.mastered, 0);
  const dueCards = flashcardSummary.reduce((sum, topic) => sum + topic.learning + topic.reviewing, 0);

  const averageQuizScore =
    quizHistory.length > 0
      ? Math.round(
          quizHistory.reduce((sum, quiz) => sum + quiz.score, 0) / quizHistory.length
        )
      : 0;

  // Recent activity (combine quiz history and flashcard sessions)
  const recentActivity = quizHistory.slice(0, 5).map((quiz) => ({
    id: quiz.id,
    type: "quiz" as const,
    topic: quiz.topic,
    score: quiz.score,
    timestamp: quiz.createdAt,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-kkpsi-navy via-kkpsi-navy-light to-kkpsi-navy py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-2 font-serif text-5xl font-bold text-white">
              Welcome back, {session.user.displayName ?? session.user.name}!
            </h1>
            <p className="text-xl text-gray-200">
              Here&apos;s your learning progress at a glance
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Cards Mastered"
                value={masteredCards}
                icon={Brain}
                description={`Out of ${totalFlashcards} total cards`}
              />
              <StatsCard
                title="Quiz Average"
                value={`${averageQuizScore}%`}
                icon={Trophy}
                description={`Based on ${quizHistory.length} quiz${quizHistory.length !== 1 ? "zes" : ""}`}
              />
              <StatsCard
                title="Cards Due"
                value={dueCards}
                icon={Target}
                description="Ready for review"
              />
              <StatsCard
                title="Total Quizzes"
                value={quizHistory.length}
                icon={Trophy}
                description="Completed"
              />
            </div>

            {/* Streak and Progress */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <StreakDisplay currentStreak={0} longestStreak={0} />
              </div>
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Progress by Topic</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {flashcardSummary.length > 0 ? (
                      flashcardSummary.map((topic) => {
                        const progress = (topic.mastered / topic.total) * 100;
                        return (
                          <div key={topic.topic} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{topic.topic}</span>
                              <span className="text-gray-600">
                                {topic.mastered} / {topic.total}
                              </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center text-sm text-gray-600 py-4">
                        Start studying flashcards to see your progress!
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Activity */}
            <RecentActivity activities={recentActivity} />

            {/* Quick Actions */}
            <Card className="border-2 border-kkpsi-navy">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Link
                    href="/flashcards"
                    className="flex flex-col items-center gap-2 rounded-lg border-2 border-gray-200 p-6 transition-all hover:border-kkpsi-navy hover:shadow-md"
                  >
                    <Brain className="h-8 w-8 text-kkpsi-navy" />
                    <span className="font-medium">Study Flashcards</span>
                    {dueCards > 0 && (
                      <span className="rounded-full bg-kkpsi-gold px-3 py-1 text-xs font-semibold text-kkpsi-navy">
                        {dueCards} due
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/quizzes"
                    className="flex flex-col items-center gap-2 rounded-lg border-2 border-gray-200 p-6 transition-all hover:border-kkpsi-navy hover:shadow-md"
                  >
                    <Trophy className="h-8 w-8 text-kkpsi-navy" />
                    <span className="font-medium">Take a Quiz</span>
                  </Link>
                  <Link
                    href="/info"
                    className="flex flex-col items-center gap-2 rounded-lg border-2 border-gray-200 p-6 transition-all hover:border-kkpsi-navy hover:shadow-md"
                  >
                    <Target className="h-8 w-8 text-kkpsi-navy" />
                    <span className="font-medium">Browse Info</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { Brain, Trophy, Target, Star, Calendar } from "lucide-react";
import { Navbar } from "~/components/layout/navbar";
import { PageHero } from "~/components/shared";
import {
  StatsCard,
  StreakDisplay,
  RecentActivity,
  StudyTodayCta,
  WeeklyChart,
  TopicRecommendations,
  Achievements,
  ActivityHeatmap,
  NextReview,
  DailyGoals,
} from "~/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  // Fetch all dashboard data in parallel
  const [
    flashcardSummary,
    streakData,
    weeklyActivity,
    heatmapData,
    topicPerformance,
    achievements,
    nextReview,
    goals,
    recentActivity,
  ] = await Promise.all([
    api.flashcard.getProgressSummary(),
    api.dashboard.getStreak(),
    api.dashboard.getWeeklyActivity(),
    api.dashboard.getActivityHeatmap(),
    api.dashboard.getTopicPerformance(),
    api.dashboard.getAchievements(),
    api.dashboard.getNextReview(),
    api.dashboard.getGoals(),
    api.dashboard.getRecentActivity({ limit: 5 }),
  ]);

  // Calculate stats
  const totalFlashcards = flashcardSummary.reduce((sum, topic) => sum + topic.total, 0);
  const masteredCards = flashcardSummary.reduce((sum, topic) => sum + topic.mastered, 0);
  const learningCards = flashcardSummary.reduce(
    (sum, topic) => sum + topic.learning + topic.reviewing,
    0
  );

  // Get quiz stats from streak data
  const totalQuizzes = streakData.totalQuizzes;
  const totalDaysActive = streakData.totalDaysActive;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <Navbar />

      <PageHero
        title={`Welcome back, ${session.user.displayName ?? session.user.name}!`}
        description="Track your progress and continue your learning journey"
        size="md"
        align="left"
        maxWidth="6xl"
      />

      {/* Dashboard Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl space-y-6">
            {/* Study Today CTA */}
            <StudyTodayCta
              dueCards={nextReview.dueNow}
              nextReviewDate={nextReview.nextReviewDate}
              cardsToday={goals.cardsToday}
              dailyGoal={goals.dailyCardGoal}
            />

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Cards Mastered"
                value={masteredCards}
                icon={Star}
                description={`Out of ${totalFlashcards} studied`}
                color="gold"
              />
              <StatsCard
                title="Learning"
                value={learningCards}
                icon={Brain}
                description="Cards in progress"
                color="default"
              />
              <StatsCard
                title="Quizzes Taken"
                value={totalQuizzes}
                icon={Trophy}
                description="Total completed"
                color="gold"
              />
              <StatsCard
                title="Days Active"
                value={totalDaysActive}
                icon={Calendar}
                description="Total study days"
                color="green"
              />
            </div>

            {/* Main Grid - Left Column (Charts & Goals) | Right Column (Streak & Recommendations) */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Column - 2/3 width */}
              <div className="space-y-6 lg:col-span-2">
                {/* Weekly Chart & Daily Goals Row */}
                <div className="grid gap-6 md:grid-cols-2">
                  <WeeklyChart data={weeklyActivity} />
                  <DailyGoals
                    dailyCardGoal={goals.dailyCardGoal}
                    dailyQuizGoal={goals.dailyQuizGoal}
                    cardsToday={goals.cardsToday}
                    quizzesToday={goals.quizzesToday}
                  />
                </div>

                {/* Activity Heatmap */}
                <ActivityHeatmap data={heatmapData} />

                {/* Progress by Topic */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Target className="h-5 w-5 text-kkpsi-navy dark:text-kkpsi-navy-light" />
                      Progress by Topic
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {flashcardSummary.length > 0 ? (
                      flashcardSummary.map((topic) => {
                        const progress =
                          topic.total > 0 ? (topic.mastered / topic.total) * 100 : 0;
                        const topicName = topic.topic
                          .split("_")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ");

                        return (
                          <Link
                            key={topic.topic}
                            href={`/flashcards/${topic.topic.replace(/_/g, "-")}`}
                            className="group block"
                          >
                            <div className="space-y-2 rounded-lg p-2 transition-colors hover:bg-muted/50">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium group-hover:text-kkpsi-navy dark:group-hover:text-kkpsi-navy-light">
                                  {topicName}
                                </span>
                                <span className="text-muted-foreground">
                                  {topic.mastered} / {topic.total} mastered
                                </span>
                              </div>
                              <Progress
                                value={progress}
                                className={`h-2 ${
                                  progress >= 80
                                    ? "[&>div]:bg-green-500"
                                    : progress >= 50
                                    ? "[&>div]:bg-kkpsi-gold"
                                    : ""
                                }`}
                              />
                            </div>
                          </Link>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Brain className="mb-3 h-10 w-10 text-muted-foreground" />
                        <p className="mb-1 font-medium">No progress yet</p>
                        <p className="text-sm text-muted-foreground">
                          Start studying flashcards to track your progress!
                        </p>
                        <Link
                          href="/flashcards"
                          className="mt-4 inline-flex items-center gap-1 rounded-lg bg-kkpsi-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-kkpsi-navy-light"
                        >
                          <Brain className="h-4 w-4" />
                          Start Studying
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - 1/3 width */}
              <div className="space-y-6">
                {/* Streak Display */}
                <StreakDisplay
                  currentStreak={streakData.currentStreak}
                  longestStreak={streakData.longestStreak}
                />

                {/* Next Review Countdown */}
                <NextReview
                  dueNow={nextReview.dueNow}
                  nextReviewDate={nextReview.nextReviewDate}
                  nextReviewTopic={nextReview.nextReviewTopic}
                />

                {/* Topic Recommendations */}
                <TopicRecommendations
                  weakest={topicPerformance.weakest}
                  strongest={topicPerformance.strongest}
                />
              </div>
            </div>

            {/* Achievements */}
            <Achievements
              achievements={achievements.achievements}
              earnedCount={achievements.earnedCount}
              totalCount={achievements.totalCount}
            />

            {/* Recent Activity */}
            <RecentActivity activities={recentActivity} />

            {/* Quick Actions */}
            <Card className="border-2 border-kkpsi-navy/20">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Link
                    href="/flashcards"
                    className="group flex flex-col items-center gap-3 rounded-xl border-2 border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-kkpsi-navy hover:shadow-lg"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-kkpsi-navy/10 transition-colors group-hover:bg-kkpsi-navy/20 dark:bg-kkpsi-navy-light/20">
                      <Brain className="h-7 w-7 text-kkpsi-navy dark:text-kkpsi-navy-light" />
                    </div>
                    <span className="font-medium">Study Flashcards</span>
                    {nextReview.dueNow > 0 && (
                      <span className="rounded-full bg-kkpsi-gold px-3 py-1 text-xs font-semibold text-kkpsi-navy">
                        {nextReview.dueNow} due
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/quizzes"
                    className="group flex flex-col items-center gap-3 rounded-xl border-2 border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-kkpsi-gold hover:shadow-lg"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-kkpsi-gold/20 transition-colors group-hover:bg-kkpsi-gold/30">
                      <Trophy className="h-7 w-7 text-kkpsi-gold" />
                    </div>
                    <span className="font-medium">Take a Quiz</span>
                  </Link>
                  <Link
                    href="/info"
                    className="group flex flex-col items-center gap-3 rounded-xl border-2 border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-green-500 hover:shadow-lg"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 transition-colors group-hover:bg-green-500/20 dark:bg-green-500/20">
                      <Target className="h-7 w-7 text-green-600 dark:text-green-400" />
                    </div>
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

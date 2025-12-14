import Link from "next/link";
import { BookOpen, Brain, Users, TrendingUp, Sparkles, Music } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Navbar } from "~/components/layout/navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-kkpsi-navy via-kkpsi-navy-light to-kkpsi-navy py-20 md:py-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-kkpsi-gold/10 blur-3xl animate-float"></div>
          <div className="absolute -right-20 top-1/3 h-96 w-96 rounded-full bg-kkpsi-gold/5 blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-white/5 blur-3xl animate-float"></div>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        {/* Decorative music notes */}
        <div className="absolute left-10 top-1/4 hidden opacity-20 md:block">
          <Music className="h-12 w-12 text-kkpsi-gold animate-float" />
        </div>
        <div className="absolute right-10 bottom-1/4 hidden opacity-20 md:block">
          <Music className="h-8 w-8 text-kkpsi-gold animate-float-delayed" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-kkpsi-gold/30 bg-kkpsi-gold/10 px-4 py-2 text-sm font-medium text-kkpsi-gold backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>National Honorary Band Fraternity</span>
            </div>

            <h1 className="mb-6 font-serif text-5xl font-bold tracking-tight text-white md:text-7xl">
              Master Your
              <span className="text-gradient block md:inline"> Kappa Kappa Psi </span>
              Knowledge
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-300 md:text-2xl">
              Learn about KKPsi&apos;s rich history, chapters, and traditions through interactive flashcards and engaging quizzes
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="btn-glow animate-pulse-glow bg-kkpsi-gold px-8 text-kkpsi-navy shadow-lg shadow-kkpsi-gold/25 transition-all hover:scale-105 hover:bg-kkpsi-gold-light"
              >
                <Link href="/flashcards">Start Learning</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white/50 bg-white/5 px-8 text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-white hover:bg-white hover:text-kkpsi-navy"
              >
                <Link href="/quizzes">Take a Quiz</Link>
              </Button>
            </div>

            {/* Stats preview */}
            <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8">
              {[
                { label: "Topics", value: "7" },
                { label: "Questions", value: "320+" },
                { label: "Chapters", value: "343" },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-4">
                  <div className="text-2xl font-bold text-white md:text-3xl">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-kkpsi-navy/5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-kkpsi-gold/5 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-kkpsi-navy/5 px-4 py-2 text-sm font-medium text-kkpsi-navy">
              <Sparkles className="h-4 w-4" />
              Features
            </div>
            <h2 className="mb-4 font-serif text-4xl font-bold text-kkpsi-navy md:text-5xl">
              Everything You Need to Learn
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive learning tools designed for Kappa Kappa Psi members
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="card-hover group border-0 bg-white shadow-lg shadow-gray-200/50">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-kkpsi-navy to-kkpsi-navy-light shadow-lg shadow-kkpsi-navy/20 transition-transform group-hover:scale-110">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">Smart Flashcards</CardTitle>
                <CardDescription className="text-base">
                  Spaced repetition algorithm helps you remember what matters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-kkpsi-gold"></div>
                    7 different topic areas
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-kkpsi-gold"></div>
                    320+ questions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-kkpsi-gold"></div>
                    Progress tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-hover group border-0 bg-white shadow-lg shadow-gray-200/50">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-kkpsi-gold to-kkpsi-gold-dark shadow-lg shadow-kkpsi-gold/20 transition-transform group-hover:scale-110">
                  <BookOpen className="h-7 w-7 text-kkpsi-navy" />
                </div>
                <CardTitle className="text-xl">Interactive Quizzes</CardTitle>
                <CardDescription className="text-base">
                  Test your knowledge with customizable quizzes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-kkpsi-navy"></div>
                    Timed or untimed mode
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-kkpsi-navy"></div>
                    Filter by topic & tags
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-kkpsi-navy"></div>
                    Detailed results
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-hover group border-0 bg-white shadow-lg shadow-gray-200/50">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-kkpsi-navy to-kkpsi-navy-light shadow-lg shadow-kkpsi-navy/20 transition-transform group-hover:scale-110">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">Rich Information</CardTitle>
                <CardDescription className="text-base">
                  Explore KKPsi&apos;s history and chapters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-kkpsi-gold"></div>
                    Founding fathers bios
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-kkpsi-gold"></div>
                    343 chapter directory
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-kkpsi-gold"></div>
                    Awards & honors
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-hover group border-0 bg-white shadow-lg shadow-gray-200/50">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-kkpsi-gold to-kkpsi-gold-dark shadow-lg shadow-kkpsi-gold/20 transition-transform group-hover:scale-110">
                  <TrendingUp className="h-7 w-7 text-kkpsi-navy" />
                </div>
                <CardTitle className="text-xl">Track Progress</CardTitle>
                <CardDescription className="text-base">
                  Monitor your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-kkpsi-navy"></div>
                    Study streaks
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-kkpsi-navy"></div>
                    Quiz analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-kkpsi-navy"></div>
                    Leaderboards
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-kkpsi-gold/10 px-4 py-2 text-sm font-medium text-kkpsi-gold-dark">
              <BookOpen className="h-4 w-4" />
              Topics
            </div>
            <h2 className="mb-4 font-serif text-4xl font-bold text-kkpsi-navy md:text-5xl">
              Study Topics
            </h2>
            <p className="text-lg text-gray-600">
              Dive deep into seven comprehensive topic areas
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
            {[
              { name: "Chapters", count: "50 questions", icon: "📍", color: "from-blue-500 to-blue-600" },
              { name: "Founding Fathers", count: "75 questions", icon: "👔", color: "from-kkpsi-navy to-kkpsi-navy-light" },
              { name: "Awards & Jewelry", count: "50 questions", icon: "🏆", color: "from-kkpsi-gold to-kkpsi-gold-dark" },
              { name: "Districts", count: "30 questions", icon: "🗺️", color: "from-emerald-500 to-emerald-600" },
              { name: "HBCU Chapters", count: "40 questions", icon: "🎓", color: "from-purple-500 to-purple-600" },
              { name: "National Intercollegiate Band", count: "50 questions", icon: "🎺", color: "from-kkpsi-navy to-kkpsi-navy-light" },
              { name: "Bohumil Makovsky", count: "25 questions", icon: "⭐", color: "from-amber-500 to-amber-600" },
            ].map((topic) => (
              <Link
                key={topic.name}
                href="/flashcards"
                className="card-hover group relative flex items-center gap-4 overflow-hidden rounded-xl border-0 bg-white p-5 shadow-lg shadow-gray-200/50"
              >
                {/* Gradient accent bar */}
                <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${topic.color}`}></div>

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-50 text-3xl transition-transform group-hover:scale-110">
                  {topic.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-kkpsi-navy transition-colors group-hover:text-kkpsi-navy-light">{topic.name}</h3>
                  <p className="text-sm text-gray-500">{topic.count}</p>
                </div>
                <div className="text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-kkpsi-navy">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-kkpsi-navy via-kkpsi-navy-light to-kkpsi-navy py-24">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-kkpsi-gold/10 blur-3xl"></div>
          <div className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-white/5 blur-3xl"></div>
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 font-serif text-4xl font-bold text-white md:text-5xl">
              Ready to Begin Your Journey?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-300">
              Join fellow brothers and sisters in mastering Kappa Kappa Psi knowledge
            </p>
            <Button
              asChild
              size="lg"
              className="btn-glow animate-pulse-glow bg-kkpsi-gold px-10 py-6 text-lg text-kkpsi-navy shadow-xl shadow-kkpsi-gold/25 transition-all hover:scale-105 hover:bg-kkpsi-gold-light"
            >
              <Link href="/api/auth/signin">Sign In to Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold text-kkpsi-navy">ΚΚΨ</span>
              <div className="h-6 w-px bg-gray-200"></div>
              <span className="text-sm text-gray-600">Learning App</span>
            </div>
            <p className="text-center font-serif text-gray-600">
              Kappa Kappa Psi • National Honorary Band Fraternity
            </p>
            <p className="text-sm text-gray-400">
              Built with dedication for the brotherhood
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

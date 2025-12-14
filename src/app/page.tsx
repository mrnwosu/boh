import Link from "next/link";
import { BookOpen, Brain, Users, TrendingUp } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Navbar } from "~/components/layout/navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-kkpsi-navy via-kkpsi-navy-light to-kkpsi-navy py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 font-serif text-5xl font-bold tracking-tight text-white md:text-7xl">
              Master Your
              <span className="text-kkpsi-gold"> Kappa Kappa Psi </span>
              Knowledge
            </h1>
            <p className="mb-8 text-xl text-gray-200 md:text-2xl">
              Learn about KKPsi's rich history, chapters, and traditions through interactive flashcards and engaging quizzes
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-kkpsi-gold text-kkpsi-navy hover:bg-kkpsi-gold-light"
              >
                <Link href="/flashcards">Start Learning</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white bg-transparent text-white hover:bg-white hover:text-kkpsi-navy"
              >
                <Link href="/quizzes">Take a Quiz</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 font-serif text-4xl font-bold text-kkpsi-navy">
              Everything You Need to Learn
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive learning tools designed for Kappa Kappa Psi members
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 transition-all hover:border-kkpsi-navy hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-kkpsi-navy/10">
                  <Brain className="h-6 w-6 text-kkpsi-navy" />
                </div>
                <CardTitle>Smart Flashcards</CardTitle>
                <CardDescription>
                  Spaced repetition algorithm helps you remember what matters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 7 different topic areas</li>
                  <li>• 320+ questions</li>
                  <li>• Progress tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-kkpsi-navy hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-kkpsi-gold/20">
                  <BookOpen className="h-6 w-6 text-kkpsi-navy" />
                </div>
                <CardTitle>Interactive Quizzes</CardTitle>
                <CardDescription>
                  Test your knowledge with customizable quizzes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Timed or untimed mode</li>
                  <li>• Filter by topic & tags</li>
                  <li>• Detailed results</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-kkpsi-navy hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-kkpsi-navy/10">
                  <Users className="h-6 w-6 text-kkpsi-navy" />
                </div>
                <CardTitle>Rich Information</CardTitle>
                <CardDescription>
                  Explore KKPsi's history and chapters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Founding fathers bios</li>
                  <li>• 343 chapter directory</li>
                  <li>• Awards & honors</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-kkpsi-navy hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-kkpsi-gold/20">
                  <TrendingUp className="h-6 w-6 text-kkpsi-navy" />
                </div>
                <CardTitle>Track Progress</CardTitle>
                <CardDescription>
                  Monitor your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Study streaks</li>
                  <li>• Quiz analytics</li>
                  <li>• Leaderboards</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 font-serif text-4xl font-bold text-kkpsi-navy">
              Study Topics
            </h2>
            <p className="text-lg text-gray-600">
              Dive deep into seven comprehensive topic areas
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
            {[
              { name: "Chapters", count: "50 questions", icon: "📍" },
              { name: "Founding Fathers", count: "75 questions", icon: "👔" },
              { name: "Awards & Jewelry", count: "50 questions", icon: "🏆" },
              { name: "Districts", count: "30 questions", icon: "🗺️" },
              { name: "HBCU Chapters", count: "40 questions", icon: "🎓" },
              { name: "National Intercollegiate Band", count: "50 questions", icon: "🎺" },
              { name: "Bohumil Makovsky", count: "25 questions", icon: "⭐" },
            ].map((topic) => (
              <div
                key={topic.name}
                className="flex items-center gap-4 rounded-lg border-2 border-gray-200 bg-white p-4 transition-all hover:border-kkpsi-navy"
              >
                <span className="text-3xl">{topic.icon}</span>
                <div>
                  <h3 className="font-semibold text-kkpsi-navy">{topic.name}</h3>
                  <p className="text-sm text-gray-600">{topic.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-kkpsi-navy py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 font-serif text-4xl font-bold text-white">
            Ready to Begin Your Journey?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-200">
            Join fellow brothers and sisters in mastering Kappa Kappa Psi knowledge
          </p>
          <Button
            asChild
            size="lg"
            className="bg-kkpsi-gold text-kkpsi-navy hover:bg-kkpsi-gold-light"
          >
            <Link href="/api/auth/signin">Sign In to Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p className="font-serif">
            Kappa Kappa Psi • National Honorary Band Fraternity
          </p>
          <p className="mt-2">
            Built with dedication for the brotherhood
          </p>
        </div>
      </footer>
    </div>
  );
}

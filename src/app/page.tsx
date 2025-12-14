import Link from "next/link";
import { BookOpen, Brain, Users, TrendingUp, Sparkles, Music } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Navbar } from "~/components/layout/navbar";
import { AnimatedSection } from "~/components/shared";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 dark:from-background dark:to-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-hero via-hero-light to-hero py-12 sm:py-16 md:py-24 lg:py-32">
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

            <h1 className="mb-4 font-serif text-3xl font-bold tracking-tight text-white sm:mb-6 sm:text-4xl md:text-5xl lg:text-7xl">
              Master Your
              <span className="text-gradient block md:inline"> Kappa Kappa Psi </span>
              Knowledge
            </h1>
            <p className="mx-auto mb-6 max-w-2xl text-base text-gray-300 sm:mb-8 sm:text-lg md:text-xl lg:text-2xl">
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
            <div className="mt-10 grid grid-cols-3 gap-2 sm:mt-12 sm:gap-4 md:mt-16 md:gap-8">
              {[
                { label: "Topics", value: "7" },
                { label: "Questions", value: "320+" },
                { label: "Chapters", value: "343" },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-lg p-3 sm:rounded-xl sm:p-4">
                  <div className="text-lg font-bold text-white sm:text-2xl md:text-3xl">{stat.value}</div>
                  <div className="text-xs text-gray-400 sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-12 sm:py-16 md:py-24">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-kkpsi-navy/5 blur-3xl dark:bg-kkpsi-navy/10"></div>
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-kkpsi-gold/5 blur-3xl dark:bg-kkpsi-gold/10"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-kkpsi-navy/5 px-4 py-2 text-sm font-medium text-kkpsi-navy dark:bg-kkpsi-navy/20 dark:text-kkpsi-navy-light">
              <Sparkles className="h-4 w-4" />
              Features
            </div>
            <h2 className="mb-4 font-serif text-2xl font-bold text-kkpsi-navy dark:text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
              Everything You Need to Learn
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive learning tools designed for Kappa Kappa Psi members
            </p>
          </div>

          <AnimatedSection className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Brain,
                title: "Smart Flashcards",
                description: "Spaced repetition helps you retain knowledge efficiently",
                features: ["7 topics", "320+ cards", "Progress sync"],
                accent: "bg-kkpsi-navy",
              },
              {
                icon: BookOpen,
                title: "Interactive Quizzes",
                description: "Test yourself with customizable quiz settings",
                features: ["Timed mode", "Tag filters", "Instant results"],
                accent: "bg-kkpsi-gold",
              },
              {
                icon: Users,
                title: "Rich Information",
                description: "Explore our fraternity's history and chapters",
                features: ["Founder bios", "343 chapters", "Awards"],
                accent: "bg-kkpsi-navy",
              },
              {
                icon: TrendingUp,
                title: "Track Progress",
                description: "Monitor your learning journey over time",
                features: ["Streaks", "Analytics", "Leaderboards"],
                accent: "bg-kkpsi-gold",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className={`animate-on-scroll stagger-${index + 1} group relative rounded-xl bg-card p-6 shadow-sm ring-1 ring-border transition-all hover:shadow-md hover:ring-ring/50 hover:-translate-y-1`}
              >
                {/* Accent line */}
                <div className={`absolute left-0 top-6 h-8 w-1 rounded-r-full ${feature.accent}`} />

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-muted/80">
                  <feature.icon
                    className="h-5 w-5 text-kkpsi-navy dark:text-kkpsi-navy-light"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="mb-2 font-semibold text-card-foreground">{feature.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                <div className="flex flex-wrap gap-2">
                  {feature.features.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Topics Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-kkpsi-gold/10 px-4 py-2 text-sm font-medium text-kkpsi-gold-dark dark:text-kkpsi-gold">
              <BookOpen className="h-4 w-4" />
              Topics
            </div>
            <h2 className="mb-4 font-serif text-2xl font-bold text-kkpsi-navy dark:text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
              Study Topics
            </h2>
            <p className="text-lg text-muted-foreground">
              Dive deep into seven comprehensive topic areas
            </p>
          </div>

          <AnimatedSection className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
            {[
              { name: "Chapters", count: 50, accent: "from-blue-500 to-blue-600" },
              { name: "Founding Fathers", count: 75, accent: "from-kkpsi-navy to-kkpsi-navy-light" },
              { name: "Awards & Jewelry", count: 50, accent: "from-kkpsi-gold to-amber-500" },
              { name: "Districts", count: 30, accent: "from-emerald-500 to-emerald-600" },
              { name: "HBCU Chapters", count: 40, accent: "from-purple-500 to-purple-600" },
              { name: "National Intercollegiate Band", count: 50, accent: "from-kkpsi-navy to-blue-600" },
              { name: "Bohumil Makovsky", count: 25, accent: "from-amber-500 to-orange-500" },
            ].map((topic, index) => (
              <Link
                key={topic.name}
                href="/flashcards"
                className={`animate-on-scroll stagger-${index + 1} group relative flex items-center justify-between overflow-hidden rounded-xl bg-card px-6 py-5 shadow-sm ring-1 ring-border transition-all hover:shadow-md hover:ring-ring/50 hover:-translate-y-0.5`}
              >
                {/* Gradient accent */}
                <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${topic.accent}`} />

                <span className="font-medium text-card-foreground transition-colors group-hover:text-kkpsi-navy dark:group-hover:text-kkpsi-navy-light">
                  {topic.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground">
                    {topic.count} cards
                  </span>
                  <svg
                    className="h-4 w-4 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-kkpsi-navy dark:group-hover:text-kkpsi-navy-light"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-hero via-hero-light to-hero py-12 sm:py-16 md:py-24">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-kkpsi-gold/10 blur-3xl"></div>
          <div className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-white/5 blur-3xl"></div>
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 font-serif text-2xl font-bold text-white sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl">
              Ready to Begin Your Journey?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-base text-gray-300 sm:mb-10 sm:text-lg md:text-xl">
              Join fellow brothers and sisters in mastering Kappa Kappa Psi knowledge
            </p>
            <Button
              asChild
              size="lg"
              className="btn-glow animate-pulse-glow bg-kkpsi-gold px-10 py-6 text-lg text-kkpsi-navy shadow-xl shadow-kkpsi-gold/25 transition-all hover:scale-105 hover:bg-kkpsi-gold-light"
            >
              <Link href="/auth/signin">Sign In to Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold text-kkpsi-navy dark:text-kkpsi-navy-light">ΚΚΨ</span>
              <div className="h-6 w-px bg-border"></div>
              <span className="text-sm text-muted-foreground">Learning App</span>
            </div>
            <p className="text-center font-serif text-muted-foreground">
              Kappa Kappa Psi • National Honorary Band Fraternity
            </p>
            <p className="text-sm text-muted-foreground/70">
              Built with dedication for the brotherhood
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

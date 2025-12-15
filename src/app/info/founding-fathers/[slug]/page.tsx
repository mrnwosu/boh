import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  MapPin,
  Music,
  GraduationCap,
  Quote,
  Sparkles,
  Award,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "~/components/ui/button";
import { Navbar } from "~/components/layout/navbar";
import { AnimatedSection, InteractiveTimeline } from "~/components/shared";
import { api } from "~/trpc/server";
import {
  parseFounderTimeline,
  parseQuickFacts,
  parseFunFacts,
  parseLegacy,
} from "~/lib/content/timeline-parser";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const founder = await api.content.getFounder({ slug });

  if (!founder) {
    return {
      title: "Founder Not Found | Kappa Kappa Psi",
    };
  }

  return {
    title: `${founder.name} | Founding Fathers | Kappa Kappa Psi`,
    description: `Learn about ${founder.name}, one of the ten founding fathers of Kappa Kappa Psi National Honorary Band Fraternity.`,
    keywords: [
      founder.name,
      "Kappa Kappa Psi",
      "founding father",
      "KKPsi history",
      "band fraternity",
    ],
    openGraph: {
      title: `${founder.name} | Kappa Kappa Psi Founding Father`,
      description: `Biography of ${founder.name}, founding father of Kappa Kappa Psi`,
      type: "article",
    },
  };
}

// Icon mapping for quick facts
const factIcons: Record<string, typeof Calendar> = {
  "Full Name": User,
  "Nickname": Sparkles,
  "Birth Year": Calendar,
  "Class Year": GraduationCap,
  "Hometown": MapPin,
  "Major": GraduationCap,
  "Instrument": Music,
  "Death Date": Calendar,
  "Burial Location": MapPin,
};

export default async function FoundingFatherPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [founder, allFounders] = await Promise.all([
    api.content.getFounder({ slug }),
    api.content.getFoundingFathers(),
  ]);

  if (!founder) {
    notFound();
  }

  // Parse content
  const quickFacts = parseQuickFacts(founder.content);
  const funFacts = parseFunFacts(founder.content);
  const timelineEras = parseFounderTimeline(founder.content);
  const legacyContent = parseLegacy(founder.content);

  // Find prev/next founders for navigation
  const currentIndex = allFounders.findIndex((f) => f.slug === slug);
  const prevFounder = currentIndex > 0 ? allFounders[currentIndex - 1] : null;
  const nextFounder =
    currentIndex < allFounders.length - 1 ? allFounders[currentIndex + 1] : null;

  // Get featured facts for the hero section
  const nickname = quickFacts.find((f) => f.label === "Nickname")?.value;
  const instrument = quickFacts.find((f) => f.label === "Instrument")?.value;
  const classYear = quickFacts.find((f) => f.label === "Class Year")?.value;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-kkpsi-navy via-kkpsi-navy-light to-kkpsi-navy py-10 sm:py-16">
        {/* Decorative elements - hidden on mobile */}
        <div className="hidden sm:block absolute -left-20 -top-20 h-64 w-64 rounded-full bg-kkpsi-gold/10 blur-3xl" />
        <div className="hidden sm:block absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Back button */}
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="mb-4 sm:mb-6 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <Link href="/info/founding-fathers">
                <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">All Founding Fathers</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </Button>

            {/* Name and title */}
            <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-white">
                  {founder.name}
                </h1>
                {nickname && (
                  <p className="mt-1 sm:mt-2 text-base sm:text-lg text-kkpsi-gold">
                    &ldquo;{nickname}&rdquo;
                  </p>
                )}
                <p className="mt-1 text-sm sm:text-base text-white/60">Founding Father of Kappa Kappa Psi</p>
              </div>

              {/* Quick stats badges */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {instrument && (
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white backdrop-blur-sm">
                    <Music className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-kkpsi-gold" />
                    {instrument}
                  </div>
                )}
                {classYear && (
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white backdrop-blur-sm">
                    <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-kkpsi-gold" />
                    Class of {classYear}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Facts Grid */}
      {quickFacts.length > 0 && (
        <section className="border-b border-border py-6 sm:py-8">
          <div className="container mx-auto px-4">
            <AnimatedSection className="mx-auto max-w-4xl">
              <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {quickFacts
                  .filter((fact) => fact.value && fact.value !== "Unknown")
                  .map((fact, index) => {
                    const Icon = factIcons[fact.label] ?? Calendar;
                    return (
                      <div
                        key={fact.label}
                        className={`animate-on-scroll stagger-${Math.min(index + 1, 7)} group rounded-lg bg-card p-2.5 sm:p-3 ring-1 ring-border transition-all active:scale-[0.98] sm:hover:-translate-y-0.5 sm:hover:shadow-md sm:hover:ring-kkpsi-navy/30`}
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          <span className="truncate">{fact.label}</span>
                        </div>
                        <div className="mt-0.5 sm:mt-1 text-sm sm:text-base font-medium text-foreground truncate">
                          {fact.value}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Fun Facts Section */}
      {funFacts.length > 0 && (
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <AnimatedSection className="mx-auto max-w-4xl">
              <div className="animate-on-scroll stagger-1 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="rounded-lg bg-gradient-to-br from-kkpsi-gold/20 to-amber-500/20 p-1.5 sm:p-2">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-kkpsi-gold" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                  Fun Facts
                </h2>
              </div>

              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                {funFacts.map((fact, index) => (
                  <div
                    key={fact.number}
                    className={`animate-on-scroll stagger-${Math.min(index + 2, 7)} group relative rounded-xl bg-card p-4 sm:p-5 shadow-sm ring-1 ring-border transition-all active:scale-[0.99] sm:hover:-translate-y-0.5 sm:hover:shadow-md`}
                  >
                    {/* Number badge */}
                    <div className="absolute -left-1.5 -top-1.5 sm:-left-2 sm:-top-2 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gradient-to-br from-kkpsi-navy to-kkpsi-navy-light text-xs sm:text-sm font-bold text-white shadow-lg">
                      {fact.number}
                    </div>

                    <div className="pl-3 sm:pl-4">
                      <h3 className="mb-1.5 sm:mb-2 text-sm sm:text-base font-semibold text-kkpsi-navy dark:text-foreground">
                        {fact.title}
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {fact.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Timeline Section */}
      {timelineEras.length > 0 && (
        <section className="border-t border-border bg-muted/30 py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <AnimatedSection>
                <div className="animate-on-scroll stagger-1 mb-6 sm:mb-8 text-center">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                    Timeline
                  </h2>
                  <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-muted-foreground">
                    Key moments in the life of {founder.name.split(" ")[0]}
                  </p>
                </div>
              </AnimatedSection>

              <div className="animate-on-scroll stagger-2 rounded-xl sm:rounded-2xl bg-card p-4 sm:p-6 shadow-sm ring-1 ring-border">
                <InteractiveTimeline eras={timelineEras} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Legacy Section */}
      {legacyContent && (
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <AnimatedSection className="mx-auto max-w-4xl">
              <div className="animate-on-scroll stagger-1 relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-kkpsi-navy/5 via-kkpsi-navy/10 to-kkpsi-navy/5 p-5 sm:p-8 shadow-sm ring-1 ring-kkpsi-navy/20">
                {/* Decorative quote - hidden on mobile */}
                <Quote className="hidden sm:block absolute right-6 top-6 h-16 w-16 text-kkpsi-navy/5" />

                {/* Gradient accent bar */}
                <div className="absolute left-0 top-5 sm:top-8 h-10 sm:h-12 w-1 rounded-r-full bg-gradient-to-b from-kkpsi-navy to-kkpsi-navy-light" />

                <div className="relative">
                  <div className="mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                    <div className="rounded-lg bg-gradient-to-br from-kkpsi-navy to-kkpsi-navy-light p-1.5 sm:p-2">
                      <Award className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-kkpsi-navy dark:text-foreground">
                      Legacy
                    </h2>
                  </div>

                  <div className="text-sm sm:text-base leading-relaxed text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{legacyContent}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Navigation between founders */}
      <section className="border-t border-border py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-2">
            {prevFounder ? (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="gap-1 sm:gap-2 text-muted-foreground hover:text-foreground"
              >
                <Link href={`/info/founding-fathers/${prevFounder.slug}`}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">{prevFounder.name}</span>
                  <span className="sm:hidden">Prev</span>
                </Link>
              </Button>
            ) : (
              <div />
            )}

            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-kkpsi-navy/20 text-xs sm:text-sm text-kkpsi-navy hover:bg-kkpsi-navy hover:text-white dark:border-border dark:text-foreground dark:hover:bg-kkpsi-navy"
            >
              <Link href="/info/founding-fathers">
                <span className="hidden sm:inline">View All Founders</span>
                <span className="sm:hidden">All</span>
              </Link>
            </Button>

            {nextFounder ? (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="gap-1 sm:gap-2 text-muted-foreground hover:text-foreground"
              >
                <Link href={`/info/founding-fathers/${nextFounder.slug}`}>
                  <span className="hidden sm:inline">{nextFounder.name}</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

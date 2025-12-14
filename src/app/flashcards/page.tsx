import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Users,
  Award,
  Sparkle,
  Globe,
  GraduationCap,
  Music,
  Zap,
  TrendingUp,
  Layers,
} from "lucide-react";
import { Navbar } from "~/components/layout/navbar";
import { AnimatedSection } from "~/components/shared";
import { TOPICS } from "~/lib/content/topics";

const topicIcons = [Sparkle, Users, MapPin, Award, Globe, GraduationCap, Music];
const topicGradients = [
  "from-amber-500 to-orange-500",
  "from-kkpsi-navy to-kkpsi-navy-light",
  "from-blue-500 to-blue-600",
  "from-kkpsi-gold to-amber-500",
  "from-emerald-500 to-emerald-600",
  "from-purple-500 to-purple-600",
  "from-kkpsi-navy to-blue-600",
];

export default function FlashcardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Minimal Hero */}
      <section className="border-b border-gray-100 bg-white pb-12 pt-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900">
              Flashcards
            </h1>
            <p className="text-lg text-gray-500">
              Select a topic to begin studying
            </p>
          </div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <AnimatedSection className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map((topic, index) => {
              const IconComponent = topicIcons[index] ?? MapPin;
              const gradient = topicGradients[index] ?? "from-kkpsi-navy to-kkpsi-navy-light";

              return (
                <Link
                  key={topic.slug}
                  href={`/flashcards/${topic.slug}`}
                  className={`animate-on-scroll stagger-${index + 1} group block`}
                >
                  <div className="relative flex h-full flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200/50 transition-all hover:-translate-y-1 hover:shadow-md hover:ring-gray-300">
                    {/* Gradient accent bar */}
                    <div className={`absolute left-0 top-6 h-10 w-1 rounded-r-full bg-gradient-to-b ${gradient}`} />

                    {/* Icon */}
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 transition-colors group-hover:bg-gray-100">
                      <IconComponent className="h-5 w-5 text-kkpsi-navy" strokeWidth={1.5} />
                    </div>

                    {/* Content */}
                    <h3 className="mb-2 font-semibold text-gray-900">
                      {topic.title}
                    </h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-500">
                      {topic.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium tabular-nums text-gray-500">
                        {topic.totalQuestions} cards
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-kkpsi-navy" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </AnimatedSection>
        </div>
      </section>

      {/* Features - Subtle bottom section */}
      <section className="border-t border-gray-100 bg-gray-50/50 py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-kkpsi-navy/5">
                <Zap className="h-5 w-5 text-kkpsi-navy" strokeWidth={1.5} />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-gray-900">
                Spaced Repetition
              </h3>
              <p className="text-sm text-gray-500">
                SM-2 algorithm for optimal retention
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-kkpsi-navy/5">
                <TrendingUp className="h-5 w-5 text-kkpsi-navy" strokeWidth={1.5} />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-gray-900">
                Progress Tracking
              </h3>
              <p className="text-sm text-gray-500">
                Sign in to save your progress
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-kkpsi-navy/5">
                <Layers className="h-5 w-5 text-kkpsi-navy" strokeWidth={1.5} />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-gray-900">
                Question Variants
              </h3>
              <p className="text-sm text-gray-500">
                Multiple phrasings per concept
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

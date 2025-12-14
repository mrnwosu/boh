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
import { TOPICS } from "~/lib/content/topics";

const topicIcons = [Sparkle, Users, MapPin, Award, Globe, GraduationCap, Music];

export default function FlashcardsPage() {
  return (
    <div className="min-h-screen bg-white">
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map((topic, index) => {
              const IconComponent = topicIcons[index] ?? MapPin;

              return (
                <Link key={topic.slug} href={`/flashcards/${topic.slug}`} className="group block">
                  <div className="relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-gray-300 hover:shadow-md">
                    {/* Icon */}
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-kkpsi-navy/5 text-kkpsi-navy transition-colors group-hover:bg-kkpsi-navy group-hover:text-white">
                      <IconComponent className="h-5 w-5" strokeWidth={1.5} />
                    </div>

                    {/* Content */}
                    <h3 className="mb-1 font-semibold text-gray-900">
                      {topic.title}
                    </h3>
                    <p className="mb-4 flex-1 text-sm text-gray-500">
                      {topic.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs tabular-nums text-gray-400">
                        {topic.totalQuestions} cards
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-kkpsi-navy" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
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

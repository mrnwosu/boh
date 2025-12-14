import Link from "next/link";
import { Trophy, ArrowRight } from "lucide-react";
import { Navbar } from "~/components/layout/navbar";
import { PageHero, AnimatedSection } from "~/components/shared";
import { api } from "~/trpc/server";

export default async function AwardsPage() {
  const awards = await api.content.getAwards();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <PageHero
        icon={Trophy}
        title="Awards & Jewelry"
        description="Recognizing excellence and service in Kappa Kappa Psi"
      />

      {/* Awards Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {awards.map((award, index) => (
              <Link
                key={award.slug}
                href={`/info/awards/${award.slug}`}
                className={`animate-on-scroll stagger-${Math.min(index + 1, 7)} group block`}
              >
                <div className="relative flex h-full flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200/50 transition-all hover:-translate-y-1 hover:shadow-md hover:ring-gray-300">
                  {/* Gradient accent bar */}
                  <div className="absolute left-0 top-6 h-10 w-1 rounded-r-full bg-gradient-to-b from-kkpsi-gold to-amber-500" />

                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 transition-colors group-hover:bg-gray-100">
                    <Trophy className="h-5 w-5 text-kkpsi-navy" strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-4 flex-1 font-semibold text-gray-900">{award.name}</h3>
                  <div className="flex items-center text-xs font-medium text-gray-400 transition-colors group-hover:text-kkpsi-navy">
                    <span>Learn more</span>
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold text-kkpsi-navy">
              Recognizing Excellence
            </h2>
            <p className="text-lg text-gray-700">
              Kappa Kappa Psi recognizes outstanding service, leadership, and dedication
              through a variety of awards and honors. These awards celebrate the
              contributions of members who go above and beyond in service to college bands
              and the fraternity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Trophy, ArrowRight, Award } from "lucide-react";
import { Navbar } from "~/components/layout/navbar";
import { PageHero, AnimatedSection } from "~/components/shared";
import { api } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Awards & Jewelry | Kappa Kappa Psi",
  description:
    "Explore the prestigious awards, honors, and jewelry of Kappa Kappa Psi National Honorary Band Fraternity, recognizing excellence and service.",
  keywords: [
    "Kappa Kappa Psi",
    "KKPsi awards",
    "band fraternity awards",
    "service awards",
    "fraternity jewelry",
    "honor awards",
  ],
  openGraph: {
    title: "Awards & Jewelry | Kappa Kappa Psi",
    description:
      "Recognizing excellence and service in Kappa Kappa Psi",
    type: "website",
  },
};

export default async function AwardsPage() {
  const awards = await api.content.getAwards();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <Navbar />

      <PageHero
        icon={Trophy}
        title="Awards & Jewelry"
        description="Recognizing excellence and service in Kappa Kappa Psi"
      >
        {/* Stats Cards */}
        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-4">
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-kkpsi-gold">{awards.length}</div>
            <div className="text-sm text-gray-300">Awards & Honors</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="text-sm text-gray-300">Recognizing Excellence</div>
          </div>
        </div>
      </PageHero>

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
                <div className="relative flex h-full flex-col rounded-xl bg-card p-6 shadow-sm ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-md hover:ring-ring/50">
                  {/* Gradient accent bar */}
                  <div className="absolute left-0 top-6 h-10 w-1 rounded-r-full bg-gradient-to-b from-kkpsi-gold to-amber-500" />

                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-muted/80">
                    <Trophy className="h-5 w-5 text-kkpsi-navy dark:text-kkpsi-navy-light" strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-4 flex-1 font-semibold text-card-foreground">{award.name}</h3>
                  <div className="flex items-center text-xs font-medium text-muted-foreground transition-colors group-hover:text-kkpsi-navy dark:group-hover:text-kkpsi-navy-light">
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
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold text-kkpsi-navy dark:text-foreground">
              Recognizing Excellence
            </h2>
            <p className="text-lg text-muted-foreground">
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

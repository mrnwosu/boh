import type { Metadata } from "next";
import Link from "next/link";
import { Users, ArrowRight, Calendar } from "lucide-react";
import { Navbar } from "~/components/layout/navbar";
import { PageHero, AnimatedSection } from "~/components/shared";
import { api } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Founding Fathers | Kappa Kappa Psi",
  description:
    "Learn about the ten founding fathers of Kappa Kappa Psi National Honorary Band Fraternity, established on November 27, 1919 at Oklahoma A&M College.",
  keywords: [
    "Kappa Kappa Psi",
    "KKPsi founders",
    "founding fathers",
    "band fraternity history",
    "Oklahoma A&M",
    "1919",
  ],
  openGraph: {
    title: "Founding Fathers | Kappa Kappa Psi",
    description:
      "The ten men who founded Kappa Kappa Psi on November 27, 1919",
    type: "website",
  },
};

export default async function FoundingFathersPage() {
  const founders = await api.content.getFoundingFathers();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <Navbar />

      <PageHero
        icon={Users}
        title="The Founding Fathers"
        description="The ten men who founded Kappa Kappa Psi on November 27, 1919"
      >
        {/* Stats Cards */}
        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-4">
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">10</div>
            <div className="text-sm text-gray-300">Founders</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-kkpsi-gold">1919</div>
            <div className="text-sm text-gray-300">Founded</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-lg font-bold text-white">
              <Calendar className="h-5 w-5" />
              <span>Nov 27</span>
            </div>
            <div className="text-sm text-gray-300">Founders Day</div>
          </div>
        </div>
      </PageHero>

      {/* Founders Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {founders.map((founder, index) => (
              <Link
                key={founder.slug}
                href={`/info/founding-fathers/${founder.slug}`}
                className={`animate-on-scroll stagger-${Math.min(index + 1, 7)} group block`}
              >
                <div className="relative flex h-full items-center justify-between rounded-xl bg-card p-6 shadow-sm ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-md hover:ring-ring/50">
                  {/* Gradient accent bar */}
                  <div className="absolute left-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-kkpsi-navy to-kkpsi-navy-light" />

                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-muted/80">
                      <Users className="h-5 w-5 text-kkpsi-navy dark:text-kkpsi-navy-light" strokeWidth={1.5} />
                    </div>
                    <span className="font-semibold text-card-foreground">{founder.name}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-all group-hover:translate-x-1 group-hover:text-kkpsi-navy dark:group-hover:text-kkpsi-navy-light" />
                </div>
              </Link>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Historical Note */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold text-kkpsi-navy dark:text-foreground">
              November 27, 1919
            </h2>
            <p className="text-lg text-muted-foreground">
              On this date at Oklahoma A&M College (now Oklahoma State University),
              these ten dedicated band members came together to found Kappa Kappa Psi,
              establishing a legacy that continues to this day with over 343 chapters
              serving college bands across the nation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import { Navbar } from "~/components/layout/navbar";
import { PageHero, AnimatedSection } from "~/components/shared";
import { api } from "~/trpc/server";

export default async function FoundingFathersPage() {
  const founders = await api.content.getFoundingFathers();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <PageHero
        icon={Users}
        title="The Founding Fathers"
        description="The ten men who founded Kappa Kappa Psi on November 27, 1919"
      />

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
                <div className="relative flex h-full items-center justify-between rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200/50 transition-all hover:-translate-y-1 hover:shadow-md hover:ring-gray-300">
                  {/* Gradient accent bar */}
                  <div className="absolute left-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-kkpsi-navy to-kkpsi-navy-light" />

                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 transition-colors group-hover:bg-gray-100">
                      <Users className="h-5 w-5 text-kkpsi-navy" strokeWidth={1.5} />
                    </div>
                    <span className="font-semibold text-gray-900">{founder.name}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-kkpsi-navy" />
                </div>
              </Link>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Historical Note */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold text-kkpsi-navy">
              November 27, 1919
            </h2>
            <p className="text-lg text-gray-700">
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

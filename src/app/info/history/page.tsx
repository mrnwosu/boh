import type { Metadata } from "next";
import { Clock, Calendar, Users } from "lucide-react";
import { Navbar } from "~/components/layout/navbar";
import { PageHero, AnimatedSection } from "~/components/shared";

export const metadata: Metadata = {
  title: "History & Timeline | Kappa Kappa Psi",
  description:
    "Discover the rich history and major milestones of Kappa Kappa Psi National Honorary Band Fraternity, from its founding in 1919 to today.",
  keywords: [
    "Kappa Kappa Psi",
    "KKPsi history",
    "band fraternity timeline",
    "fraternity milestones",
    "1919",
    "Oklahoma A&M",
  ],
  openGraph: {
    title: "History & Timeline | Kappa Kappa Psi",
    description:
      "Over a century of service to college bands",
    type: "website",
  },
};

export default function HistoryPage() {
  const timeline = [
    {
      year: "1919",
      title: "Founding of Kappa Kappa Psi",
      description: "Founded at Oklahoma A&M College (now Oklahoma State University) on November 27, 1919.",
    },
    {
      year: "1978",
      title: "Women Admitted",
      description: "Kappa Kappa Psi began admitting women as full members.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <Navbar />

      <PageHero
        icon={Clock}
        title="History & Timeline"
        description="Over a century of service to college bands"
      >
        {/* Stats Cards */}
        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-4">
          <div className="glass rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-kkpsi-gold">
              <Calendar className="h-6 w-6" />
              <span>1919</span>
            </div>
            <div className="text-sm text-gray-300">Founded</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">105+</div>
            <div className="text-sm text-gray-300">Years of Service</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-white">
              <Users className="h-6 w-6" />
              <span>343</span>
            </div>
            <div className="text-sm text-gray-300">Chapters</div>
          </div>
        </div>
      </PageHero>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h2 className="font-serif text-3xl font-bold text-kkpsi-navy dark:text-foreground">Major Milestones</h2>
            </div>

            <AnimatedSection className="relative space-y-6">
              {/* Vertical line */}
              <div className="absolute left-[39px] top-0 h-full w-0.5 bg-gradient-to-b from-kkpsi-gold to-amber-500"></div>

              {timeline.map((event, index) => (
                <div key={index} className={`animate-on-scroll stagger-${index + 1} relative flex gap-6`}>
                  {/* Year marker */}
                  <div className="z-10 flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-4 border-kkpsi-gold bg-card shadow-sm">
                    <span className="font-bold text-kkpsi-navy dark:text-kkpsi-navy-light">{event.year}</span>
                  </div>

                  {/* Event content */}
                  <div className="flex-1 rounded-xl bg-card p-6 shadow-sm ring-1 ring-border transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-ring/50">
                    <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                      {event.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{event.description}</p>
                  </div>
                </div>
              ))}
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Historical Note */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold text-kkpsi-navy dark:text-foreground">
              A Rich Heritage
            </h2>
            <p className="text-lg text-muted-foreground">
              Since its founding in 1919, Kappa Kappa Psi has been dedicated to serving
              college bands and fostering brotherhood among band members. Through decades
              of growth and change, our core mission remains: to unite college and
              university band members in a brotherhood dedicated to service, leadership,
              and the advancement of the college band movement.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

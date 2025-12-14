import { Clock } from "lucide-react";
import { Navbar } from "~/components/layout/navbar";
import { PageHero, AnimatedSection } from "~/components/shared";

export default async function HistoryPage() {
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <PageHero
        icon={Clock}
        title="History & Timeline"
        description="Over a century of service to college bands"
      />

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h2 className="font-serif text-3xl font-bold text-kkpsi-navy">Major Milestones</h2>
            </div>

            <AnimatedSection className="relative space-y-6">
              {/* Vertical line */}
              <div className="absolute left-[39px] top-0 h-full w-0.5 bg-gradient-to-b from-kkpsi-gold to-amber-500"></div>

              {timeline.map((event, index) => (
                <div key={index} className={`animate-on-scroll stagger-${index + 1} relative flex gap-6`}>
                  {/* Year marker */}
                  <div className="z-10 flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-4 border-kkpsi-gold bg-white shadow-sm">
                    <span className="font-bold text-kkpsi-navy">{event.year}</span>
                  </div>

                  {/* Event content */}
                  <div className="flex-1 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200/50 transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-gray-300">
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      {event.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-500">{event.description}</p>
                  </div>
                </div>
              ))}
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Historical Note */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold text-kkpsi-navy">
              A Rich Heritage
            </h2>
            <p className="text-lg text-gray-700">
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

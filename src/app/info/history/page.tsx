import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Navbar } from "~/components/layout/navbar";
import { PageHero } from "~/components/shared";

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
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl text-kkpsi-navy">
                  Major Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-8">
                  {/* Vertical line */}
                  <div className="absolute left-[39px] top-0 h-full w-0.5 bg-kkpsi-gold"></div>

                  {timeline.map((event, index) => (
                    <div key={index} className="relative flex gap-6">
                      {/* Year marker */}
                      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-4 border-kkpsi-gold bg-white">
                        <span className="font-bold text-kkpsi-navy">{event.year}</span>
                      </div>

                      {/* Event content */}
                      <div className="flex-1 rounded-lg border-2 border-gray-200 bg-white p-6 transition-all hover:border-kkpsi-navy hover:shadow-md">
                        <h3 className="mb-2 text-xl font-semibold text-kkpsi-navy">
                          {event.title}
                        </h3>
                        <p className="text-gray-700">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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

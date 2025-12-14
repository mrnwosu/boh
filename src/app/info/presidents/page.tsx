import { GraduationCap } from "lucide-react";
import { Navbar } from "~/components/layout/navbar";
import { PageHero, AnimatedSection } from "~/components/shared";
import { api } from "~/trpc/server";

export default async function PresidentsPage() {
  const presidents = await api.content.getPresidents();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <Navbar />

      <PageHero
        icon={GraduationCap}
        title="Past National Presidents"
        description="Leaders who have guided Kappa Kappa Psi throughout its history"
      />

      {/* Presidents Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h2 className="font-serif text-3xl font-bold text-kkpsi-navy dark:text-foreground">National Presidents</h2>
            </div>

            <AnimatedSection className="space-y-3">
              {presidents.map((president, index) => (
                <div
                  key={index}
                  className={`animate-on-scroll stagger-${Math.min(index + 1, 7)} relative flex items-start gap-4 rounded-xl bg-card p-5 shadow-sm ring-1 ring-border transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-ring/50`}
                >
                  {/* Gradient accent bar */}
                  <div className="absolute left-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-purple-500 to-purple-600" />

                  <div className="min-w-[100px] rounded-full bg-muted px-3 py-1 text-center text-sm font-medium tabular-nums text-muted-foreground">
                    {president.Years}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground">
                      {president.Name}
                    </h3>
                    {president.Chapter && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {president.Chapter}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold text-kkpsi-navy dark:text-foreground">
              Leadership Through the Years
            </h2>
            <p className="text-lg text-muted-foreground">
              Each National President has brought unique vision and dedication to
              Kappa Kappa Psi, helping the fraternity grow and serve college bands
              across the nation. Their leadership has been instrumental in shaping
              the organization we know today.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { Users } from "lucide-react";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Navbar } from "~/components/layout/navbar";
import { PageHero } from "~/components/shared";
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {founders.map((founder) => (
              <Link key={founder.slug} href={`/info/founding-fathers/${founder.slug}`}>
                <Card className="h-full border-2 transition-all hover:border-kkpsi-navy hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-kkpsi-navy">
                      {founder.name}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
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

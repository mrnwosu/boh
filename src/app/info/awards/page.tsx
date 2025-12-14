import Link from "next/link";
import { Trophy } from "lucide-react";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Navbar } from "~/components/layout/navbar";
import { PageHero } from "~/components/shared";
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {awards.map((award) => (
              <Link key={award.slug} href={`/info/awards/${award.slug}`}>
                <Card className="h-full border-2 transition-all hover:border-kkpsi-navy hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-kkpsi-gold/20">
                      <Trophy className="h-6 w-6 text-kkpsi-navy" />
                    </div>
                    <CardTitle className="text-2xl text-kkpsi-navy">
                      {award.name}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
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

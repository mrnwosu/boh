import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Navbar } from "~/components/layout/navbar";
import { PageHero } from "~/components/shared";
import { api } from "~/trpc/server";
import ReactMarkdown from "react-markdown";

export default async function MakovskyPage() {
  const makovsky = await api.content.getMakovsky();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <PageHero
        icon={Star}
        title="Bohumil Makovsky"
        description="Our Beloved Patron and Mentor"
      />

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl text-kkpsi-navy">
                  Biography
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <ReactMarkdown>{makovsky.content}</ReactMarkdown>
              </CardContent>
            </Card>

            <Card className="border-kkpsi-gold bg-gradient-to-br from-kkpsi-gold/5 to-kkpsi-gold/10">
              <CardHeader>
                <CardTitle className="text-2xl text-kkpsi-navy">
                  Legacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-700">
                  Bohumil Makovsky served as the National Executive Secretary and Treasurer
                  of Kappa Kappa Psi for over 40 years. His dedication, wisdom, and love
                  for the fraternity shaped it into what it is today. Members affectionately
                  remember him as "Mak," and his influence continues to inspire brothers
                  and sisters across all chapters.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

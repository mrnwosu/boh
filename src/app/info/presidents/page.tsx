import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Navbar } from "~/components/layout/navbar";
import { api } from "~/trpc/server";

export default async function PresidentsPage() {
  const presidents = await api.content.getPresidents();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-kkpsi-navy via-kkpsi-navy-light to-kkpsi-navy py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <GraduationCap className="mx-auto mb-4 h-16 w-16 text-kkpsi-gold" />
            <h1 className="mb-4 font-serif text-5xl font-bold text-white">
              Past National Presidents
            </h1>
            <p className="text-xl text-gray-200">
              Leaders who have guided Kappa Kappa Psi throughout its history
            </p>
          </div>
        </div>
      </section>

      {/* Presidents Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl text-kkpsi-navy">
                  National Presidents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {presidents.map((president, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 border-l-4 border-kkpsi-gold bg-gray-50 p-4 transition-all hover:bg-gray-100"
                    >
                      <div className="min-w-[120px] text-sm font-semibold text-kkpsi-navy">
                        {president.Years}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {president.Name}
                        </h3>
                        {president.Chapter && (
                          <p className="mt-1 text-sm text-gray-600">
                            {president.Chapter}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold text-kkpsi-navy">
              Leadership Through the Years
            </h2>
            <p className="text-lg text-gray-700">
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

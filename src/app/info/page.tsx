import Link from "next/link";
import { BookOpen, Users, Trophy, MapPin, GraduationCap, Star, Clock } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Navbar } from "~/components/layout/navbar";

export default function InfoPage() {
  const infoSections = [
    {
      title: "Founding Fathers",
      description: "Learn about the ten men who founded Kappa Kappa Psi",
      icon: Users,
      href: "/info/founding-fathers",
      color: "bg-kkpsi-navy/10",
    },
    {
      title: "Chapter Directory",
      description: "Browse all 343 active and inactive chapters",
      icon: MapPin,
      href: "/info/chapters",
      color: "bg-kkpsi-gold/20",
    },
    {
      title: "Awards & Jewelry",
      description: "Explore the awards and honors of Kappa Kappa Psi",
      icon: Trophy,
      href: "/info/awards",
      color: "bg-kkpsi-navy/10",
    },
    {
      title: "Bohumil Makovsky",
      description: "Learn about our beloved patron and mentor",
      icon: Star,
      href: "/info/bohumil-makovsky",
      color: "bg-kkpsi-gold/20",
    },
    {
      title: "History & Timeline",
      description: "Discover the rich history of the fraternity",
      icon: Clock,
      href: "/info/history",
      color: "bg-kkpsi-navy/10",
    },
    {
      title: "Past Presidents",
      description: "National Presidents who have led our fraternity",
      icon: GraduationCap,
      href: "/info/presidents",
      color: "bg-kkpsi-gold/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-kkpsi-navy via-kkpsi-navy-light to-kkpsi-navy py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <BookOpen className="mx-auto mb-4 h-16 w-16 text-kkpsi-gold" />
            <h1 className="mb-4 font-serif text-5xl font-bold text-white">
              Information Center
            </h1>
            <p className="text-xl text-gray-200">
              Explore the history, traditions, and people that make Kappa Kappa Psi special
            </p>
          </div>
        </div>
      </section>

      {/* Info Sections Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {infoSections.map((section) => {
              const Icon = section.icon;
              return (
                <Link key={section.href} href={section.href}>
                  <Card className="h-full border-2 transition-all hover:border-kkpsi-navy hover:shadow-lg">
                    <CardHeader>
                      <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-lg ${section.color}`}>
                        <Icon className="h-7 w-7 text-kkpsi-navy" />
                      </div>
                      <CardTitle className="text-2xl">{section.title}</CardTitle>
                      <CardDescription className="text-base">
                        {section.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 font-serif text-3xl font-bold text-kkpsi-navy">
              About Kappa Kappa Psi
            </h2>
            <div className="space-y-4 text-lg text-gray-700">
              <p>
                Kappa Kappa Psi is a fraternal organization that promotes the advancement of college and university bands through dedicated service and support.
              </p>
              <p>
                Founded in 1919 at Oklahoma A&M College (now Oklahoma State University), we have grown to over 343 chapters across the United States, serving thousands of college band members.
              </p>
              <p>
                Our mission is to unite, serve, and honor college band members through service projects, leadership development, and brotherhood.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

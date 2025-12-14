import { BookOpen, Users, Trophy, MapPin, GraduationCap, Star, Clock } from "lucide-react";
import { Navbar } from "~/components/layout/navbar";
import { PageHero, InfoCard } from "~/components/shared";

export default function InfoPage() {
  const infoSections = [
    {
      title: "Founding Fathers",
      description: "Learn about the ten men who founded Kappa Kappa Psi",
      icon: Users,
      href: "/info/founding-fathers",
      iconBgColor: "bg-kkpsi-navy/10",
    },
    {
      title: "Chapter Directory",
      description: "Browse all 343 active and inactive chapters",
      icon: MapPin,
      href: "/info/chapters",
      iconBgColor: "bg-kkpsi-gold/20",
    },
    {
      title: "Awards & Jewelry",
      description: "Explore the awards and honors of Kappa Kappa Psi",
      icon: Trophy,
      href: "/info/awards",
      iconBgColor: "bg-kkpsi-navy/10",
    },
    {
      title: "Bohumil Makovsky",
      description: "Learn about our beloved patron and mentor",
      icon: Star,
      href: "/info/bohumil-makovsky",
      iconBgColor: "bg-kkpsi-gold/20",
    },
    {
      title: "History & Timeline",
      description: "Discover the rich history of the fraternity",
      icon: Clock,
      href: "/info/history",
      iconBgColor: "bg-kkpsi-navy/10",
    },
    {
      title: "Past Presidents",
      description: "National Presidents who have led our fraternity",
      icon: GraduationCap,
      href: "/info/presidents",
      iconBgColor: "bg-kkpsi-gold/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <PageHero
        icon={BookOpen}
        title="Information Center"
        description="Explore the history, traditions, and people that make Kappa Kappa Psi special"
      />

      {/* Info Sections Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {infoSections.map((section) => (
              <InfoCard
                key={section.href}
                title={section.title}
                description={section.description}
                icon={section.icon}
                href={section.href}
                iconBgColor={section.iconBgColor}
              />
            ))}
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

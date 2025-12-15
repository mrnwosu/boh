import type { Metadata } from "next";
import { Star, Heart, Calendar, MapPin, Music, Award, Flag, Quote } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Navbar } from "~/components/layout/navbar";
import { PageHero, AnimatedSection, InteractiveTimeline } from "~/components/shared";
import { api } from "~/trpc/server";
import { parseTimelineMarkdown, parseLegacy } from "~/lib/content/timeline-parser";

export const metadata: Metadata = {
  title: "Bohumil Makovsky | Kappa Kappa Psi",
  description:
    "Learn about Bohumil Makovsky, the beloved patron and mentor of Kappa Kappa Psi who served as National Executive Secretary for over 40 years.",
  keywords: [
    "Bohumil Makovsky",
    "Kappa Kappa Psi",
    "KKPsi patron",
    "Mak",
    "band fraternity",
    "executive secretary",
  ],
  openGraph: {
    title: "Bohumil Makovsky | Kappa Kappa Psi",
    description:
      "Our beloved patron and mentor who shaped the fraternity",
    type: "website",
  },
};

// Key facts about Makovsky for the stats section
const keyFacts = [
  { icon: Calendar, label: "Born", value: "Sept 23, 1878", subtext: "Frantisky, Bohemia" },
  { icon: Flag, label: "Immigrated", value: "1895", subtext: "Age 17" },
  { icon: Music, label: "OAMC Director", value: "1915-1945", subtext: "30 Years" },
  { icon: Star, label: "First Honorary", value: "Jan 2, 1922", subtext: "KKΨ Member" },
  { icon: Award, label: "Grand President", value: "1926-1927", subtext: "KKΨ" },
  { icon: Heart, label: "Passed", value: "June 12, 1950", subtext: "Age 71" },
];

export default async function MakovskyPage() {
  const makovsky = await api.content.getMakovsky();

  // Parse the timeline data from markdown
  const timelineEras = parseTimelineMarkdown(makovsky.content);
  const legacyContent = parseLegacy(makovsky.content);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navbar />

      <PageHero
        icon={Star}
        title="Bohumil Makovsky"
        description="Our Beloved Patron and Guiding Spirit"
      >
        {/* Stats Cards */}
        <div className="mx-auto mt-6 sm:mt-8 grid max-w-2xl grid-cols-3 gap-2 sm:gap-4 px-2 sm:px-0">
          <div className="glass rounded-lg sm:rounded-xl p-2 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-kkpsi-gold">40+</div>
            <div className="text-xs sm:text-sm text-gray-300">Years of Service</div>
          </div>
          <div className="glass rounded-lg sm:rounded-xl p-2 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Heart className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="text-xs sm:text-sm text-gray-300">Beloved &ldquo;Mak&rdquo;</div>
          </div>
          <div className="glass rounded-lg sm:rounded-xl p-2 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="text-xs sm:text-sm text-gray-300">Enduring Legacy</div>
          </div>
        </div>
      </PageHero>

      {/* Key Facts Section */}
      <section className="py-8 sm:py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <AnimatedSection className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
              {keyFacts.map((fact, index) => (
                <div
                  key={fact.label}
                  className={`animate-on-scroll stagger-${Math.min(index + 1, 7)} group relative overflow-hidden rounded-lg sm:rounded-xl bg-card p-3 sm:p-4 text-center shadow-sm ring-1 ring-border transition-all active:scale-[0.98] sm:hover:-translate-y-1 sm:hover:shadow-md sm:hover:ring-kkpsi-gold/30`}
                >
                  {/* Gradient accent */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="mb-1.5 sm:mb-2 inline-flex rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-1.5 sm:p-2">
                    <fact.icon className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                  </div>
                  <div className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {fact.label}
                  </div>
                  <div className="mt-0.5 sm:mt-1 text-sm sm:text-base font-semibold text-foreground">
                    {fact.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    {fact.subtext}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Introduction Quote */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <AnimatedSection className="mx-auto max-w-4xl">
            <div className="animate-on-scroll stagger-1 relative rounded-xl sm:rounded-2xl bg-gradient-to-br from-kkpsi-navy to-kkpsi-navy-light p-5 sm:p-8 text-white shadow-xl">
              {/* Decorative quote icon */}
              <Quote className="absolute right-4 top-4 sm:right-6 sm:top-6 h-10 w-10 sm:h-16 sm:w-16 text-white/10" />

              <div className="relative">
                <p className="text-base sm:text-lg md:text-xl leading-relaxed">
                  <span className="text-kkpsi-gold">&ldquo;</span>
                  Dr. Bohumil Makovsky is officially recognized by Kappa Kappa Psi as the
                  <strong className="text-kkpsi-gold"> &ldquo;Guiding Spirit&rdquo; </strong>
                  of the fraternity. His life exemplified the values of Honor, Integrity,
                  Respect, and Loyalty—values that continue to guide brothers and sisters today.
                  <span className="text-kkpsi-gold">&rdquo;</span>
                </p>
                <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3">
                  <div className="h-px flex-1 bg-white/20" />
                  <span className="text-xs sm:text-sm text-white/60 whitespace-nowrap">The Guiding Spirit</span>
                  <div className="h-px flex-1 bg-white/20" />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Biography Overview */}
      <section className="py-8 sm:py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <AnimatedSection className="mx-auto max-w-4xl">
            <div className="animate-on-scroll stagger-1 relative rounded-xl bg-card p-5 sm:p-8 shadow-sm ring-1 ring-border">
              {/* Gradient accent bar */}
              <div className="absolute left-0 top-5 sm:top-8 h-10 sm:h-12 w-1 rounded-r-full bg-gradient-to-b from-amber-500 to-orange-500" />

              <div className="flex items-start gap-4">
                <div className="hidden md:block">
                  <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-4">
                    <MapPin className="h-8 w-8 text-amber-500" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="mb-3 sm:mb-4 font-serif text-xl sm:text-2xl font-bold text-kkpsi-navy dark:text-foreground">
                    From Bohemia to Oklahoma
                  </h2>
                  <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-muted-foreground">
                    <p className="leading-relaxed">
                      Born in Frantisky, Bohemia (now the Czech Republic) on September 23, 1878,
                      Bohumil Makovsky&apos;s journey to becoming one of America&apos;s most influential
                      band directors began with hardship. His father died before he was born, and
                      his mother passed when he was just 12 years old.
                    </p>
                    <p className="leading-relaxed">
                      At 17, with help from his older sister Anna, he immigrated to the United States
                      in 1895—making the four-day voyage in steerage with minimal food and money.
                      This humble beginning would lead to a legacy that shaped American music
                      education and touched thousands of lives through Kappa Kappa Psi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Interactive Timeline */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <AnimatedSection>
              <div className="animate-on-scroll stagger-1 mb-6 sm:mb-8 text-center">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  A Life of Service
                </h2>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                  Explore the journey of our Guiding Spirit through the years
                </p>
              </div>
            </AnimatedSection>

            <div className="animate-on-scroll stagger-2 rounded-xl sm:rounded-2xl bg-card p-4 sm:p-6 md:p-8 shadow-sm ring-1 ring-border">
              <InteractiveTimeline eras={timelineEras} />
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      {legacyContent && (
        <section className="py-10 sm:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection className="mx-auto max-w-4xl">
              <div className="animate-on-scroll stagger-1 relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-kkpsi-gold/5 via-amber-500/5 to-orange-500/5 p-5 sm:p-8 shadow-sm ring-1 ring-kkpsi-gold/20">
                {/* Decorative elements - hidden on mobile */}
                <div className="hidden sm:block absolute -right-8 -top-8 h-32 w-32 rounded-full bg-kkpsi-gold/10 blur-3xl" />
                <div className="hidden sm:block absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl" />

                {/* Gradient accent bar */}
                <div className="absolute left-0 top-5 sm:top-8 h-10 sm:h-12 w-1 rounded-r-full bg-gradient-to-b from-kkpsi-gold to-amber-500" />

                <div className="relative">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="rounded-lg bg-gradient-to-br from-kkpsi-gold to-amber-500 p-1.5 sm:p-2">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-kkpsi-navy dark:text-foreground">
                      Legacy
                    </h2>
                  </div>

                  <div className="text-sm sm:text-base leading-relaxed text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{legacyContent}</ReactMarkdown>
                  </div>

                  {/* Values highlight */}
                  <div className="mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                    {["Honor", "Integrity", "Respect", "Loyalty"].map((value) => (
                      <div
                        key={value}
                        className="rounded-lg bg-card/80 px-3 sm:px-4 py-2 sm:py-3 text-center ring-1 ring-border"
                      >
                        <span className="text-sm sm:text-base font-semibold text-kkpsi-navy dark:text-kkpsi-gold">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Memorial Award Section */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection className="mx-auto max-w-4xl">
            <div className="animate-on-scroll stagger-1 relative rounded-xl bg-card p-5 sm:p-8 text-center shadow-sm ring-1 ring-border">
              <div className="mx-auto mb-3 sm:mb-4 inline-flex rounded-full bg-gradient-to-br from-kkpsi-gold/20 to-amber-500/20 p-3 sm:p-4">
                <Award className="h-6 w-6 sm:h-8 sm:w-8 text-kkpsi-gold" />
              </div>
              <h3 className="mb-2 font-serif text-lg sm:text-xl font-bold text-foreground">
                Bohumil Makovsky Memorial Award
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Established in 1979, this award honors outstanding contributions to
                Kappa Kappa Psi, ensuring that Mak&apos;s legacy of service and dedication
                continues to inspire future generations of brothers and sisters.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

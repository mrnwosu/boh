import { Star } from "lucide-react";
import { Navbar } from "~/components/layout/navbar";
import { PageHero, AnimatedSection } from "~/components/shared";
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
          <AnimatedSection className="mx-auto max-w-4xl space-y-6">
            {/* Biography Card */}
            <div className="animate-on-scroll stagger-1 relative rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200/50">
              {/* Gradient accent bar */}
              <div className="absolute left-0 top-8 h-12 w-1 rounded-r-full bg-gradient-to-b from-amber-500 to-orange-500" />

              <h2 className="mb-6 font-serif text-3xl font-bold text-kkpsi-navy">
                Biography
              </h2>
              <div className="prose prose-lg max-w-none prose-headings:text-kkpsi-navy prose-p:text-gray-600 prose-p:leading-relaxed">
                <ReactMarkdown>{makovsky.content}</ReactMarkdown>
              </div>
            </div>

            {/* Legacy Card */}
            <div className="animate-on-scroll stagger-2 relative overflow-hidden rounded-xl bg-gradient-to-br from-kkpsi-gold/5 to-kkpsi-gold/10 p-8 shadow-sm ring-1 ring-kkpsi-gold/20">
              {/* Gradient accent bar */}
              <div className="absolute left-0 top-8 h-12 w-1 rounded-r-full bg-gradient-to-b from-kkpsi-gold to-amber-500" />

              <h2 className="mb-4 font-serif text-2xl font-bold text-kkpsi-navy">
                Legacy
              </h2>
              <p className="leading-relaxed text-gray-700">
                Bohumil Makovsky served as the National Executive Secretary and Treasurer
                of Kappa Kappa Psi for over 40 years. His dedication, wisdom, and love
                for the fraternity shaped it into what it is today. Members affectionately
                remember him as &ldquo;Mak,&rdquo; and his influence continues to inspire brothers
                and sisters across all chapters.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

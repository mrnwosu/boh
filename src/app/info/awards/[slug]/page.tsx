import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Trophy } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Navbar } from "~/components/layout/navbar";
import { api } from "~/trpc/server";
import ReactMarkdown from "react-markdown";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const award = await api.content.getAward({ slug });

  if (!award) {
    return {
      title: "Award Not Found | Kappa Kappa Psi",
    };
  }

  return {
    title: `${award.name} | Awards & Jewelry | Kappa Kappa Psi`,
    description: `Learn about the ${award.name} award from Kappa Kappa Psi National Honorary Band Fraternity.`,
    keywords: [
      award.name,
      "Kappa Kappa Psi",
      "KKPsi award",
      "band fraternity",
      "fraternity honor",
    ],
    openGraph: {
      title: `${award.name} | Kappa Kappa Psi Award`,
      description: `Details about the ${award.name} award`,
      type: "article",
    },
  };
}

export default async function AwardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const award = await api.content.getAward({ slug });

  if (!award) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-kkpsi-navy via-kkpsi-navy-light to-kkpsi-navy py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <Button
              asChild
              variant="ghost"
              className="mb-4 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/info/awards">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Awards
              </Link>
            </Button>
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-kkpsi-gold">
                <Trophy className="h-8 w-8 text-kkpsi-navy" />
              </div>
              <div>
                <h1 className="mb-2 font-serif text-5xl font-bold text-white">
                  {award.name}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl text-kkpsi-navy">Details</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <ReactMarkdown>{award.content}</ReactMarkdown>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
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
  const founder = await api.content.getFounder({ slug });

  if (!founder) {
    return {
      title: "Founder Not Found | Kappa Kappa Psi",
    };
  }

  return {
    title: `${founder.name} | Founding Fathers | Kappa Kappa Psi`,
    description: `Learn about ${founder.name}, one of the ten founding fathers of Kappa Kappa Psi National Honorary Band Fraternity.`,
    keywords: [
      founder.name,
      "Kappa Kappa Psi",
      "founding father",
      "KKPsi history",
      "band fraternity",
    ],
    openGraph: {
      title: `${founder.name} | Kappa Kappa Psi Founding Father`,
      description: `Biography of ${founder.name}, founding father of Kappa Kappa Psi`,
      type: "article",
    },
  };
}

export default async function FoundingFatherPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const founder = await api.content.getFounder({ slug });

  if (!founder) {
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
              <Link href="/info/founding-fathers">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Founding Fathers
              </Link>
            </Button>
            <h1 className="mb-2 font-serif text-5xl font-bold text-white">
              {founder.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl text-kkpsi-navy">Biography</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <ReactMarkdown>{founder.content}</ReactMarkdown>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

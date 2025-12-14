import Link from "next/link";
import { Brain, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Navbar } from "~/components/layout/navbar";
import { TOPICS } from "~/lib/content/topics";

export default function FlashcardsPage() {
  const topicIcons = [
    "📍", // Chapters
    "👔", // Founding Fathers
    "🏆", // Awards & Jewelry
    "⭐", // Bohumil Makovsky
    "🗺️", // Districts
    "🎓", // HBCU Chapters
    "🎺", // NIB
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-kkpsi-navy via-kkpsi-navy-light to-kkpsi-navy py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Brain className="mx-auto mb-4 h-16 w-16 text-kkpsi-gold" />
            <h1 className="mb-4 font-serif text-5xl font-bold text-white">
              Flashcards
            </h1>
            <p className="text-xl text-gray-200">
              Master KKPsi knowledge with smart flashcards and spaced repetition
            </p>
          </div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="mb-2 font-serif text-3xl font-bold text-kkpsi-navy">
              Choose a Topic
            </h2>
            <p className="text-gray-600">
              Select a flashcard deck to begin studying
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map((topic, index) => (
              <Link key={topic.slug} href={`/flashcards/${topic.slug}`}>
                <Card className="h-full border-2 transition-all hover:border-kkpsi-navy hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{topicIcons[index]}</span>
                        <div>
                          <CardTitle className="text-xl text-kkpsi-navy">
                            {topic.title}
                          </CardTitle>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                    <CardDescription className="mt-2">
                      Study {topic.totalQuestions} flashcards about {topic.title.toLowerCase()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="bg-kkpsi-gold/20 text-kkpsi-navy">
                      {topic.totalQuestions} cards
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center font-serif text-3xl font-bold text-kkpsi-navy">
              Smart Learning Features
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Spaced Repetition</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Our SM-2 algorithm schedules reviews at optimal intervals for maximum retention
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progress Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Track which cards you've mastered and which need more practice (sign in required)
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Multiple Versions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Questions have multiple phrasings to help you understand concepts from different angles
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Filter } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Navbar } from "~/components/layout/navbar";
import { FlashcardDeck } from "~/components/flashcards/flashcard-deck";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner";
import { TOPICS } from "~/lib/content/topics";

export default function FlashcardTopicPage() {
  const params = useParams();
  const topic = params.topic as string;
  const { data: session } = useSession();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Find topic metadata
  const topicInfo = TOPICS.find((t) => t.slug === topic);

  // Fetch flashcards
  const { data: flashcards, isLoading } = api.flashcard.getCards.useQuery({
    topic,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
  });

  // Record response mutation
  const recordResponse = api.flashcard.recordResponse.useMutation({
    onSuccess: () => {
      toast.success("Progress saved!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save progress");
    },
  });

  const handleRecordResponse = async (questionId: string, quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    await recordResponse.mutateAsync({
      topic,
      questionId,
      quality,
    });
  };

  // Get unique tags from flashcards
  const allTags = Array.from(
    new Set(flashcards?.flatMap((card) => card.tags) ?? [])
  ).sort();

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
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
              <Link href="/flashcards">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Topics
              </Link>
            </Button>
            <h1 className="mb-2 font-serif text-5xl font-bold text-white">
              {topicInfo?.title ?? topic}
            </h1>
            <p className="text-xl text-gray-200">
              {flashcards?.length ?? 0} flashcard{flashcards?.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Tag Filters */}
            {allTags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Filter className="h-5 w-5" />
                    Filter by Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          selectedTags.includes(tag)
                            ? "bg-kkpsi-navy hover:bg-kkpsi-navy-light"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                    {selectedTags.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTags([])}
                        className="h-7 text-xs"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Flashcard Deck */}
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[400px] w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : flashcards && flashcards.length > 0 ? (
              <FlashcardDeck
                questions={flashcards}
                topic={topic}
                onRecordResponse={session ? handleRecordResponse : undefined}
                isAuthenticated={!!session}
              />
            ) : (
              <div className="py-12 text-center">
                <p className="text-lg text-gray-600">
                  No flashcards found{selectedTags.length > 0 ? " with the selected tags" : ""}.
                </p>
                {selectedTags.length > 0 && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSelectedTags([])}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

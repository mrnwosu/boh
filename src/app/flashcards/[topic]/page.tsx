"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Navbar } from "~/components/layout/navbar";
import { FlashcardDeck } from "~/components/flashcards/flashcard-deck";
import { FlashcardSkeleton, TagFilterSkeleton } from "~/components/flashcards/flashcard-skeleton";
import { TagSelector, EmptyState } from "~/components/shared";
import { useTagSelection } from "~/hooks";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner";
import { TOPICS } from "~/lib/content/topics";
import type { TopicSlug } from "~/lib/schemas/topic";

export default function FlashcardTopicPage() {
  const params = useParams();
  const topic = params.topic as TopicSlug;
  const { data: session } = useSession();
  const { selectedTags, toggleTag, clearTags } = useTagSelection();

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

  const handleRecordResponse = async (questionId: string, response: "again" | "hard" | "good" | "easy") => {
    await recordResponse.mutateAsync({
      topic,
      questionId,
      response,
    });
  };

  // Get unique tags from flashcards
  const allTags = Array.from(
    new Set(flashcards?.flatMap((card) => card.tags) ?? [])
  ).sort();

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
              <Link href="/flashcards">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Topics
              </Link>
            </Button>
            <h1 className="mb-2 font-serif text-5xl font-bold text-white">
              {topicInfo?.title ?? topic}
            </h1>
            <p className="text-xl text-gray-200">
              {isLoading ? (
                <Skeleton className="inline-block h-6 w-40 bg-white/20" />
              ) : (
                <>{flashcards?.length ?? 0} flashcard{flashcards?.length !== 1 ? "s" : ""} available</>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Tag Filters */}
            {isLoading ? (
              <TagFilterSkeleton />
            ) : allTags.length > 0 ? (
              <TagSelector
                availableTags={allTags}
                selectedTags={selectedTags}
                onTagToggle={toggleTag}
                onClearAll={clearTags}
                variant="dropdown"
                showSelectedBadges
              />
            ) : null}

            {/* Flashcard Deck */}
            {isLoading ? (
              <FlashcardSkeleton />
            ) : flashcards && flashcards.length > 0 ? (
              <FlashcardDeck
                questions={flashcards}
                topic={topic}
                onRecordResponse={session ? handleRecordResponse : undefined}
                isAuthenticated={!!session}
              />
            ) : (
              <EmptyState
                title="No flashcards found"
                description={selectedTags.length > 0 ? "No flashcards match the selected tags" : undefined}
                action={
                  selectedTags.length > 0
                    ? { label: "Clear Filters", onClick: clearTags }
                    : undefined
                }
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

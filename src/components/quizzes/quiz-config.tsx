"use client";

import { useState } from "react";
import { Play, Settings, Clock, Hash, Tag } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { TagSelector } from "~/components/shared";
import { useTagSelection } from "~/hooks";
import type { TopicSlugWithMixed } from "~/lib/schemas/topic";
import type { QuizConfigParams } from "~/lib/utils/quiz-params";

interface QuizConfigProps {
  topics: Array<{ slug: string; title: string; totalQuestions: number }>;
  onStartQuiz: (config: QuizConfigParams) => void;
}

export function QuizConfigForm({ topics, onStartQuiz }: QuizConfigProps) {
  const [selectedTopic, setSelectedTopic] = useState<TopicSlugWithMixed | "">("");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [isTimed, setIsTimed] = useState<boolean>(true);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(10);

  const { selectedTags, toggleTag, clearTags } = useTagSelection();

  // Common tags - could be fetched from API
  const availableTags = [
    "Founding",
    "History",
    "Leadership",
    "Districts",
    "Chapters",
    "Awards",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTopic) {
      return;
    }

    onStartQuiz({
      topic: selectedTopic,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      questionCount,
      isTimed,
      timePerQuestion: isTimed ? timePerQuestion : undefined,
    });
  };

  const selectedTopicInfo = topics.find((t) => t.slug === selectedTopic);

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative rounded-2xl bg-card p-8 shadow-xl ring-1 ring-border">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-kkpsi-navy to-kkpsi-navy-light">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Configure Your Quiz
            </h2>
          </div>
          <p className="text-muted-foreground">
            Customize your quiz settings to match your learning goals
          </p>
        </div>

        <div className="space-y-6">
          {/* Topic Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Tag className="h-4 w-4 text-muted-foreground" />
              Topic
            </label>
            <Select value={selectedTopic} onValueChange={(val) => setSelectedTopic(val as TopicSlugWithMixed)}>
              <SelectTrigger className="h-12 rounded-lg border-border bg-muted/50 transition-colors focus:bg-card">
                <SelectValue placeholder="Select a topic..." />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic.slug} value={topic.slug}>
                    <div className="flex items-center justify-between gap-4">
                      <span>{topic.title}</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {topic.totalQuestions} questions
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tag Filters */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Filter by Tags <span className="text-muted-foreground">(Optional)</span>
            </label>
            <TagSelector
              availableTags={availableTags}
              selectedTags={selectedTags}
              onTagToggle={toggleTag}
              onClearAll={clearTags}
              variant="inline"
            />
          </div>

          {/* Question Count */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Hash className="h-4 w-4 text-muted-foreground" />
              Number of Questions
              {selectedTopicInfo && (
                <span className="ml-auto text-xs font-normal text-muted-foreground">
                  Max: {selectedTopicInfo.totalQuestions}
                </span>
              )}
            </label>
            <Input
              type="number"
              min={1}
              max={selectedTopicInfo?.totalQuestions ?? 100}
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value) || 10)}
              className="h-12 rounded-lg border-border bg-muted/50 transition-colors focus:bg-card"
            />
          </div>

          {/* Timed Mode */}
          <div className="rounded-xl border border-border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isTimed ? "bg-kkpsi-gold/20" : "bg-muted"} transition-colors`}>
                  <Clock className={`h-5 w-5 ${isTimed ? "text-kkpsi-gold-dark" : "text-muted-foreground"} transition-colors`} />
                </div>
                <div>
                  <p className="font-medium text-foreground">Timed Quiz</p>
                  <p className="text-sm text-muted-foreground">Add time pressure to your quiz</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isTimed}
                onClick={() => setIsTimed(!isTimed)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                  isTimed ? "bg-kkpsi-navy" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
                    isTimed ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {isTimed && (
              <div className="mt-4 border-t border-border pt-4">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Seconds per Question
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={5}
                    max={120}
                    value={timePerQuestion}
                    onChange={(e) => setTimePerQuestion(parseInt(e.target.value) || 10)}
                    className="h-10 w-24 rounded-lg border-border bg-card text-center"
                  />
                  <div className="flex gap-2">
                    {[5, 10, 15, 30].map((seconds) => (
                      <button
                        key={seconds}
                        type="button"
                        onClick={() => setTimePerQuestion(seconds)}
                        className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                          timePerQuestion === seconds
                            ? "bg-kkpsi-navy text-white"
                            : "bg-card text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {seconds}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!selectedTopic}
            className="h-14 w-full rounded-xl bg-gradient-to-r from-kkpsi-navy to-kkpsi-navy-light text-lg font-semibold shadow-lg shadow-kkpsi-navy/25 transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
            size="lg"
          >
            <Play className="mr-2 h-5 w-5" />
            Start Quiz
          </Button>
        </div>
      </div>
    </form>
  );
}

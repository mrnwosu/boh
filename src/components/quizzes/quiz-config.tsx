"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
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
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl text-kkpsi-navy">Configure Your Quiz</CardTitle>
          <CardDescription>
            Customize your quiz settings to match your learning goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Topic Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Topic</label>
            <Select value={selectedTopic} onValueChange={(val) => setSelectedTopic(val as TopicSlugWithMixed)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a topic..." />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic.slug} value={topic.slug}>
                    {topic.title} ({topic.totalQuestions} questions)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tag Filters */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Filter by Tags (Optional)</label>
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
            <label className="text-sm font-medium">
              Number of Questions
              {selectedTopicInfo && (
                <span className="ml-2 text-xs text-gray-500">
                  (Max: {selectedTopicInfo.totalQuestions})
                </span>
              )}
            </label>
            <Input
              type="number"
              min={1}
              max={selectedTopicInfo?.totalQuestions ?? 100}
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value) || 10)}
            />
          </div>

          {/* Timed Mode */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="timed"
                checked={isTimed}
                onChange={(e) => setIsTimed(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="timed" className="text-sm font-medium">
                Timed Quiz
              </label>
            </div>

            {isTimed && (
              <div className="ml-7 space-y-2">
                <label className="text-sm font-medium">Seconds per Question</label>
                <Input
                  type="number"
                  min={5}
                  max={120}
                  value={timePerQuestion}
                  onChange={(e) => setTimePerQuestion(parseInt(e.target.value) || 10)}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!selectedTopic}
            className="w-full bg-kkpsi-navy hover:bg-kkpsi-navy-light"
            size="lg"
          >
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

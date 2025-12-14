"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import type { QuizQuestion } from "~/types/trivia";

interface QuizQuestionProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answerId: string) => void;
  showResult?: boolean;
  selectedAnswer?: string;
}

export function QuizQuestionComponent({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  showResult = false,
  selectedAnswer,
}: QuizQuestionProps) {
  const [selected, setSelected] = useState<string | null>(selectedAnswer ?? null);

  useEffect(() => {
    setSelected(selectedAnswer ?? null);
  }, [selectedAnswer]);

  const handleSelect = (answerId: string) => {
    if (showResult) return; // Don't allow changes after showing result
    setSelected(answerId);
    onAnswer(answerId);
  };

  const getButtonVariant = (answerId: string) => {
    if (!showResult) {
      return selected === answerId ? "default" : "outline";
    }

    // Show result
    if (answerId === question.correctAnswerId) {
      return "default"; // Correct answer
    }
    if (selected === answerId && answerId !== question.correctAnswerId) {
      return "destructive"; // Wrong answer that was selected
    }
    return "outline";
  };

  const getButtonIcon = (answerId: string) => {
    if (!showResult) return null;

    if (answerId === question.correctAnswerId) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
    if (selected === answerId && answerId !== question.correctAnswerId) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    return null;
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="mb-2 text-sm font-medium text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </div>
        <CardTitle className="text-2xl text-kkpsi-navy">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {question.answers.map((answer) => (
          <Button
            key={answer.id}
            variant={getButtonVariant(answer.id)}
            className={`w-full justify-start text-left h-auto py-4 px-6 ${
              getButtonVariant(answer.id) === "default" && showResult
                ? "bg-green-500 hover:bg-green-600"
                : ""
            }`}
            onClick={() => handleSelect(answer.id)}
            disabled={showResult}
          >
            <div className="flex items-center gap-3 w-full">
              <span className="flex-1">{answer.text}</span>
              {getButtonIcon(answer.id)}
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

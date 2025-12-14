"use client";

import { useState } from "react";
import { Card } from "~/components/ui/card";

interface FlashcardProps {
  question: string;
  answer: string;
}

export function Flashcard({ question, answer }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="perspective-1000 h-[400px] w-full cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 transform-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front */}
        <Card
          className={`absolute inset-0 flex items-center justify-center border-4 border-kkpsi-navy bg-white p-8 backface-hidden ${
            isFlipped ? "invisible" : "visible"
          }`}
        >
          <div className="text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-kkpsi-gold">
              Question
            </p>
            <p className="text-2xl font-medium text-gray-900">{question}</p>
            <p className="mt-8 text-sm text-gray-500">Click to reveal answer</p>
          </div>
        </Card>

        {/* Back */}
        <Card
          className={`absolute inset-0 flex items-center justify-center border-4 border-kkpsi-gold bg-gradient-to-br from-kkpsi-navy to-kkpsi-navy-light p-8 rotate-y-180 backface-hidden ${
            isFlipped ? "visible" : "invisible"
          }`}
        >
          <div className="text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-kkpsi-gold">
              Answer
            </p>
            <p className="text-2xl font-medium text-white">{answer}</p>
            <p className="mt-8 text-sm text-gray-300">Click to see question</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

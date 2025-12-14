"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Card } from "~/components/ui/card";

interface FlashcardProps {
  question: string;
  answer: string;
  description?: string;
}

export function Flashcard({ question, answer, description }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="perspective-1000 h-[280px] w-full cursor-pointer group sm:h-[340px] md:h-[400px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative h-full w-full transition-transform duration-700 transform-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        {/* Front */}
        <Card
          className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl border-0 bg-white p-4 shadow-2xl shadow-kkpsi-navy/10 backface-hidden sm:p-6 md:p-8 ${
            isFlipped ? "invisible" : "visible"
          }`}
        >
          {/* Decorative corner accents */}
          <div className="absolute left-0 top-0 h-24 w-24 bg-gradient-to-br from-kkpsi-navy/5 to-transparent"></div>
          <div className="absolute bottom-0 right-0 h-24 w-24 bg-gradient-to-tl from-kkpsi-gold/10 to-transparent"></div>

          {/* Top accent bar */}
          <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-kkpsi-navy via-kkpsi-navy-light to-kkpsi-navy"></div>

          <div className="relative text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-kkpsi-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-kkpsi-gold-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-kkpsi-gold animate-pulse"></span>
              Question
            </div>
            <p className="text-lg font-medium leading-relaxed text-gray-900 sm:text-2xl md:text-3xl">{question}</p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400 transition-colors group-hover:text-kkpsi-navy sm:mt-8 md:mt-10">
              <RotateCcw className="h-4 w-4" />
              <span>Click to reveal answer</span>
            </div>
          </div>
        </Card>

        {/* Back */}
        <Card
          className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-kkpsi-navy via-kkpsi-navy to-kkpsi-navy-dark p-4 shadow-2xl shadow-kkpsi-navy/20 rotate-y-180 backface-hidden sm:p-6 md:p-8 ${
            isFlipped ? "visible" : "invisible"
          }`}
        >
          {/* Decorative elements */}
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-kkpsi-gold/10 blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/5 blur-2xl"></div>

          {/* Bottom accent bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-kkpsi-gold via-kkpsi-gold-light to-kkpsi-gold"></div>

          <div className="relative text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-kkpsi-gold/30 bg-kkpsi-gold/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-kkpsi-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-kkpsi-gold animate-pulse"></span>
              Answer
            </div>
            <p className="text-lg font-medium leading-relaxed text-white sm:text-2xl md:text-3xl">{answer}</p>
            {description && (
              <p className="mx-auto mt-6 max-w-md text-sm italic text-gray-300/80">
                {description}
              </p>
            )}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400 transition-colors group-hover:text-kkpsi-gold sm:mt-8 md:mt-10">
              <RotateCcw className="h-4 w-4" />
              <span>Click to see question</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

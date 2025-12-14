"use client";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

interface SpacedRepetitionControlsProps {
  onResponse: (response: "again" | "hard" | "good" | "easy") => Promise<void> | void;
  disabled?: boolean;
}

export function SpacedRepetitionControls({
  onResponse,
  disabled,
}: SpacedRepetitionControlsProps) {
  const buttons = [
    {
      label: "Again",
      description: "Complete blackout",
      response: "again" as const,
      variant: "destructive" as const,
    },
    {
      label: "Hard",
      description: "Incorrect, but familiar",
      response: "hard" as const,
      variant: "outline" as const,
    },
    {
      label: "Good",
      description: "Correct with effort",
      response: "good" as const,
      variant: "outline" as const,
    },
    {
      label: "Easy",
      description: "Perfect recall",
      response: "easy" as const,
      variant: "default" as const,
    },
  ];

  return (
    <Card className="border-kkpsi-navy/20 bg-gradient-to-br from-card to-muted/50">
      <CardHeader>
        <CardTitle className="text-xl text-kkpsi-navy dark:text-kkpsi-navy-light">How well did you know this?</CardTitle>
        <CardDescription>
          Your response helps the system schedule this card for optimal review
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
          {buttons.map((button) => (
            <Button
              key={button.response}
              variant={button.variant}
              onClick={() => onResponse(button.response)}
              disabled={disabled}
              className="flex h-auto min-h-[52px] flex-col items-start gap-0.5 p-3 sm:min-h-[60px] sm:gap-1 sm:p-4"
            >
              <span className="text-sm font-semibold sm:text-base">{button.label}</span>
              <span className="text-xs font-normal opacity-80">{button.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

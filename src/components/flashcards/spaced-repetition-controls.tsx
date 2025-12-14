"use client";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

interface SpacedRepetitionControlsProps {
  onResponse: (quality: 0 | 1 | 2 | 3 | 4 | 5) => Promise<void> | void;
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
      quality: 0 as const,
      variant: "destructive" as const,
    },
    {
      label: "Hard",
      description: "Incorrect, but familiar",
      quality: 2 as const,
      variant: "outline" as const,
    },
    {
      label: "Good",
      description: "Correct with effort",
      quality: 4 as const,
      variant: "outline" as const,
    },
    {
      label: "Easy",
      description: "Perfect recall",
      quality: 5 as const,
      variant: "default" as const,
    },
  ];

  return (
    <Card className="border-kkpsi-navy/20 bg-gradient-to-br from-white to-gray-50">
      <CardHeader>
        <CardTitle className="text-xl text-kkpsi-navy">How well did you know this?</CardTitle>
        <CardDescription>
          Your response helps the system schedule this card for optimal review
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {buttons.map((button) => (
            <Button
              key={button.quality}
              variant={button.variant}
              onClick={() => onResponse(button.quality)}
              disabled={disabled}
              className="flex h-auto flex-col items-start gap-1 p-4"
            >
              <span className="text-base font-semibold">{button.label}</span>
              <span className="text-xs font-normal opacity-80">{button.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

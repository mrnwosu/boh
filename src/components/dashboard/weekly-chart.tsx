"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { BarChart3 } from "lucide-react";

interface WeeklyData {
  date: string;
  quizzes: number;
  cards: number;
}

interface WeeklyChartProps {
  data: WeeklyData[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  // Find max value for scaling
  const maxValue = Math.max(
    ...data.map((d) => d.quizzes + d.cards),
    1 // Minimum of 1 to avoid division by zero
  );

  const isEmpty = data.every((d) => d.quizzes === 0 && d.cards === 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-5 w-5 text-kkpsi-navy dark:text-kkpsi-navy-light" />
          Weekly Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex h-40 items-center justify-center text-center text-sm text-muted-foreground">
            <p>
              No activity this week yet.
              <br />
              Start studying to see your progress!
            </p>
          </div>
        ) : (
          <div className="flex h-40 items-end justify-between gap-2">
            {data.map((day, index) => {
              const totalHeight = ((day.quizzes + day.cards) / maxValue) * 100;
              const quizHeight =
                day.quizzes + day.cards > 0
                  ? (day.quizzes / (day.quizzes + day.cards)) * totalHeight
                  : 0;
              const cardHeight = totalHeight - quizHeight;

              return (
                <div
                  key={day.date}
                  className="group flex flex-1 flex-col items-center gap-1"
                >
                  {/* Tooltip */}
                  <div className="pointer-events-none absolute -mt-16 rounded-lg bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="font-medium">{day.date}</div>
                    <div className="text-kkpsi-gold">{day.quizzes} quizzes</div>
                    <div className="text-kkpsi-navy dark:text-kkpsi-navy-light">
                      {day.cards} cards
                    </div>
                  </div>

                  {/* Bar */}
                  <div
                    className="relative flex w-full flex-col justify-end overflow-hidden rounded-t-md transition-all duration-300"
                    style={{ height: `${Math.max(totalHeight, 4)}%` }}
                  >
                    {/* Cards portion */}
                    <div
                      className="w-full bg-kkpsi-navy transition-all duration-500 dark:bg-kkpsi-navy-light"
                      style={{
                        height: cardHeight > 0 ? `${(cardHeight / totalHeight) * 100}%` : "0%",
                      }}
                    />
                    {/* Quizzes portion */}
                    <div
                      className="w-full bg-kkpsi-gold transition-all duration-500"
                      style={{
                        height: quizHeight > 0 ? `${(quizHeight / totalHeight) * 100}%` : "0%",
                      }}
                    />
                  </div>

                  {/* Day label */}
                  <span
                    className={`text-xs ${
                      index === data.length - 1
                        ? "font-semibold text-kkpsi-navy dark:text-kkpsi-navy-light"
                        : "text-muted-foreground"
                    }`}
                  >
                    {day.date}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        {!isEmpty && (
          <div className="mt-4 flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-kkpsi-navy dark:bg-kkpsi-navy-light" />
              <span className="text-muted-foreground">Cards</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-kkpsi-gold" />
              <span className="text-muted-foreground">Quizzes</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

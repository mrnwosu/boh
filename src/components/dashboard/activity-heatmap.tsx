"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Calendar } from "lucide-react";

interface HeatmapData {
  date: string;
  count: number;
  level: number; // 0-4
}

interface ActivityHeatmapProps {
  data: HeatmapData[];
}

const levelColors = [
  "bg-muted", // 0 - no activity
  "bg-green-200 dark:bg-green-900", // 1 - low
  "bg-green-400 dark:bg-green-700", // 2 - medium
  "bg-green-500 dark:bg-green-600", // 3 - high
  "bg-green-600 dark:bg-green-500", // 4 - very high
];

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  // Organize data into weeks (columns) and days (rows)
  // 12 weeks = 84 days, 7 days per week
  const weeks: HeatmapData[][] = [];

  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  // Pad last week if needed
  const lastWeek = weeks[weeks.length - 1];
  if (lastWeek && lastWeek.length < 7) {
    while (lastWeek.length < 7) {
      lastWeek.push({ date: "", count: 0, level: 0 });
    }
  }

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const totalActivity = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5 text-kkpsi-navy dark:text-kkpsi-navy-light" />
            Activity
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {totalActivity} activities in 12 weeks
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 pr-2">
              {dayLabels.map((day, idx) => (
                <div
                  key={day}
                  className={`h-3 text-[10px] leading-3 text-muted-foreground ${
                    idx % 2 === 1 ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {week.map((day, dayIdx) => (
                  <div
                    key={`${weekIdx}-${dayIdx}`}
                    className={`group relative h-3 w-3 rounded-sm transition-transform hover:scale-125 ${
                      day.date ? levelColors[day.level] : "bg-transparent"
                    }`}
                    title={day.date ? `${day.date}: ${day.count} activities` : ""}
                  >
                    {/* Tooltip */}
                    {day.date && (
                      <div className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md opacity-0 transition-opacity group-hover:opacity-100">
                        {new Date(day.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                        : {day.count} {day.count === 1 ? "activity" : "activities"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-end gap-1 text-xs text-muted-foreground">
          <span>Less</span>
          {levelColors.map((color, idx) => (
            <div
              key={idx}
              className={`h-3 w-3 rounded-sm ${color}`}
              title={
                idx === 0
                  ? "No activity"
                  : idx === 1
                  ? "1-2 activities"
                  : idx === 2
                  ? "3-5 activities"
                  : idx === 3
                  ? "6-9 activities"
                  : "10+ activities"
              }
            />
          ))}
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}

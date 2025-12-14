import { Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
  return (
    <Card className="border-2 border-kkpsi-gold bg-gradient-to-br from-orange-50 to-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Study Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Current Streak</p>
            <p className="text-5xl font-bold text-orange-500">{currentStreak}</p>
            <p className="text-sm text-gray-600">day{currentStreak !== 1 ? "s" : ""}</p>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">Longest Streak</p>
            <p className="text-2xl font-semibold text-gray-900">{longestStreak} days</p>
          </div>
          {currentStreak > 0 && (
            <div className="rounded-lg bg-white/60 p-3 text-center">
              <p className="text-sm text-gray-700">
                Keep it up! Study today to maintain your streak 🔥
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

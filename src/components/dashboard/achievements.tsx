"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Award, Brain, Trophy, Star, Zap, Flame, Lock } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  progress: number;
  target: number;
}

interface AchievementsProps {
  achievements: Achievement[];
  earnedCount: number;
  totalCount: number;
}

const iconMap: Record<string, React.ElementType> = {
  brain: Brain,
  trophy: Trophy,
  star: Star,
  zap: Zap,
  flame: Flame,
};

export function Achievements({
  achievements,
  earnedCount,
  totalCount,
}: AchievementsProps) {
  // Show earned achievements first, then in-progress sorted by progress
  const sortedAchievements = [...achievements].sort((a, b) => {
    if (a.earned && !b.earned) return -1;
    if (!a.earned && b.earned) return 1;
    if (!a.earned && !b.earned) {
      return b.progress / b.target - a.progress / a.target;
    }
    return 0;
  });

  // Show max 6 achievements (prioritize earned + close to earning)
  const displayAchievements = sortedAchievements.slice(0, 6);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Award className="h-5 w-5 text-kkpsi-gold" />
            Achievements
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {earnedCount}/{totalCount} unlocked
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {displayAchievements.map((achievement) => {
            const Icon = iconMap[achievement.icon] ?? Star;
            const progressPercent = (achievement.progress / achievement.target) * 100;

            return (
              <div
                key={achievement.id}
                className={`group relative flex flex-col items-center rounded-lg border p-3 text-center transition-all ${
                  achievement.earned
                    ? "border-kkpsi-gold/50 bg-gradient-to-b from-kkpsi-gold/10 to-transparent"
                    : "border-border bg-muted/30 opacity-75 hover:opacity-100"
                }`}
              >
                {/* Icon */}
                <div
                  className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
                    achievement.earned
                      ? "bg-kkpsi-gold/20"
                      : "bg-muted"
                  }`}
                >
                  {achievement.earned ? (
                    <Icon
                      className={`h-5 w-5 ${
                        achievement.icon === "flame"
                          ? "text-orange-500"
                          : achievement.icon === "zap"
                          ? "text-yellow-500"
                          : "text-kkpsi-gold"
                      }`}
                    />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                {/* Name */}
                <span
                  className={`text-xs font-medium ${
                    achievement.earned ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {achievement.name}
                </span>

                {/* Progress or earned indicator */}
                {achievement.earned ? (
                  <span className="mt-1 text-[10px] text-kkpsi-gold">Earned!</span>
                ) : (
                  <div className="mt-2 w-full">
                    <Progress value={progressPercent} className="h-1" />
                    <span className="mt-1 text-[10px] text-muted-foreground">
                      {achievement.progress}/{achievement.target}
                    </span>
                  </div>
                )}

                {/* Tooltip on hover */}
                <div className="pointer-events-none absolute -top-12 left-1/2 z-10 w-32 -translate-x-1/2 rounded-lg bg-popover p-2 text-xs shadow-lg opacity-0 transition-opacity group-hover:opacity-100">
                  {achievement.description}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AnimatedCounter } from "./animated-counter";
import { Star, Brain, Trophy, Calendar } from "lucide-react";

const iconMap = {
  star: Star,
  brain: Brain,
  trophy: Trophy,
  calendar: Calendar,
} as const;

type IconName = keyof typeof iconMap;

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconName;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "default" | "gold" | "green" | "orange";
}

const colorStyles = {
  default: {
    iconBg: "bg-kkpsi-navy/10 dark:bg-kkpsi-navy-light/20",
    iconColor: "text-kkpsi-navy dark:text-kkpsi-navy-light",
    valueColor: "text-kkpsi-navy dark:text-kkpsi-navy-light",
  },
  gold: {
    iconBg: "bg-kkpsi-gold/20",
    iconColor: "text-kkpsi-gold",
    valueColor: "text-kkpsi-gold",
  },
  green: {
    iconBg: "bg-green-500/10 dark:bg-green-500/20",
    iconColor: "text-green-600 dark:text-green-400",
    valueColor: "text-green-600 dark:text-green-400",
  },
  orange: {
    iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    valueColor: "text-orange-600 dark:text-orange-400",
  },
};

export function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  color = "default",
}: StatsCardProps) {
  const styles = colorStyles[color];
  const Icon = iconMap[icon];

  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-md">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/30" />

      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${styles.iconBg}`}>
          <Icon className={`h-4 w-4 ${styles.iconColor}`} />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className={`text-2xl font-bold ${styles.valueColor}`}>
          <AnimatedCounter value={value} />
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div
            className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              trend.isPositive
                ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
            }`}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}% from last week
          </div>
        )}
      </CardContent>
    </Card>
  );
}

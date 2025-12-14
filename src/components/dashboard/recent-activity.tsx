import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Trophy, Brain } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  type: "quiz" | "flashcard";
  topic: string;
  score?: number;
  timestamp: Date;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground py-8">
            No activity yet. Start studying to see your progress here!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                activity.type === "quiz" ? "bg-kkpsi-gold/20" : "bg-kkpsi-navy/10"
              }`}>
                {activity.type === "quiz" ? (
                  <Trophy className="h-5 w-5 text-kkpsi-navy dark:text-kkpsi-navy-light" />
                ) : (
                  <Brain className="h-5 w-5 text-kkpsi-navy dark:text-kkpsi-navy-light" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {activity.type === "quiz" ? "Completed Quiz" : "Studied Flashcards"}
                </p>
                <p className="text-sm text-muted-foreground">{activity.topic}</p>
              </div>
              <div className="text-right">
                {activity.score !== undefined && (
                  <Badge
                    variant={activity.score >= 80 ? "default" : "secondary"}
                    className={activity.score >= 80 ? "bg-green-500" : ""}
                  >
                    {activity.score}%
                  </Badge>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

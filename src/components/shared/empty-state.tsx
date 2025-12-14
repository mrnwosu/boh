import { Button } from "~/components/ui/button";
import type { LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  /** Icon to display */
  icon?: LucideIcon;
  /** Main message */
  title?: string;
  /** Secondary description */
  description?: string;
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "ghost";
  };
  /** Additional class names */
  className?: string;
}

/**
 * Reusable empty state component for when no data is available
 * Used in flashcards, chapters, activity lists, etc.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`py-12 text-center ${className}`}>
      {Icon && (
        <Icon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
      )}

      {title && (
        <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      )}

      {description && (
        <p className="mb-4 text-muted-foreground">{description}</p>
      )}

      {action && (
        <Button
          variant={action.variant ?? "outline"}
          onClick={action.onClick}
          className="mt-4"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

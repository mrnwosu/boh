"use client";

import { ChevronDown, X, Filter } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export interface TagSelectorProps {
  /** All available tags */
  availableTags: string[];
  /** Currently selected tags */
  selectedTags: string[];
  /** Callback when a tag is toggled */
  onTagToggle: (tag: string) => void;
  /** Callback to clear all tags */
  onClearAll: () => void;
  /** Display variant */
  variant?: "dropdown" | "inline";
  /** Label for the filter button */
  label?: string;
  /** Whether to show selected tags as removable badges */
  showSelectedBadges?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * Reusable tag selector component
 * Supports dropdown (default) or inline badge display
 */
export function TagSelector({
  availableTags,
  selectedTags,
  onTagToggle,
  onClearAll,
  variant = "dropdown",
  label = "Filter by Tags",
  showSelectedBadges = true,
  className = "",
}: TagSelectorProps) {
  if (variant === "inline") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {availableTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className={`cursor-pointer transition-colors ${
              selectedTags.includes(tag)
                ? "bg-kkpsi-navy hover:bg-kkpsi-navy-light"
                : "hover:bg-muted"
            }`}
            onClick={() => onTagToggle(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            {label}
            {selectedTags.length > 0 && (
              <Badge className="ml-1 bg-kkpsi-navy px-1.5 py-0.5 text-xs">
                {selectedTags.length}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Select Tags</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availableTags.map((tag) => (
            <DropdownMenuCheckboxItem
              key={tag}
              checked={selectedTags.includes(tag)}
              onCheckedChange={() => onTagToggle(tag)}
            >
              {tag}
            </DropdownMenuCheckboxItem>
          ))}
          {selectedTags.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center text-xs text-muted-foreground"
                onClick={onClearAll}
              >
                Clear All
              </Button>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Selected tags as removable badges */}
      {showSelectedBadges &&
        selectedTags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="gap-1 bg-kkpsi-navy/10 pr-1 text-kkpsi-navy dark:text-kkpsi-navy-light hover:bg-kkpsi-navy/20"
          >
            {tag}
            <button
              onClick={() => onTagToggle(tag)}
              className="ml-1 rounded-full p-0.5 hover:bg-kkpsi-navy/20"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FileText,
  GraduationCap,
  Users,
  Award,
  Building2,
  Home,
  LayoutDashboard,
  HelpCircle,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { type SearchResult } from "~/server/api/routers/search";

// Icon mapping for different result types
const getResultIcon = (type: SearchResult["type"]) => {
  switch (type) {
    case "page":
      return FileText;
    case "topic":
      return GraduationCap;
    case "flashcard":
      return HelpCircle;
    case "chapter":
      return Building2;
    case "founder":
      return Users;
    case "award":
      return Award;
    case "president":
      return Users;
    default:
      return FileText;
  }
};

// Get specific icon for known pages
const getPageIcon = (href: string) => {
  if (href === "/") return Home;
  if (href === "/dashboard") return LayoutDashboard;
  if (href.includes("flashcard")) return GraduationCap;
  if (href.includes("quiz")) return HelpCircle;
  if (href.includes("chapter")) return Building2;
  if (href.includes("founder")) return Users;
  if (href.includes("award")) return Award;
  return FileText;
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Debounced search query
  const { data: searchResults, isLoading } = api.search.search.useQuery(
    { query, limit: 20 },
    {
      enabled: query.length >= 1,
      staleTime: 1000 * 60, // Cache for 1 minute
    },
  );

  // Quick access data (shown when no search query)
  const { data: quickAccess } = api.search.getQuickAccess.useQuery(undefined, {
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Handle result selection
  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router],
  );

  // Group results by category
  const groupedResults = searchResults?.reduce(
    (acc, result) => {
      const category = result.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(result);
      return acc;
    },
    {} as Record<string, SearchResult[]>,
  );

  return (
    <>
      {/* Search trigger button */}
      <Button
        variant="ghost"
        className="relative h-9 w-9 p-0 text-white hover:bg-white/10 hover:text-white md:h-9 md:w-auto md:px-3 md:py-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 md:mr-2" />
        <span className="hidden md:inline-flex">Search</span>
        <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[10px] font-medium text-white/70 md:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Search dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search pages, flashcards, chapters..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {/* Loading state */}
          {isLoading && query.length >= 1 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          )}

          {/* Empty state */}
          {query.length >= 1 && !isLoading && searchResults?.length === 0 && (
            <CommandEmpty>No results found for "{query}"</CommandEmpty>
          )}

          {/* Search results */}
          {query.length >= 1 &&
            groupedResults &&
            Object.entries(groupedResults).map(([category, results]) => (
              <CommandGroup key={category} heading={category}>
                {results.map((result) => {
                  const Icon =
                    result.type === "page"
                      ? getPageIcon(result.href)
                      : getResultIcon(result.type);
                  return (
                    <CommandItem
                      key={result.id}
                      value={`${result.title} ${result.description ?? ""}`}
                      onSelect={() => handleSelect(result.href)}
                      className="cursor-pointer"
                    >
                      <Icon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="truncate font-medium">
                          {result.title}
                        </span>
                        {result.description && (
                          <span className="truncate text-xs text-muted-foreground">
                            {result.description}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}

          {/* Quick access (when no query) */}
          {query.length === 0 && quickAccess && (
            <>
              <CommandGroup heading="Quick Access">
                {quickAccess.pages.map((page) => {
                  const Icon = getPageIcon(page.href);
                  return (
                    <CommandItem
                      key={page.id}
                      value={page.title}
                      onSelect={() => handleSelect(page.href)}
                      className="cursor-pointer"
                    >
                      <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{page.title}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Study Topics">
                {quickAccess.topics.map((topic) => (
                  <CommandItem
                    key={topic.id}
                    value={topic.title}
                    onSelect={() => handleSelect(topic.href)}
                    className="cursor-pointer"
                  >
                    <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span>{topic.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {topic.description}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

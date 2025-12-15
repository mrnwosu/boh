"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Calendar, Briefcase, GraduationCap, Award, Heart, Flag, Music } from "lucide-react";
import { cn } from "~/lib/utils";

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category?: "personal" | "career" | "education" | "honor" | "kkpsi" | "milestone";
}

export interface TimelineEra {
  title: string;
  dateRange: string;
  events: TimelineEvent[];
}

interface InteractiveTimelineProps {
  eras: TimelineEra[];
  className?: string;
}

const categoryIcons: Record<string, typeof Calendar> = {
  personal: Heart,
  career: Briefcase,
  education: GraduationCap,
  honor: Award,
  kkpsi: Music,
  milestone: Flag,
  default: Calendar,
};

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  personal: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-500" },
  career: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-500" },
  education: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-500" },
  honor: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-500" },
  kkpsi: { bg: "bg-kkpsi-navy/10", border: "border-kkpsi-navy/30", text: "text-kkpsi-navy dark:text-kkpsi-gold" },
  milestone: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-500" },
  default: { bg: "bg-muted", border: "border-border", text: "text-muted-foreground" },
};

function TimelineEventCard({
  event,
  isActive,
  onClick
}: {
  event: TimelineEvent;
  isActive: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const category = event.category ?? "default";
  const Icon = categoryIcons[category] ?? Calendar;
  const colors = categoryColors[category] ?? categoryColors.default!;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2, rootMargin: "-50px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "relative pl-6 sm:pl-8 pb-6 sm:pb-8 transition-all duration-500",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      )}
    >
      {/* Timeline line */}
      <div className="absolute left-[9px] sm:left-[11px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-border to-transparent" />

      {/* Timeline dot */}
      <div
        className={cn(
          "absolute left-0 top-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
          isActive
            ? "bg-kkpsi-gold border-kkpsi-gold scale-110 shadow-lg shadow-kkpsi-gold/30"
            : `${colors.bg} ${colors.border}`
        )}
      >
        <Icon className={cn("w-2.5 h-2.5 sm:w-3 sm:h-3", isActive ? "text-kkpsi-navy" : colors.text)} />
      </div>

      {/* Event card */}
      <button
        onClick={onClick}
        className={cn(
          "w-full text-left rounded-lg sm:rounded-xl border transition-all duration-300",
          "active:scale-[0.99] sm:hover:shadow-md sm:hover:-translate-y-0.5",
          isActive
            ? "bg-card border-kkpsi-gold/50 shadow-lg ring-1 ring-kkpsi-gold/20"
            : "bg-card border-border sm:hover:border-border/80"
        )}
      >
        <div className="p-3 sm:p-4">
          {/* Date badge */}
          <div className="flex items-center justify-between mb-2 gap-2">
            <span className={cn(
              "inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium",
              colors.bg,
              colors.text
            )}>
              <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="truncate max-w-[120px] sm:max-w-none">{event.date}</span>
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-300",
                isActive && "rotate-180"
              )}
            />
          </div>

          {/* Title */}
          <h4 className={cn(
            "text-sm sm:text-base font-semibold transition-colors leading-snug",
            isActive ? "text-kkpsi-navy dark:text-kkpsi-gold" : "text-foreground"
          )}>
            {event.title}
          </h4>

          {/* Expandable description */}
          <div
            className={cn(
              "grid transition-all duration-300 ease-out",
              isActive ? "grid-rows-[1fr] opacity-100 mt-2 sm:mt-3" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

function TimelineEraSection({
  era,
  activeEventId,
  onEventClick,
  eraIndex
}: {
  era: TimelineEra;
  activeEventId: string | null;
  onEventClick: (id: string) => void;
  eraIndex: number;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "mb-8 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${eraIndex * 100}ms` }}
    >
      {/* Era header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 group"
      >
        <div className="flex-1 flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="w-3 h-3 shrink-0 rounded-full bg-gradient-to-br from-kkpsi-gold to-amber-500 shadow-lg shadow-kkpsi-gold/30" />
          <h3 className="font-serif text-base sm:text-xl font-bold text-foreground group-hover:text-kkpsi-navy dark:group-hover:text-kkpsi-gold transition-colors">
            {era.title}
          </h3>
          {era.dateRange && (
            <span className="text-xs sm:text-sm text-muted-foreground">
              {era.dateRange}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-300",
            isCollapsed && "-rotate-90"
          )}
        />
      </button>

      {/* Events */}
      <div
        className={cn(
          "ml-1 grid transition-all duration-500 ease-out",
          isCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
        )}
      >
        <div className="overflow-hidden">
          {era.events.map((event) => (
            <TimelineEventCard
              key={event.id}
              event={event}
              isActive={activeEventId === event.id}
              onClick={() => onEventClick(event.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function InteractiveTimeline({ eras, className }: InteractiveTimelineProps) {
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  const handleEventClick = (id: string) => {
    setActiveEventId(activeEventId === id ? null : id);
  };

  // Calculate total events for the summary
  const totalEvents = eras.reduce((acc, era) => acc + era.events.length, 0);

  return (
    <div className={cn("relative", className)}>
      {/* Timeline header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-kkpsi-gold/20 to-amber-500/20">
            <Calendar className="w-5 h-5 text-kkpsi-gold" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Timeline</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {totalEvents} events across {eras.length} {eras.length === 1 ? "era" : "eras"}
            </p>
          </div>
        </div>

        {/* Category legend - scrollable on mobile */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {Object.entries(categoryColors).slice(0, -1).map(([key, colors]) => {
            const Icon = categoryIcons[key] ?? Calendar;
            return (
              <div key={key} className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <div className={cn("p-1 rounded", colors.bg)}>
                  <Icon className={cn("w-3 h-3", colors.text)} />
                </div>
                <span className="text-muted-foreground capitalize hidden xs:inline sm:inline">{key}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Era sections */}
      {eras.map((era, index) => (
        <TimelineEraSection
          key={era.title}
          era={era}
          activeEventId={activeEventId}
          onEventClick={handleEventClick}
          eraIndex={index}
        />
      ))}
    </div>
  );
}

"use client";

import { useScrollAnimationGroup } from "~/hooks/use-scroll-animation";
import { cn } from "~/lib/utils";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div";
}

/**
 * A section that animates its children when scrolled into view
 * Children should have "animate-on-scroll" class and optional "stagger-N" classes
 */
export function AnimatedSection({
  children,
  className,
  as: Component = "div",
}: AnimatedSectionProps) {
  const ref = useScrollAnimationGroup<HTMLDivElement>();

  return (
    <Component ref={ref} className={cn(className)}>
      {children}
    </Component>
  );
}

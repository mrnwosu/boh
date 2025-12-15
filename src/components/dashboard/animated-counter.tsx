"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number | string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 1000,
  className = "",
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);
  const hasAnimated = useRef(false);

  // Parse the numeric value
  const numericValue = typeof value === "string" ? parseFloat(value) || 0 : value;
  const suffix = typeof value === "string" ? value.replace(/[0-9.-]/g, "") : "";

  useEffect(() => {
    // Only animate once on initial load
    if (hasAnimated.current) {
      setDisplayValue(numericValue);
      return;
    }

    hasAnimated.current = true;
    const startValue = previousValue.current;
    const endValue = numericValue;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const current = startValue + (endValue - startValue) * easeOut;
      setDisplayValue(Math.round(current));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        previousValue.current = endValue;
      }
    };

    requestAnimationFrame(animate);
  }, [numericValue, duration]);

  return (
    <span className={className}>
      {displayValue}
      {suffix}
    </span>
  );
}

"use client";

import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function FlashcardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Progress Bar Skeleton */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-2 w-full" />
      </div>

      {/* Flashcard Skeleton */}
      <div className="h-[400px] w-full">
        <Card className="relative flex h-full items-center justify-center overflow-hidden rounded-2xl border-0 bg-card p-8 shadow-2xl shadow-kkpsi-navy/10">
          {/* Decorative corner accents */}
          <div className="absolute left-0 top-0 h-24 w-24 bg-gradient-to-br from-kkpsi-navy/5 to-transparent"></div>
          <div className="absolute bottom-0 right-0 h-24 w-24 bg-gradient-to-tl from-kkpsi-gold/10 to-transparent"></div>

          {/* Top accent bar */}
          <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-kkpsi-navy via-kkpsi-navy-light to-kkpsi-navy"></div>

          <div className="relative flex flex-col items-center text-center">
            {/* Question pill skeleton */}
            <Skeleton className="mb-6 h-7 w-24 rounded-full" />

            {/* Question text skeleton - multiple lines */}
            <div className="space-y-3">
              <Skeleton className="mx-auto h-8 w-80" />
              <Skeleton className="mx-auto h-8 w-64" />
            </div>

            {/* Flip hint skeleton */}
            <div className="mt-10 flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Controls Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-28 rounded-md" />
        <Skeleton className="h-10 w-20 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>

      {/* Guest Notice Skeleton */}
      <Skeleton className="h-16 w-full rounded-lg" />
    </div>
  );
}

export function TagFilterSkeleton() {
  const widths = [70, 85, 65, 90, 75, 80, 70, 85];
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Skeleton className="h-10 w-40 rounded-md" />
      {widths.slice(0, 3).map((width, i) => (
        <Skeleton
          key={i}
          className="h-7 rounded-full"
          style={{ width: `${width}px` }}
        />
      ))}
    </div>
  );
}

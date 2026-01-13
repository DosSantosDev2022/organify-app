"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="rounded-xl shadow-sm border-l-4 border-l-muted">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
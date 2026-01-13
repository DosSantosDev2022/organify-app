"use client";

import { LayoutDashboard } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <LayoutDashboard className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <p className="text-muted-foreground">
        Acompanhe o seu desempenho financeiro e a evolução do seu património.
      </p>
    </div>
  );
}
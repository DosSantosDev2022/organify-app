"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { XCircle } from "lucide-react";

interface DashboardFilterProps {
  selectedMonth: number | null;
  selectedYear: number;
  onMonthChange: (month: number | null) => void;
  onYearChange: (year: string) => void;
}

export function DashboardFilter({ selectedMonth, selectedYear, onMonthChange, onYearChange }: DashboardFilterProps) {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 bg-card p-4 rounded-2xl border shadow-sm">
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Select value={selectedYear.toString()} onValueChange={onYearChange}>
          <SelectTrigger className="rounded-xl font-bold w-[110px]">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}
          </SelectContent>
        </Select>

        <Button
          variant={selectedMonth === null ? "default" : "outline"}
          size="sm"
          onClick={() => onMonthChange(null)}
          className="rounded-xl gap-2"
        >
          {selectedMonth === null ? "Visão Geral" : "Limpar"}
          {selectedMonth !== null && <XCircle className="h-4 w-4" />}
        </Button>
      </div>

      <div className="h-8 w-px bg-border hidden md:block" />

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-2 p-1">
          {months.map((month, index) => (
            <Button
              key={month}
              variant={selectedMonth === index ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onMonthChange(index)}
              className={`rounded-xl px-4 ${selectedMonth === index ? "bg-primary text-primary-foreground" : ""}`}
            >
              {month}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
}
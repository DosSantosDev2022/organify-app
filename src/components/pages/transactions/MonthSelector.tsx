// components/MonthSelector.tsx
"use client";

import { Button } from "@/components/ui/button";
import { format, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthSelectorProps {
  selectedMonth: Date;
  onMonthChange: (newMonth: Date) => void;
}

export function MonthSelector({
  selectedMonth,
  onMonthChange,
}: MonthSelectorProps) {
  const handlePrevMonth = () => {
    onMonthChange(subMonths(selectedMonth, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(selectedMonth, 1));
  };

  // Formata a data. Ex: "novembro de 2025"
  const formattedMonth = format(selectedMonth, "LLLL 'de' yyyy", {
    locale: ptBR,
  });

  return (
    <div className="flex items-center justify-end gap-4 mb-8">
      <Button variant="outline" size="icon" onClick={handlePrevMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-lg font-semibold capitalize w-48 text-center">
        {formattedMonth}
      </span>
      <Button variant="outline" size="icon" onClick={handleNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
"use client";

// Componentes de UI e Layout
import { DashboardFilter, DashboardHeader, StatsCards, StatsCardsSkeleton } from "@/components/pages/dashboard";

// Hooks de Dados
import { useGetSummary } from "@/hooks/transactions/use-get-summary";
import { useState } from "react";

export default function DashboardPage() {
  // 1. Estados de Filtro (Mês e Ano)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // 2. Data de referência para os Hooks
  // Se selectedMonth for null (Visão Geral), usamos o dia 1 de janeiro como âncora
  const currentDate = new Date(selectedYear, selectedMonth ?? 0, 1);


  const {
    isLoading: isLoadingSummary
  } = useGetSummary(currentDate);

  // Funções de manipulação de filtros
  const handleMonthChange = (month: number | null) => setSelectedMonth(month);
  // biome-ignore lint/correctness/useParseIntRadix: <explanation>
  const handleYearChange = (year: string) => setSelectedYear(parseInt(year));

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">

      {/* Cabeçalho do App */}
      <DashboardHeader />

      {/* Componente de Filtro (Mês/Ano) */}
      <DashboardFilter
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
      />

      {/* Seção de Cards: Receitas, Fixas, Variáveis, Acumulado e Investimento */}
      {isLoadingSummary ? (
        <StatsCardsSkeleton />
      ) : (
        <StatsCards
          selectedMonth={currentDate}
          isFiltered={selectedMonth !== null}
        />
      )}
    </div>
  );
}
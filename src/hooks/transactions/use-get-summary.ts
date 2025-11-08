// hooks/use-get-summary.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getSummaryTotals } from "@/app/actions/transaction.actions";

export function useGetSummary(
  selectedDate: Date // <-- NOVO PARÂMETRO
) {
  const {
    data: summary,
    isLoading,
    isError,
    error,
  } = useQuery({
    // ATUALIZAÇÃO DA KEY: Inclui a data
    queryKey: ["summaryTotals", selectedDate.toISOString()],

    // ATUALIZAÇÃO DA FUNÇÃO: Passa a data
    queryFn: async () => {
      const result = await getSummaryTotals(selectedDate);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch summary.");
      }
      return result.data;
    },
  });

  return { summary, isLoading, isError, error };
}
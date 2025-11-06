// hooks/use-get-running-balance.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getRunningBalance } from "@/app/actions/transaction.actions";

export function useGetRunningBalance(selectedDate: Date) {
  const {
    data: balance,
    isLoading,
    isError,
    error,
  } = useQuery({
    // 1. Chave da Query: [nome, data]
    queryKey: ["runningBalance", selectedDate.toISOString()],

    // 2. Função da Query: Chama a nossa nova action
    queryFn: async () => {
      const result = await getRunningBalance(selectedDate);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch running balance.");
      }
      return result.data; // Retorna o número do saldo (ex: 1234.50)
    },
  });

  return { balance, isLoading, isError, error };
}
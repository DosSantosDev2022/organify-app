// hooks/use-get-running-balance.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getRunningBalance } from "@/app/actions/transaction.actions";

// Defina a tipagem esperada para o novo objeto de dados
interface RunningBalanceData {
    runningBalance: number; // O saldo acumulado principal (Fluxo de Caixa)
    investmentTotal: number; // O total acumulado de investimentos
}

export function useGetRunningBalance(selectedDate: Date) {
  const {
    data, 
    isLoading,
    isError,
    error,
  } = useQuery<RunningBalanceData>({
    queryKey: ["runningBalance", selectedDate.toISOString()],

    queryFn: async () => {
      const result = await getRunningBalance(selectedDate);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch running balance.");
      }
      
      if (typeof result.data === 'object' && result.data !== null && 'runningBalance' in result.data) {
          return result.data as RunningBalanceData; 
      }
      
      throw new Error("Invalid data structure returned from running balance action.");
    },
  });

  // Retorna o objeto de dados completo (data) e os estados
  return { data, isLoading, isError, error };
}
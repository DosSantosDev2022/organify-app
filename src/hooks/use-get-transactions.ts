// hooks/use-get-transactions.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/app/actions/transaction.actions";
import { TransactionType } from "@prisma/client";

export function useGetTransactions(
  type: TransactionType,
  selectedDate: Date // <-- NOVO PARÂMETRO
) {
  const {
    data: transactions,
    isLoading,
    isError,
    error,
  } = useQuery({
    // ATUALIZAÇÃO DA KEY: Inclui a data
    queryKey: ["transactions", type, selectedDate.toISOString()],

    // ATUALIZAÇÃO DA FUNÇÃO: Passa a data
    queryFn: async () => {
      const result = await getTransactions(type, selectedDate);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch data.");
      }
      return result.data;
    },
  });

  return { transactions, isLoading, isError, error };
}
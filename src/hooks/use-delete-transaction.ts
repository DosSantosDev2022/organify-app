// hooks/use-delete-transaction.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTransaction } from "@/app/actions/transaction.actions";
import { toast } from "sonner";

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  const { mutate: remove, isPending } = useMutation({
    mutationFn: (id: string) => deleteTransaction(id),

    // 2. Adicionar lógica de 'onSuccess' e 'onError'
    onSuccess: async (result) => {
      if (result.success) {
        toast.success("Transação excluída com sucesso!");
        await queryClient.invalidateQueries({ queryKey: ["transactions"] });
        await queryClient.invalidateQueries({ queryKey: ["summaryTotals"] });
        await queryClient.invalidateQueries({ queryKey: ["runningBalance"] });
      } else {
        toast.error(result.error || "Erro ao excluir transação.");
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Ocorreu um erro inesperado. Tente novamente.");
    },
  });

  return { remove, isPending };
}
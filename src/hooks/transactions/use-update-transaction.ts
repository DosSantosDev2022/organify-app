// hooks/use-update-transaction.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTransaction } from "@/app/actions/transaction.actions";
import { TransactionSchema } from "@/schemas/validations";
import { toast } from "sonner"; // <-- 1. Importar

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  const { mutateAsync: update, isPending } = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TransactionSchema;
    }) => updateTransaction(id, data),

    // 2. Adicionar lógica de 'onSuccess' e 'onError'
    onSuccess: async (result) => {
      if (result.success) {
        toast.success("Transação atualizada com sucesso!");
        await queryClient.invalidateQueries({ queryKey: ["transactions"] });
        await queryClient.invalidateQueries({ queryKey: ["summaryTotals"] });
        await queryClient.invalidateQueries({ queryKey: ["runningBalance"] });
      } else {
        toast.error("Erro ao atualizar transação.");
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Ocorreu um erro inesperado. Tente novamente.");
    },
  });

  return { update, isPending };
}
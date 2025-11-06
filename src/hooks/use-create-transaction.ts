// hooks/use-create-transaction.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "@/app/actions/transaction.actions";
import { TransactionSchema } from "@/schemas/validations";
import { toast } from "sonner"; // <-- Importar o toast

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  const { mutate: create, isPending } = useMutation({
    mutationFn: (data: TransactionSchema) => createTransaction(data),

    // 'onSuccess' é chamado quando a Server Action retorna
    onSuccess: async (result) => {
      if (result.success) {
        // 1. Toast de Sucesso
        toast.success("Transação criada com sucesso!");

        // 2. Invalida os caches (como fazíamos antes)
        await queryClient.invalidateQueries({ queryKey: ["transactions"] });
        await queryClient.invalidateQueries({ queryKey: ["summaryTotals"] });
        await queryClient.invalidateQueries({ queryKey: ["runningBalance"] });
      } else {
        // 3. Toast de Erro (vindo da validação do servidor)
        toast.error("Erro ao criar transação.");
      }
    },
    // 'onError' é chamado se a Server Action falhar (ex: rede)
    onError: (error) => {
      console.error(error);
      // 4. Toast de Erro Genérico
      toast.error("Ocorreu um erro inesperado. Tente novamente.");
    },
  });

  return { create, isPending };
}
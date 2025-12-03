// src/hooks/debtis/use-delete-debt.ts
'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteDebt } from "@/app/actions/debt-actions";

/**
 * @function useDeleteDebt
 * @description Custom Hook que gerencia a mutação de exclusão de uma dívida.
 * Utiliza `useMutation` do TanStack Query para executar a Server Action `deleteDebt`,
 * gerenciar o estado de carregamento e atualizar o cache após o sucesso.
 * @returns {{deleteDebt: (debtId: string, options?: any) => void, isDeleting: boolean}}
 * Retorna a função de exclusão (mutator) e o estado de carregamento.
 */
export function useDeleteDebt() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    // Função que chama a Server Action de exclusão
    mutationFn: (debtId: string) => deleteDebt(debtId),
    
    onSuccess: () => {
      toast.success('Dívida excluída com sucesso.');
      // Invalida as queries de lista e resumo para forçar a busca de dados atualizados
      queryClient.invalidateQueries({ queryKey: ['debtsList'] });
      queryClient.invalidateQueries({ queryKey: ['debtsSummary'] });
      // Nota: Queries de detalhes (ex: ['debtDetails', id]) também devem ser invalidadas/removidas, se existirem.
    },
    
    onError: (error) => {
      console.error('Erro ao excluir dívida:', error);
      toast.error('Falha ao excluir a dívida. Tente novamente.');
    },
  });

  // Retorna a função mutator renomeada e o estado de carregamento
  return { deleteDebt: mutate, isDeleting: isPending };
}
// src/hooks/debtis/use-delete-payment.ts
'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deletePayment } from "@/app/actions/debt-actions";

/**
 * @function useDeletePayment
 * @description Custom Hook que gerencia a mutação de exclusão de um pagamento individual.
 * Utiliza `useMutation` do TanStack Query para executar a Server Action `deletePayment`,
 * gerenciar o estado de carregamento e atualizar o cache, garantindo que o saldo
 * da dívida principal seja recalculado automaticamente.
 * @returns {{deletePayment: (paymentId: string, options?: any) => void, isDeleting: boolean}}
 * Retorna a função de exclusão (mutator) e o estado de carregamento.
 */
export function useDeletePayment() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    // Função que chama a Server Action de exclusão
    mutationFn: (paymentId: string) => deletePayment(paymentId),

    onSuccess: () => {
      toast.success('Pagamento excluído e dívida reavaliada.');
      // Invalida as queries de lista (que inclui os pagamentos) e resumo
      // para forçar a busca de dados atualizados e recalcular o saldo.
      queryClient.invalidateQueries({ queryKey: ['debtsList'] });
      queryClient.invalidateQueries({ queryKey: ['debtsSummary'] });
      // Nota: Queries específicas de detalhe de dívida também seriam invalidadas aqui, se existirem.
    },
    
    onError: (error) => {
      console.error('Erro ao excluir pagamento:', error);
      toast.error('Falha ao excluir o pagamento. Tente novamente.');
    },
  });

  // Retorna a função mutator renomeada e o estado de carregamento
  return { deletePayment: mutate, isDeleting: isPending };
}
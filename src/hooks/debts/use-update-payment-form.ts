'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updatePayment } from '@/app/actions/debt-actions';
// Assumindo que paymentFormSchema está exportado corretamente:
import { paymentFormSchema } from '@/components/pages/debts/AddPaymentForm'; 

// O tipo de valores do formulário de edição é o mesmo que o de criação/adição
export type UpdatePaymentFormValues = z.infer<typeof paymentFormSchema>;

// ----------------------------------------------------
// Tipos e Propriedades do Hook
// ----------------------------------------------------

interface UseUpdatePaymentFormProps {
  /** O ID do pagamento a ser editado. */
  paymentId: string; 
  /** O ID da dívida relacionada (necessário para a Server Action e revalidação do cache). */
  debtId: string; 
  /** Dados iniciais (default values) que preencherão o formulário. */
  defaultValues: UpdatePaymentFormValues;
  /** Função de callback a ser executada após o sucesso da atualização. */
  onSuccess: () => void;
}

/**
 * @function useUpdatePaymentForm
 * @description CUSTOM HOOK que gerencia o formulário de edição de um pagamento existente.
 * Integra `react-hook-form` com validação Zod e `useMutation` do TanStack Query
 * para submeter as alterações à Server Action `updatePayment`. A revalidação garante
 * que o saldo da dívida seja recalculado.
 * @param {UseUpdatePaymentFormProps} props - Propriedades do hook.
 * @returns {{form: any, onSubmit: (data: UpdatePaymentFormValues) => void, isPending: boolean}}
 * Retorna o objeto `form` (RHF), a função `onSubmit` e o estado `isPending`.
 */
export function useUpdatePaymentForm({ paymentId, debtId, defaultValues, onSuccess }: UseUpdatePaymentFormProps) {
  const queryClient = useQueryClient();

  // --- 1. Configuração do Form (useForm) ---
  const form = useForm<UpdatePaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    // Popula o formulário com os dados existentes
    defaultValues: defaultValues,
  });

  // --- 2. Mutation (Submissão com TanStack Query) ---
  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdatePaymentFormValues) => {
      // Criamos o objeto de submissão, incluindo os IDs e tratando os opcionais
      return updatePayment({
        id: paymentId, // ID do pagamento
        debtId: debtId, // ID da dívida relacionada
        amountPaid: data.amountPaid,
        paymentDate: data.paymentDate,
        // Tratamos undefined/null para null
        installmentNumber: data.installmentNumber ?? null,
        notes: data.notes ?? null,
      });
    },
    onSuccess: () => {
      toast.success('Pagamento atualizado com sucesso e dívida reavaliada!');
      onSuccess(); // Fecha o modal/formulário

      // Invalida as queries que precisam ser atualizadas
      queryClient.invalidateQueries({ queryKey: ['debtsList'] });
      queryClient.invalidateQueries({ queryKey: ['debtsSummary'] });
      // Invalida a query de detalhe específica, se estiver aberta
      queryClient.invalidateQueries({ queryKey: ['debt', debtId] }); 
    },
    onError: (error) => {
      console.error('Erro na mutação de edição de pagamento:', error);
      toast.error('Erro ao atualizar pagamento. Verifique o console.');
    },
  });

  // 3. Função de submissão que chama a mutação
  function handleSubmit(data: UpdatePaymentFormValues) {
    mutate(data);
  }

  // 4. Retorna as ferramentas necessárias para o componente
  return {
    form,
    onSubmit: handleSubmit,
    isPending,
  };
}
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateDebt } from '@/app/actions/debt-actions';


// ----------------------------------------------------
// 1. Definição do Schema de Edição (Zod)
// ----------------------------------------------------

/**
 * @typedef {Object} UpdateDebtFormValues
 * @property {string} description - Descrição da dívida.
 * @property {number} totalAmount - Valor total da dívida.
 * @property {number | undefined} installments - Número de parcelas (opcional).
 * @property {Date | null | undefined} dueDate - Data de vencimento (opcional).
 * @property {string | undefined} category - Categoria da dívida (opcional).
 */
export const updateDebtFormSchema = z.object({
  description: z.string().min(3, 'Mínimo de 3 caracteres.'),
  totalAmount: z
    .any()
    .refine(
      (val) => val !== undefined && val !== null && val !== "",
      "É necessário informar o valor."
    )
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), "O valor deve ser um número.")
    .refine((val) => val > 0, "O valor deve ser maior que 0."),
  installments: z
    .number()
    .int()
    .optional()
    .nullable()
    .transform(e => e === 0 ? undefined : e), // Garante que 0 é tratado como undefined
  dueDate: z.date().nullable().optional(),
  category: z.string().optional(),
});

export type UpdateDebtFormValues = z.infer<typeof updateDebtFormSchema>;


// ----------------------------------------------------
// 2. Tipos e Propriedades do Hook
// ----------------------------------------------------

interface UseUpdateDebtFormProps {
  /** O ID da dívida a ser atualizada, essencial para a mutação. */
  debtId: string;
  /** Dados iniciais (default values) que preencherão o formulário. */
  defaultValues: UpdateDebtFormValues;
  /** Função de callback a ser executada após o sucesso da atualização. */
  onSuccess: () => void;
}

/**
 * @function useUpdateDebtForm
 * @description CUSTOM HOOK que gerencia o formulário de edição de uma dívida existente.
 * Ele integra `react-hook-form` com validação Zod e `useMutation` do TanStack Query
 * para submeter as alterações à Server Action `updateDebt`.
 * @param {UseUpdateDebtFormProps} props - Propriedades do hook.
 * @returns {{form: any, onSubmit: (data: UpdateDebtFormValues) => void, isPending: boolean}}
 * Retorna o objeto `form` (RHF), a função `onSubmit` e o estado `isPending`.
 */
export function useUpdateDebtForm({ debtId, defaultValues, onSuccess }: UseUpdateDebtFormProps) {
  const queryClient = useQueryClient();

  // --- 3. Configuração do Form (useForm) ---
  const form = useForm({
    resolver: zodResolver(updateDebtFormSchema),
    // Popula o formulário com os dados existentes
    defaultValues: defaultValues,
  });

  // --- 4. Mutation (Submissão com TanStack Query) ---
  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateDebtFormValues) => {
      // Criamos o objeto de submissão, incluindo o ID e tratando os opcionais
      return updateDebt({
        id: debtId, // ID da dívida é obrigatório na Server Action de edição
        description: data.description,
        totalAmount: data.totalAmount,
        // Tratamos undefined/null do formulário para o tipo aceito na Server Action
        installments: data.installments ?? null,
        dueDate: data.dueDate ?? null,
        category: data.category ?? null,
      });
    },
    onSuccess: () => {
      toast.success('Dívida atualizada com sucesso!');
      onSuccess(); // Fecha o modal/formulário

      // Invalida as queries para buscar os dados atualizados
      queryClient.invalidateQueries({ queryKey: ['debtsList'] });
      queryClient.invalidateQueries({ queryKey: ['debtsSummary'] });
      // Query de detalhe específica (se o componente de edição foi aberto a partir de uma página de detalhes)
      queryClient.invalidateQueries({ queryKey: ['debt', debtId] }); 
    },
    onError: (error) => {
      console.error('Erro na mutação de edição:', error);
      toast.error('Erro ao atualizar dívida. Verifique o console.');
    },
  });

  // 5. Função de submissão que chama a mutação
  function handleSubmit(data: UpdateDebtFormValues) {
    mutate(data);
  }

  // 6. Retorna as ferramentas necessárias para o componente
  return {
    form,
    onSubmit: handleSubmit,
    isPending,
  };
}
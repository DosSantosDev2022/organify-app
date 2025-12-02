'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createDebt } from '@/app/actions/debt-actions'; // Importe sua Server Action

// Opções de categorias de dívida fixas (exportadas para o componente)
export const DEBT_CATEGORIES = [
  { value: 'Emprestimo', label: 'Empréstimo' },
  { value: 'Financiamento', label: 'Financiamento' },
  { value: 'Cartao', label: 'Cartão de Crédito' },
  { value: 'Outros', label: 'Outros' },
];


// --- 1. Definição do Schema de Validação (Zod) ---
// Exportamos para ser usado na tipagem externa, se necessário
export const debtFormSchema = z.object({
  description: z.string().min(3, 'Mínimo de 3 caracteres.'),
  totalAmount: z
    .any() // Usamos any() para lidar com o input de string
    .refine(
      (val) => val !== undefined && val !== null && val !== "",
      "É necessário informar o valor."
    )
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), "O valor deve ser um número.")
    .refine((val) => val > 0, "O valor deve ser maior que 0."),
  installments: z.number().int().optional().nullable().transform(e => e === 0 ? undefined : e), // Garante que 0 é tratado como undefined
  dueDate: z.date().nullable().optional(),
  category: z.string().optional(),
});

export type DebtFormValues = z.infer<typeof debtFormSchema>;


interface UseDebtFormProps {
  onSuccess: () => void;
}

/**
 * 🔑 CUSTOM HOOK: Contém toda a lógica, estado e submissão do formulário de dívidas.
 */
export function useDebtForm({ onSuccess }: UseDebtFormProps) {
  const queryClient = useQueryClient();

  // --- 2. Configuração do Form (useForm) ---
  const form = useForm({
    resolver: zodResolver(debtFormSchema),
    defaultValues: {
      description: '',
      totalAmount: 0,
      installments: undefined,
      dueDate: null,
      category: DEBT_CATEGORIES[0].value,
    },
  });

  // --- 3. Mutation (Submissão com TanStack Query) ---
  const { mutate, isPending } = useMutation({
    mutationFn: (data: DebtFormValues) => createDebt({
      // 🔑 CORREÇÃO PRINCIPAL: LISTAMOS AS PROPRIEDADES 
      // E APLICAMOS O TRATAMENTO DE NULL/UNDEFINED DIRETO NA CONSTRUÇÃO DO OBJETO
      description: data.description,
      totalAmount: data.totalAmount,
      // Tratamos undefined do formulário para null (que é aceito pelo DB)
      installments: data.installments ?? null,
      dueDate: data.dueDate ?? null,
      category: data.category ?? null,
    }),
    onSuccess: () => {
      toast.success('Dívida registrada com sucesso!');
      form.reset({
        description: '',
        totalAmount: 0,
        installments: undefined,
        dueDate: null,
        category: DEBT_CATEGORIES[0].value,
      });
      onSuccess();

      // Invalida as queries para buscar os dados atualizados
      queryClient.invalidateQueries({ queryKey: ['debtsList'] });
      queryClient.invalidateQueries({ queryKey: ['debtsSummary'] });
    },
    onError: (error) => {
      console.error('Erro na mutação:', error);
      toast.error('Erro ao registrar dívida. Verifique o console.');
    },
  });

  // 4. Retorna as ferramentas necessárias para o componente
  return {
    form,
    onSubmit: mutate, // A função de submissão do RHF irá chamar mutate
    isPending,
    DEBT_CATEGORIES,
  };
}
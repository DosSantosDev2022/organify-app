'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createDebt } from '@/app/actions/debt-actions'; // Importe sua Server Action
import { DEBT_CATEGORIES } from '@/config/debts-categories';


// --- Definição do Schema de Validação (Zod) ---

/**
 * @typedef {Object} DebtFormValues
 * @property {string} description - Descrição da dívida.
 * @property {number} totalAmount - Valor total da dívida.
 * @property {number | undefined} installments - Número de parcelas (opcional, undefined se 0 ou vazio).
 * @property {Date | null | undefined} dueDate - Data de vencimento (opcional).
 * @property {string | undefined} category - Categoria da dívida (opcional).
 */
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
  installments: z
    .number()
    .int()
    .optional()
    .nullable()
    .transform(e => e === 0 ? undefined : e), // Garante que 0 é tratado como undefined
  dueDate: z.date().nullable().optional(),
  category: z.string().optional(),
});

export type DebtFormValues = z.infer<typeof debtFormSchema>;


interface UseDebtFormProps {
  /**
   * Função de callback a ser executada após o sucesso da criação da dívida,
   * geralmente usada para fechar modais ou limpar o estado de componentes externos.
   */
  onSuccess: () => void;
}

/**
 * @function useDebtForm
 * @description CUSTOM HOOK que gerencia o formulário de criação de novas dívidas.
 * Integra `react-hook-form` para estado e validação (Zod) e `useMutation` do TanStack Query
 * para submissão assíncrona dos dados via Server Action (`createDebt`).
 * @param {UseDebtFormProps} props - Propriedades do hook.
 * @returns {{form: any, onSubmit: (data: DebtFormValues) => void, isPending: boolean, DEBT_CATEGORIES: any[]}}
 * Retorna o objeto `form` (RHF), a função `onSubmit` (mutação), o estado `isPending` e as categorias.
 */
export function useDebtForm({ onSuccess }: UseDebtFormProps) {
  const queryClient = useQueryClient();

  // --- 2. Configuração do Form (useForm) ---
  const form = useForm({
    resolver: zodResolver(debtFormSchema),
    defaultValues: {
      description: '',
      // totalAmount deve ser inicializado como um número ou string/any que será validado
      // 0 é um bom valor inicial para inputs numéricos
      totalAmount: 0, 
      installments: undefined,
      dueDate: null,
      category: DEBT_CATEGORIES[0].value,
    },
  });

  // --- 3. Mutation (Submissão com TanStack Query) ---
  const { mutate, isPending } = useMutation({
    mutationFn: (data: DebtFormValues) => createDebt({
      // 🔑 Mapeamento e Tratamento de Dados para a Server Action
      description: data.description,
      totalAmount: data.totalAmount,
      // Se o campo for undefined no formulário, enviamos null para o banco de dados
      installments: data.installments ?? null,
      dueDate: data.dueDate ?? null,
      category: data.category ?? null,
    }),
    onSuccess: () => {
      toast.success('Dívida registrada com sucesso!');
      
      // Reseta o formulário para os valores iniciais
      form.reset({
        description: '',
        totalAmount: 0,
        installments: undefined,
        dueDate: null,
        category: DEBT_CATEGORIES[0].value,
      });
      
      onSuccess();

      // Invalida as queries para buscar os dados atualizados em lista e resumo
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
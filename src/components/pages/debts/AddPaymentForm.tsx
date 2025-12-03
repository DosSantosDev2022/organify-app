'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

import { addPaymentToDebt } from '@/app/actions/debt-actions';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
  Textarea,
  Input,
  Button,
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from '@/components/ui';
import { JSX } from 'react';

// ----------------------------------------------------
// 1. Definição do Schema de Validação (Zod)
// ----------------------------------------------------

export const paymentFormSchema = z.object({
  amountPaid: z
    .any()
    .refine(
      (val) => val !== undefined && val !== null && val !== "",
      "É necessário informar o valor."
    )
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), "O valor deve ser um número.")
    .refine((val) => val > 0, "O valor deve ser maior que 0."),

  paymentDate: z.date({
    error: "A data do pagamento é obrigatória."
  }),

  installmentNumber: z.number().int().optional().nullable(),
  notes: z.string().optional().nullable(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface AddPaymentFormProps {
  debtId: string;
  onSuccess: () => void;
}

/**
 * @component
 * @description Formulário para registro de um novo pagamento em uma dívida existente.
 * Utiliza React Hook Form, Zod e TanStack Query para submissão assíncrona.
 * @param {AddPaymentFormProps} props As propriedades do componente.
 * @param {string} props.debtId O ID da dívida para a qual o pagamento será adicionado.
 * @param {() => void} props.onSuccess Função de callback executada após o sucesso da submissão (e.g., fechar modal).
 * @returns {JSX.Element} O formulário de adição de pagamento.
 */
export function AddPaymentForm({ debtId, onSuccess }: AddPaymentFormProps): JSX.Element {
  const queryClient = useQueryClient();
  const today = new Date();

  // --- 2. Configuração do Form ---
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amountPaid: 0,
      paymentDate: today,
      installmentNumber: undefined,
      notes: null,
    },
  });

  // --- 3. Mutation (Submissão) ---
  const { mutate, isPending } = useMutation({
    mutationFn: (data: PaymentFormValues) => addPaymentToDebt({
      debtId: debtId,
      amountPaid: data.amountPaid,
      paymentDate: data.paymentDate,
      installmentNumber: data.installmentNumber,
      notes: data.notes,
    }),
    onSuccess: () => {
      toast.success('Pagamento registrado com sucesso! O resumo da dívida foi atualizado.');

      // Reseta o formulário
      form.reset({
        paymentDate: new Date(),
        amountPaid: 0,
        installmentNumber: undefined,
        notes: null,
      });

      onSuccess();

      // Invalida as queries necessárias
      queryClient.invalidateQueries({ queryKey: ['debtsList'] });
      queryClient.invalidateQueries({ queryKey: ['debt', debtId] }); // Para atualizar o histórico de pagamentos e resumo na tela de detalhes
    },
    onError: (error) => {
      console.error(error);
      toast.error('Erro ao registrar pagamento. Tente novamente.');
    },
  });

  // --- 4. Função de Submissão ---
  function onSubmit(data: PaymentFormValues): void {
    mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* Valor Pago */}
        <FormField
          control={form.control}
          name="amountPaid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Pago (R$)</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-muted-foreground sm:text-sm">R$</span>
                  </span>
                  <Input
                    type="number"
                    placeholder="Ex: 150.50"
                    step="0.01"
                    {...field}
                    className="pl-10"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Data do Pagamento e Parcela */}
        <div className="grid grid-cols-2 gap-4">

          {/* Data do Pagamento */}
          <FormField
            control={form.control}
            name="paymentDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data do Pagamento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Parcela (Opcional) */}
          <FormField
            control={form.control}
            name="installmentNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nº da Parcela</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ex: 5"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : undefined;
                      field.onChange(value);
                    }}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Notas (Opcional) */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex: Pago com o 13º salário"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botão de Submissão */}
        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registrando...
            </>
          ) : (
            'Confirmar Pagamento'
          )}
        </Button>
      </form>
    </Form>
  );
}
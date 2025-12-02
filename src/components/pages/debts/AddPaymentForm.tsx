'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils"; // Assumindo sua função de utilidade (className helper)

import { addPaymentToDebt } from '@/app/actions/debt-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar'; // Importe Calendar
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // Importe Popover
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

// --- 1. Definição do Schema de Validação (Zod) ---
const paymentFormSchema = z.object({
  amountPaid: z
    .any()
    .refine(
      (val) => val !== undefined && val !== null && val !== "",
      "É necessário informar o valor."
    )
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), "O valor deve ser um número.")
    .refine((val) => val > 0, "O valor deve ser maior que 0."),
  // CORREÇÃO: Mudar para Date, pois o Calendar retorna Date
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

export function AddPaymentForm({ debtId, onSuccess }: AddPaymentFormProps) {
  const queryClient = useQueryClient();
  const today = new Date(); // Usamos objeto Date para o default value

  // --- 2. Configuração do Form ---
  const form = useForm({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amountPaid: 0,
      paymentDate: today, // Padrão agora é Date
      installmentNumber: undefined,
      notes: null, // Padrão para Textarea/opcional
    },
  });

  // --- 3. Mutation (Submissão) ---
  const { mutate, isPending } = useMutation({
    mutationFn: (data: PaymentFormValues) => addPaymentToDebt({
      debtId: debtId,
      amountPaid: data.amountPaid,
      // A data já é um objeto Date
      paymentDate: data.paymentDate,
      installmentNumber: data.installmentNumber,
      notes: data.notes,
    }),
    onSuccess: () => {
      toast.success('Pagamento registrado com sucesso! O resumo da dívida foi atualizado.');
      form.reset({
        paymentDate: new Date(), // Reseta a data para a data atual
        amountPaid: 0,
        installmentNumber: undefined,
        notes: null,
      });
      onSuccess(); // Fecha o modal
      // Invalida a query para atualizar a lista na tela principal e o histórico de pagamentos
      queryClient.invalidateQueries({ queryKey: ['debtsList'] });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Erro ao registrar pagamento. Tente novamente.');
    },
  });

  // --- 4. Função de Submissão ---
  function onSubmit(data: PaymentFormValues) {
    mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* Valor Pago - Padrão R$ do TransactionForm */}
        <FormField
          control={form.control}
          name="amountPaid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Pago (R$)</FormLabel>
              <FormControl>
                {/* Aplica a lógica de prefixo R$ */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-muted-foreground sm:text-sm">R$</span>
                  </span>
                  <Input
                    type="number"
                    placeholder="Ex: 150.50"
                    step="0.01"
                    {...field}
                    className="pl-10" // <-- Padding à esquerda

                    // Mantém as correções de tipo que fizemos
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

          {/* Data do Pagamento - Padrão Calendar do TransactionForm */}
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
                          // Formata a data com ptBR
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
                {/* Aqui, o valor deve ser controlado para aceitar string ou null */}
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
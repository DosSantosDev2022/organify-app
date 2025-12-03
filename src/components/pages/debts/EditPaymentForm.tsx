'use client';

// Importações de libs e componentes
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui';
import { useUpdatePaymentForm, UpdatePaymentFormValues } from '@/hooks/debts/use-update-payment-form';
import { JSX } from 'react';


interface EditPaymentFormProps {
  paymentId: string;
  debtId: string;
  currentValues: UpdatePaymentFormValues;
  onSuccess: () => void;
}

/**
 * @component
 * @description Formulário para edição de um pagamento existente.
 * Utiliza o hook `useUpdatePaymentForm` para gerenciar o estado, validação e a mutação de atualização.
 * @param {EditPaymentFormProps} props As propriedades do componente.
 * @param {string} props.paymentId O ID do pagamento a ser atualizado.
 * @param {string} props.debtId O ID da dívida à qual o pagamento pertence.
 * @param {UpdatePaymentFormValues} props.currentValues Os valores iniciais do pagamento.
 * @param {() => void} props.onSuccess Função de callback executada após a atualização bem-sucedida.
 * @returns {JSX.Element} O formulário de edição de pagamento.
 */
export function EditPaymentForm({ paymentId, debtId, currentValues, onSuccess }: EditPaymentFormProps): JSX.Element {
  // 1. Usa o Custom Hook, passando os IDs e os valores iniciais
  const { form, onSubmit, isPending } = useUpdatePaymentForm({
    paymentId,
    debtId,
    defaultValues: currentValues,
    onSuccess
  });

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
                    // Converte o valor para string ou vazio
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
                      // Converte para INT ou undefined
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
                  // Garante que o valor vazio seja convertido para null (ou string vazia, dependendo da necessidade do backend)
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
              Salvando Alterações...
            </>
          ) : (
            'Atualizar Pagamento'
          )}
        </Button>
      </form>
    </Form>
  );
}
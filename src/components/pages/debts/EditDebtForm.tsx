'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem, SelectTrigger,
  SelectValue,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
  Input,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui';
import { useUpdateDebtForm, UpdateDebtFormValues } from '@/hooks/debts/use-update-debt-form';
import { DEBT_CATEGORIES } from '@/config/debts-categories';
import { JSX } from 'react';

interface EditDebtFormProps {
  debtId: string;
  currentValues: UpdateDebtFormValues;
  onSuccess: () => void;
}

/**
 * @component
 * @description Formulário para edição de uma dívida existente.
 * Utiliza o hook `useUpdateDebtForm` para gerenciar o estado, validação e a mutação de atualização.
 * @param {EditDebtFormProps} props As propriedades do componente.
 * @param {string} props.debtId O ID da dívida a ser atualizada.
 * @param {UpdateDebtFormValues} props.currentValues Os valores iniciais da dívida para o formulário.
 * @param {() => void} props.onSuccess Função de callback executada após a atualização bem-sucedida.
 * @returns {JSX.Element} O formulário de edição de dívida.
 */
export function EditDebtForm({ debtId, currentValues, onSuccess }: EditDebtFormProps): JSX.Element {
  // 1. Usa o Custom Hook, passando o ID e os valores iniciais
  const { form, onSubmit, isPending } = useUpdateDebtForm({
    debtId,
    defaultValues: currentValues,
    onSuccess
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Descrição da Dívida */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Financiamento Carro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Valor Total da Dívida */}
        <FormField
          control={form.control}
          name="totalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Total (R$)</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-muted-foreground sm:text-sm">R$</span>
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    {...field}
                    className="pl-10"
                    // Nota: O campo 'value' está sendo convertido para string ou vazio para Input[type="number"]
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Número de Parcelas e Data de Vencimento */}
        <div className="grid grid-cols-2 gap-4">

          {/* Nº de Parcelas (Opcional) */}
          <FormField
            control={form.control}
            name="installments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nº de Parcelas</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ex: 36"
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

          {/* Data de Vencimento (Próxima) */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Vencimento</FormLabel>
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
                          format(field.value, "dd/MM/yyy", { locale: ptBR })
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
                      selected={field.value ?? undefined}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Categoria */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DEBT_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botão de Submissão */}
        <Button
          type="submit"
          className="w-full "
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando Alterações...
            </>
          ) : (
            'Atualizar Dívida'
          )}
        </Button>
      </form>
    </Form>
  );
}
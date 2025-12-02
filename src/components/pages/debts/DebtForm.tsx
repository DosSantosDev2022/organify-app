'use client'
import * as z from 'zod';
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useDebtForm } from '@/hooks/debtis/use-debt-form';
import { format } from 'path';
import { formatDate } from '@/utils/format-date';

// --- 1. Definição do Schema de Validação (Zod) ---
const debtFormSchema = z.object({
  description: z.string().min(3, 'Mínimo de 3 caracteres.'),
  // O totalAmount é tratado como number (float em Reais)
  totalAmount: z
    .any()
    .refine(
      (val) => val !== undefined && val !== null && val !== "",
      "É necessário informar o valor."
    )
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), "O valor deve ser um número.")
    .refine((val) => val > 0, "O valor deve ser maior que 0."),
  installments: z.number().int().optional().nullable().transform(e => e === 0 ? undefined : e),
  // A data agora pode ser um objeto Date ou null (para Popover/Calendar)
  dueDate: z.date().nullable().optional(),
  category: z.string().optional(),
});

type DebtFormValues = z.infer<typeof debtFormSchema>;

interface DebtFormProps {
  onSuccess: () => void;
}

export function DebtForm({ onSuccess }: DebtFormProps) {
  // 🔑 1. Usa o Custom Hook para obter toda a lógica
  const { form, onSubmit, isPending, DEBT_CATEGORIES } = useDebtForm({ onSuccess });

  // 🔑 2. Função de Submissão que chama o mutate via onSubmit retornado pelo hook
  function handleSubmit(data: DebtFormValues) {
    // O hook já trata dueDate para null
    onSubmit(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

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

        {/* Valor Total da Dívida - Padrão R$ do TransactionForm */}
        <FormField
          control={form.control}
          name="totalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Total (R$)</FormLabel>
              <FormControl>
                {/* Aplica a lógica de prefixo R$ */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-muted-foreground sm:text-sm">R$</span>
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    {...field}
                    className="pl-10" // Adiciona padding para o prefixo
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Número de Parcelas e Data de Vencimento */}
        <div className="grid grid-cols-2 gap-4">

          {/* Nº de Parcelas (Opção 1) */}
          <FormField
            control={form.control}
            name="installments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nº de Parcelas (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ex: 36"
                    {...field}
                    // Mantendo a correção de tipagem para INT/null
                    onChange={(e) => {
                      // biome-ignore lint/correctness/useParseIntRadix: <explanation>
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

          {/* Data de Vencimento (Próxima) - Padrão Calendar do TransactionForm */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Vencimento (Opcional)</FormLabel>
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
                          formatDate(field.value, "dd/MM/yyy")
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

        {/* Categoria - Padrão Select do TransactionForm */}
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
          className='w-full'
          type="submit"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cadastrando...
            </>
          ) : (
            'Cadastrar Dívida'
          )}
        </Button>
      </form>
    </Form>
  );
}
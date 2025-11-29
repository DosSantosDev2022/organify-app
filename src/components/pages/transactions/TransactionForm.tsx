// components/TransactionForm.tsx
"use client";
import { TransactionType, TransactionStatus } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Input,
  Calendar,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui";;
import { AlertTriangle, CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useFormTransactionController } from "@/hooks/transactions";
import { TransactionFromApi } from "./TransactionTable";
import { ptBR } from "date-fns/locale";
import { useEffect } from "react";
import { useCategories } from "@/hooks/transactions/use-categories";
import Link from "next/link";
// Prop para que o formulário possa fechar o modal
interface TransactionFormProps {
  onClose: () => void;
  initialData?: TransactionFromApi | null;
  selectedMonth: Date;
}

export function TransactionForm({ onClose, initialData, selectedMonth, }: TransactionFormProps) {
  const { form, onSubmit, isPending, serverError } = useFormTransactionController({
    initialData,
    selectedMonth,
    onClose,
  })

  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  // Verifica se o carregamento terminou e não há categorias
  const hasNoCategories = !isLoadingCategories && categories.length === 0;

  // Renderiza um aviso se não houver categorias
  if (isLoadingCategories) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <p className="text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }

  // Bloco para mostrar o aviso e impedir o formulário de quebrar
  if (hasNoCategories) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Nenhuma Categoria Encontrada !</AlertTitle>
        <AlertDescription>
          <div className="space-y-3">
            <p>
              Para cadastrar uma transação, você precisa primeiro cadastrar pelo menos uma categoria.
            </p>
            <Link href="/categories" passHref>
              <Button variant="destructive" className="w-full sm:w-auto">
                Ir para Categorias
              </Button>
            </Link>
          </div>
        </AlertDescription>
      </Alert>
    );
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Campo Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Salário" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor (R$)</FormLabel>
              <FormControl>
                {/* 1. Adiciona um 'div' relativo */}
                <div className="relative">
                  {/* 2. Adiciona o 'R$' como prefixo absoluto */}
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-muted-foreground sm:text-sm">
                      R$
                    </span>
                  </span>

                  {/* 3. Adiciona 'pl-10' ao Input */}
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

        {/* Campo Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value as string}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={TransactionType.INCOME}>
                    Receita
                  </SelectItem>
                  <SelectItem value={TransactionType.FIXED_EXPENSE}>
                    Despesa Fixa
                  </SelectItem>
                  <SelectItem value={TransactionType.VARIABLE_EXPENSE}>
                    Despesa Variável
                  </SelectItem>
                  <SelectItem value={TransactionType.INVESTMENT}>
                    Investimento
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => {
            // 🔑 Observa o tipo DENTRO da função de renderização
            const watchedType = form.watch('type') as TransactionType | '';

            // Recalcula as categorias filtradas aqui
            const watchedFilteredCategories = watchedType !== ""
              ? categories.filter(
                (category) => category.type === watchedType
              )
              : [];

            // Lógica de limpeza (portada para cá):
            // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
            // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
            useEffect(() => {
              const currentCategoryId = form.getValues('categoryId');

              const categoryExists = watchedFilteredCategories.some(
                (category) => category.id === currentCategoryId
              );

              // Limpa se a categoria for inválida para o novo tipo
              if (currentCategoryId && !categoryExists) {
                form.setValue('categoryId', '', { shouldValidate: true });
                console.log(`Categoria ${currentCategoryId} limpa após a mudança de tipo.`);
              }
              // biome-ignore lint/correctness/useExhaustiveDependencies: watchedType e o array são o gatilho
            }, [watchedType, watchedFilteredCategories, form.setValue, form.getValues]);

            if (!watchedType) {
              return <></>;
            }

            if (isLoadingCategories) {
              return (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Carregando categorias...</span>
                  </div>
                </FormItem>
              );
            }

            return (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value as string}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {watchedFilteredCategories.length > 0 ? (
                      watchedFilteredCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="placeholder-disabled" disabled>
                        Nenhuma categoria para este tipo.
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Campo status */}

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value as string}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={TransactionStatus.RECEIVED}>
                    Recebido
                  </SelectItem>
                  <SelectItem value={TransactionStatus.PENDING}>
                    Pendente
                  </SelectItem>
                  <SelectItem value={TransactionStatus.PAID}>
                    Pago
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data</FormLabel>
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
                        format(field.value, "PPP", { locale: ptBR })
                      ) : (
                        <span>Pick a date</span>
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

        {serverError && (
          <p className="text-sm font-medium text-destructive">
            {serverError}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending
            ? "Salvando..."
            : initialData
              ? "Salvar Alterações"
              : "Salvar Transação"}
        </Button>
      </form>
    </Form>
  );
}
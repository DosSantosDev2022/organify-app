// components/pages/planned-purchases/PlannedPurchaseForm.tsx

"use client";

import { PlannedPurchaseInitialData } from "@/hooks/planned-purchases/use-planned-purchases-controller";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2, Save } from "lucide-react";
import { useFormPlannedPurchaseController } from "@/hooks/planned-purchases/useFormPlannedPurchaseController";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form, Popover, PopoverTrigger, PopoverContent, Calendar } from "@/components/ui";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

// Tipagem das props do formulário
interface PlannedPurchaseFormProps {
  onClose: () => void;
  selectedMonth: Date;
  initialData: PlannedPurchaseInitialData | null;
}

export function PlannedPurchaseForm({ initialData, selectedMonth, onClose }: PlannedPurchaseFormProps) {

  const {
    form,
    onSubmit,
    isPending,
    isEditing
  } = useFormPlannedPurchaseController({
    initialData,
    selectedMonth,
    onClose
  });


  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Nome do Item */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Item</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Monitor Ultra-Wide"
                  {...field}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descrição */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex: Precisa ter 144Hz e painel IPS."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        {/* Valor e Prazo (em linha) */}
        <div className="grid grid-cols-2 gap-4">
          {/* Valor */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Estimado (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="decimal"
                    placeholder="999.99"
                    // Converte de number para string para o input e de volta para number no onChange
                    value={field.value === undefined || field.value === null ? '' : field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Prazo */}
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={twMerge(
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
        </div>

        {/* Botão de Ação (inalterado) */}
        <Button
          type="submit"
          className="w-full "
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isEditing ? "Salvar Alterações" : "Adicionar Compra"}
        </Button>
      </form>
    </Form>
  );
}
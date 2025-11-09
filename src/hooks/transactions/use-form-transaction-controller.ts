// hooks/form-transaction-controller.ts
import { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionSchema, transactionSchema } from "@/schemas/validations";
import { TransactionType } from "@prisma/client";
import { useUpdateTransaction, useCreateTransaction } from "@/hooks/transactions";
import { TransactionFromApi } from "@/components/pages/transactions/TransactionTable"; // Assumindo este path

// 1. Definições de Tipos Auxiliares
interface FormControllerProps {
  initialData?: TransactionFromApi | null;
  selectedMonth: Date;
  onClose: () => void;
}

// 2. Função para Obter Valores Vazios/Padrão
const getEmptyValues = (selectedMonth: Date): TransactionSchema => ({
  description: "",
  amount: undefined as any,
  date: selectedMonth, 
  type: TransactionType.INCOME,
});

// 3. Tipos de Retorno do Hook
interface FormControllerReturn {
  form: UseFormReturn<TransactionSchema>;
  onSubmit: (data: TransactionSchema) => Promise<void>;
  isPending: boolean;
  serverError: string | null;
}

// 4. Hook Principal
export function useFormTransactionController({
  initialData,
  selectedMonth,
  onClose,
}: FormControllerProps): FormControllerReturn {
  const { create, isPending: isCreating } = useCreateTransaction();
  const { update, isPending: isUpdating } = useUpdateTransaction();
  const [serverError, setServerError] = useState<string | null>(null);

  const isPending = isUpdating || isCreating; // Ocupado se estiver a criar OU a atualizar

  const form = useForm<TransactionSchema>({
    resolver: zodResolver(transactionSchema),
    // Define os valores iniciais
    defaultValues: initialData
      ? {
          ...initialData,
          date: new Date(initialData.date), // Garante que a data é um objeto Date
        }
      : getEmptyValues(selectedMonth),
  });

  // Efeito para resetar o formulário quando initialData ou selectedMonth mudam
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        date: new Date(initialData.date),
      });
    } else {
      form.reset(getEmptyValues(selectedMonth));
    }
  }, [initialData, selectedMonth, form.reset]); // Adiciona form.reset como dependência

  async function onSubmit(data: TransactionSchema) {
    setServerError(null);

    const apiCall = initialData
      ? update({ id: initialData.id, data })
      : create(data);

    try {
        const result = await apiCall;

        if (result.success) {
            onClose();
        } else {
            // Se houver um erro de validação (ou outro erro retornado pela API)
            setServerError("Erro ao processar transação. Verifique os dados.");
        }
    } catch (error) {
        setServerError("Ocorreu um erro inesperado no servidor.");
        console.error("Erro na submissão da transação:", error);
    }
  }

  return {
    form,
    onSubmit,
    isPending,
    serverError,
  };
}
// hooks/use-planned-purchases/useFormPlannedPurchaseController.ts

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlannedPurchaseFormSchema, PlannedPurchaseFormValues, PlannedPurchaseFromApi } from '@/schemas/planned-purchase-schema';
import { useCreateOrUpdatePlannedPurchase } from './use-planned-purchases';
import { PlannedPurchaseStatus } from '@prisma/client';

// Propriedades do Hook Controller (Inalterado)
interface FormPlannedPurchaseControllerProps {
  initialData?: PlannedPurchaseFromApi | null;
  selectedMonth: Date;
  onClose: () => void;
}

export function useFormPlannedPurchaseController({
  initialData,
  selectedMonth,
  onClose,
}: FormPlannedPurchaseControllerProps) {

  // Determina se estamos editando
  const isEditing = !!initialData?.id;

  // --- 1. CONFIGURAÇÃO REACT HOOK FORM ---

  // Converte valor monetário (Int) da API para float (para exibição no input)
  const defaultAmount = initialData?.amount ? (initialData.amount / 100) : 0;

  const form = useForm({
    resolver: zodResolver(PlannedPurchaseFormSchema),
    defaultValues: {
      id: initialData?.id || undefined,
      name: initialData?.name || '',
      description: initialData?.description || '',
      amount: defaultAmount, // Usando Number(defaultAmount) pois o RHF aceita numbers
      deadline: initialData?.deadline || selectedMonth, // Usa a data selecionada como padrão
      status: initialData?.status || PlannedPurchaseStatus.PENDING,
    },
    mode: 'onBlur',
  });

  // --- 2. CONFIGURAÇÃO REACT QUERY MUTATIONS ---
  const {
    mutateAsync: createOrUpdateItem,
    isPending
  } = useCreateOrUpdatePlannedPurchase();

  // --- 3. LÓGICA DE SUBMISSÃO ---

  const onSubmit = async (values: PlannedPurchaseFormValues) => {
    // Conversão final para CENTAVOS (INT) antes de enviar para o Server Action
    const amountInCents = Math.round(values.amount * 100);

    try {
      await createOrUpdateItem({
        id: isEditing ? values.id : undefined, // Passa o ID apenas se estiver editando
        name: values.name,
        description: values.description,
        amount: amountInCents,
        deadline: values.deadline,
        status: values.status,
      });

      onClose(); // Fecha o modal após o sucesso

    } catch (error) {
      console.error("Erro ao salvar a compra planejada:", error);
      // Em uma aplicação real, você mostraria uma notificação de erro aqui.
    }
  };

  const serverError = null; // Mantendo o placeholder

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit), // Usa o handleSubmit do RHF
    isPending,
    isEditing,
    serverError,
  };
}
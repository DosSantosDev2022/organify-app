// hooks/planned-purchases/use-planned-purchases.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPlannedPurchases,
  deletePlannedPurchase,
  togglePlannedPurchaseStatus,
  createOrUpdatePlannedPurchase,
  PlannedPurchasePayload
} from "@/app/actions/planned-purchases";
import { toast } from "sonner";

export interface PlannedPurchase {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  deadline: Date;
  status: "PENDING" | "PURCHASED";
}

const plannedPurchasesQueryKeys = {
  base: ["planned-purchases"] as const,
  list: (month: number, year: number) => [...plannedPurchasesQueryKeys.base, year, month] as const,
};

// --- HOOK DE LISTAGEM ---
export function usePlannedPurchases(month: number, year: number) {
  return useQuery({
    // 🚀 USO: Usar o objeto centralizado
    queryKey: plannedPurchasesQueryKeys.list(month, year),
    queryFn: () => getPlannedPurchases({ month, year }),
  });
}

/**
 * Hook UNIFICADO para criar ou atualizar uma compra planejada.
 */
export function useCreateOrUpdatePlannedPurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PlannedPurchasePayload) => createOrUpdatePlannedPurchase(data),
    onSuccess: (newItem, variables) => {
      // Invalida a chave base para atualizar todas as listas
      queryClient.invalidateQueries({ queryKey: plannedPurchasesQueryKeys.base });

      const action = variables.id ? "editada" : "adicionada";
      toast.success(`Compra "${newItem.name}" ${action} com sucesso!`);
    },
    onError: (error) => {
      toast.error("Falha ao salvar o item. Tente novamente.");
      console.error(error);
    },
  });
}

// --- HOOK DE TOGGLE STATUS ---
export function useTogglePlannedPurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: togglePlannedPurchaseStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plannedPurchasesQueryKeys.base });
    },
  });
}

// --- HOOK DE DELETE ---
export function useDeletePlannedPurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlannedPurchase,
    onSuccess: (_, deletedId) => {
      // Invalida a chave base para atualizar todas as listas
      queryClient.invalidateQueries({ queryKey: plannedPurchasesQueryKeys.base });
      toast.success("Item de compra excluído com sucesso.");
    },
    onError: (error) => {
      toast.error("Falha ao excluir o item. Tente novamente.");
      console.error(error);
    },
  });
}
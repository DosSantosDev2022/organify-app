"use client";

import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  usePlannedPurchases,
  useTogglePlannedPurchase,
  useDeletePlannedPurchase,
  useCreateOrUpdatePlannedPurchase,
  PlannedPurchase
} from "./use-planned-purchases";

// Dados iniciais para pré-preenchimento
export interface PlannedPurchaseInitialData {
  id: string;
  name: string;
  description: string;
  amount: number; // Em centavos
  deadline: Date;
  status: "PENDING" | "PURCHASED";
}

export function usePlannedPurchasesController() {
  // --- 1. ESTADO LOCAL (UI) ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<PlannedPurchaseInitialData | null>(null);
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);

  // Extraímos mês e ano para a query (usando o estado mais limpo)
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // --- 2. REACT QUERY & MUTATIONS ---
  const {
    data: items = [],
    isLoading
  } = usePlannedPurchases(currentMonth, currentYear);

  const {
    isPending: isPendingSave // Estado de loading para criação/edição
  } = useCreateOrUpdatePlannedPurchase(); // Mantido apenas para pegar o isPendingSave

  const {
    mutate: toggleStatus
  } = useTogglePlannedPurchase();

  const {
    mutate: deleteItem
  } = useDeletePlannedPurchase();


  // --- 3. LÓGICA DE MODAL E EDIÇÃO ---

  // Função para fechar o Dialog e limpar o estado de edição/criação
  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setItemToEdit(null); // Limpa o item em edição
  }, []);

  // Função para abrir o modal em modo CRIAÇÃO
  const handleNewItemClick = useCallback(() => {
    setItemToEdit(null); // Garante que não está em modo edição
    setIsDialogOpen(true);
  }, []);


  /**
   * Prepara o estado para abrir o modal em modo EDIÇÃO.
   */
  const handleEditItem = useCallback((item: PlannedPurchase) => {
    // 1. Define o item que será editado no estado
    setItemToEdit({
      id: item.id,
      name: item.name,
      description: item.description ?? '', // Garante que não seja null
      amount: item.amount,
      deadline: item.deadline,
      status: item.status,
    });
    // 2. Abre o Dialog
    setIsDialogOpen(true);
  }, []);

  // --- 4. FUNÇÕES GERAIS E CÁLCULOS ---

  const formatCurrency = (valueInCents: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valueInCents / 100);
  };

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  }, []);

  const currentMonthFormatted = useMemo(() => {
    return format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });
  }, [currentDate]);

  const { totalPlanned, totalPurchased, purchasedCount } = useMemo(() => {
    const totalPlanned = items.reduce((acc, item) => acc + item.amount, 0);

    const purchasedItems = items.filter(item => item.status === 'PURCHASED');
    const totalPurchased = purchasedItems.reduce((acc, item) => acc + item.amount, 0);

    return {
      totalPlanned,
      totalPurchased,
      purchasedCount: purchasedItems.length,
    };
  }, [items]);


  const handleDeleteItemClick = useCallback((id: string) => {
    setItemToDeleteId(id);
  }, []);

  const handleDeleteConfirmation = useCallback(() => {
    if (itemToDeleteId) {
      deleteItem(itemToDeleteId, {
        onSuccess: () => {
          setItemToDeleteId(null);
        },
        onError: () => {
          setItemToDeleteId(null);
        }
      });
    }
  }, [itemToDeleteId, deleteItem]);

  const handleCancelDelete = useCallback(() => {
    setItemToDeleteId(null);
  }, []);


  // --- 5. RETORNO DO HOOK ---
  return {
    // Dados e Totais
    items,
    isLoading,
    totalPlanned,
    totalPurchased,
    purchasedCount,

    // Status e Funções do Dialog
    isDialogOpen,
    setIsDialogOpen: handleCloseDialog, // Função de fechar/limpar
    isCreating: isPendingSave,
    handleNewItemClick, // Abrir modal (Criação)

    // Edição
    itemToEdit,
    handleEditItem,

    // Navegação, Ações na Tabela
    currentDate,
    currentMonthFormatted,
    handlePrevMonth,
    handleNextMonth,
    formatCurrency,
    toggleStatus,
    itemToDeleteId,
    handleDeleteItemClick,
    handleDeleteConfirmation,
    handleCancelDelete,
  };
}

export type { PlannedPurchase };
// ----------------------------------------------------
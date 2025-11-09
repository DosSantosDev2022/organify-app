// hooks/use-transaction-tab-controller.ts
import { useState } from "react";
import { TransactionType } from "@prisma/client";
import { useGetTransactions, useDeleteTransaction } from "@/hooks/transactions";
import { TransactionFromApi } from "@/components/pages/transactions/TransactionTable";

interface ControllerProps {
  type: TransactionType;
  selectedMonth: Date;
}

interface ControllerReturn {
  // Dados e Estado de Carregamento
  transactions: TransactionFromApi[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  
  // Estado e Handlers do Modal (Criar/Editar)
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  editingTransaction: TransactionFromApi | null;
  handleOpenEditModal: (id: string) => void;
  handleCloseModal: () => void;
  handleOpenCreateModal: () => void;
  
  // Estado e Handlers do Alerta (Excluir)
  isDeleteAlertOpen: boolean;
  setIsDeleteAlertOpen: (open: boolean) => void;
  deletingTransactionId: string | null;
  isDeleting: boolean;
  handleOpenDeleteAlert: (id: string) => void;
  handleCloseDeleteAlert: () => void;
  handleConfirmDelete: () => void;
}

export function useTransactionTabController({
  type,
  selectedMonth,
}: ControllerProps): ControllerReturn {
  // --- Estados Locais ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<
    string | null
  >(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<
    string | null
  >(null);

  // --- Hooks de Dados ---
  const { transactions, isLoading, isError, error } = useGetTransactions(
    type,
    selectedMonth
  );
  const { remove, isPending: isDeleting } = useDeleteTransaction();

  // --- Handlers de Fecho/Reset (Modal) ---
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransactionId(null); // Limpa o ID de edição
  };

  // --- Handlers de Abertura (Modal) ---
  const handleOpenEditModal = (id: string) => {
    setEditingTransactionId(id);
    setIsModalOpen(true);
  };
  
  // Quando o botão 'Adicionar' é clicado no header
  const handleOpenCreateModal = () => {
      setEditingTransactionId(null); // Garante que é um novo formulário
      setIsModalOpen(true);
  }

  // --- Handlers de Fecho/Reset (Alerta) ---
  const handleCloseDeleteAlert = () => {
    setIsDeleteAlertOpen(false);
    setDeletingTransactionId(null); // Limpa o ID de exclusão
  };

  // --- Handlers de Abertura (Alerta) ---
  const handleOpenDeleteAlert = (id: string) => {
    setDeletingTransactionId(id);
    setIsDeleteAlertOpen(true);
  };

  // --- Ação de Excluir ---
  const handleConfirmDelete = () => {
    if (deletingTransactionId) {
      remove(deletingTransactionId, {
        onSuccess: () => {
          handleCloseDeleteAlert(); // Fecha o alerta no sucesso
        },
      });
    }
  };

  // --- Transação a ser Editada ---
  const editingTransaction =
    transactions?.find((tx) => tx.id === editingTransactionId) || null;

  return {
   transactions: transactions || [],
    isLoading,
    isError,
    error: error as Error | null,
    
    // Modal
    isModalOpen,
    setIsModalOpen,
    editingTransaction,
    handleOpenEditModal,
    handleCloseModal,
    handleOpenCreateModal,
    
    // Alerta de Exclusão
    isDeleteAlertOpen,
    setIsDeleteAlertOpen,
    deletingTransactionId,
    isDeleting,
    handleOpenDeleteAlert,
    handleCloseDeleteAlert,
    handleConfirmDelete,
  };
}
// components/TransactionTabContent.tsx
"use client";

import { useState } from "react";
import { TransactionType } from "@prisma/client";
import { useGetTransactions, useDeleteTransaction } from "@/hooks/transactions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Skeleton,
  Button
} from "@/components/ui";
import { TransactionTable, TransactionForm } from "@/components/pages/transactions";
import { Plus, Loader2 } from "lucide-react";

interface TransactionTabContentProps {
  type: TransactionType;
  title: string;
  selectedMonth: Date;
}

export function TransactionTabContent({ type, title, selectedMonth }: TransactionTabContentProps) {
  // --- NOVOS ESTADOS DE GESTÃO ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<
    string | null
  >(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<
    string | null
  >(null);
  // ------------------------------

  // 1. Hooks de dados e mutação
  const { transactions, isLoading, isError, error } = useGetTransactions(
    type,
    selectedMonth
  );
  const { remove, isPending: isDeleting } = useDeleteTransaction();

  // 2. Funções de Abertura (chamadas pela TransactionTable)
  const handleOpenEditModal = (id: string) => {
    setEditingTransactionId(id);
    setIsModalOpen(true);
  };

  const handleOpenDeleteAlert = (id: string) => {
    setDeletingTransactionId(id);
    setIsDeleteAlertOpen(true);
  };

  // 3. Funções de Fecho (resetam o estado)
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransactionId(null); // Limpa o ID de edição ao fechar
  };

  const handleCloseDeleteAlert = () => {
    setIsDeleteAlertOpen(false);
    setDeletingTransactionId(null); // Limpa o ID de exclusão
  };

  // 4. Ação de Excluir
  const handleConfirmDelete = () => {
    if (deletingTransactionId) {
      remove(deletingTransactionId, {
        onSuccess: () => {
          handleCloseDeleteAlert(); // Fecha o alerta no sucesso
        },
      });
    }
  };

  // 5. Encontra a transação a ser editada
  const editingTransaction =
    transactions?.find((tx) => tx.id === editingTransactionId) || null;

  // 6. Renderização (Loading, Erro, Dados)
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-2 mt-4 p-4 border rounded-lg">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="border rounded-lg p-4 min-h-[200px] flex justify-center items-center bg-red-50 text-red-700">
          <p>Erro ao buscar dados: {error?.message}</p>
        </div>
      );
    }

    // Passa os novos handlers para a tabela
    return (
      <div className="border rounded-lg">
        <TransactionTable
          transactions={transactions || []}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteAlert}
        />
      </div>
    );
  };

  return (
    // O Dialog controla o modal (Criar/Editar)
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>

        <DialogTrigger asChild>
          <Button onClick={() => setEditingTransactionId(null)}>
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </DialogTrigger>
      </header>

      {/* O conteúdo da aba (Tabela, Loading ou Erro) */}
      {renderContent()}

      {/* Conteúdo do Modal (Criar/Editar) */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingTransactionId ? "Editar Transação" : "Adicionar Transação"}
          </DialogTitle>
          <DialogDescription>
            {editingTransactionId
              ? "Atualize os dados da sua transação."
              : "Preencha os dados da sua nova transação."}
          </DialogDescription>
        </DialogHeader>
        <TransactionForm
          onClose={handleCloseModal}
          initialData={editingTransaction}
          selectedMonth={selectedMonth}
        />
      </DialogContent>

      {/* Diálogo de Confirmação de Exclusão (separado) */}
      <AlertDialog
        open={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto irá excluir
              permanentemente a sua transação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteAlert}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
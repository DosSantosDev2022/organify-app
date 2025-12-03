'use client';

import { Loader2 } from 'lucide-react';
import { useDeleteDebt } from '@/hooks/debts/use-delete-debt';
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui';
import { JSX } from 'react';

interface DeleteDebtConfirmationProps {
  debtId: string;
  description: string;
  onClose: () => void;
}

/**
 * @component
 * @description Conteúdo do AlertDialog (modal de confirmação) para exclusão de uma dívida.
 * Gerencia a mutação de exclusão usando o hook `useDeleteDebt`.
 * @param {DeleteDebtConfirmationProps} props As propriedades do componente.
 * @param {string} props.debtId O ID da dívida a ser excluída.
 * @param {string} props.description A descrição da dívida, exibida no alerta.
 * @param {() => void} props.onClose Função para fechar o modal após a conclusão da ação (sucesso ou falha).
 * @returns {JSX.Element} O conteúdo do modal de confirmação.
 */
export function DeleteDebtConfirmation({ debtId, description, onClose }: DeleteDebtConfirmationProps): JSX.Element {
  // 1. Usa o Custom Hook de Exclusão
  const { deleteDebt, isDeleting } = useDeleteDebt();

  // 2. Função de manipulação da exclusão
  const handleDelete = (): void => {
    deleteDebt(debtId, {
      onSuccess: () => {
        onClose(); // Fecha o modal após o sucesso da exclusão
      },
      // Nota: o hook `useDeleteDebt` deve gerenciar o tratamento de erro e o toast.
    });
  };

  return (
    <AlertDialogContent
      onOpenAutoFocus={(e) => e.preventDefault()}
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      <AlertDialogHeader>
        <AlertDialogTitle>Tem certeza que deseja excluir esta dívida?</AlertDialogTitle>
        <AlertDialogDescription>
          Esta ação é irreversível. Excluir a dívida "{description}" também irá remover todos os pagamentos relacionados a ela.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-600 hover:bg-red-700"
        >
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Excluindo...
            </>
          ) : (
            'Excluir Dívida'
          )}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
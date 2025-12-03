'use client';

import { Loader2 } from 'lucide-react';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Importa o Custom Hook de Exclusão de Pagamento
import { useDeletePayment } from '@/hooks/debts/use-delete-payment';
import { JSX } from 'react';

interface DeletePaymentConfirmationProps {
  paymentId: string;
  paymentValue: string; // Valor formatado para exibição, e.g., "R$ 2.000,00"
  onClose: () => void;
}

/**
 * @component
 * @description Conteúdo do AlertDialog (modal de confirmação) para exclusão de um pagamento específico.
 * Gerencia a mutação de exclusão usando o hook `useDeletePayment`.
 * @param {DeletePaymentConfirmationProps} props As propriedades do componente.
 * @param {string} props.paymentId O ID do pagamento a ser excluído.
 * @param {string} props.paymentValue O valor do pagamento, formatado para exibição no alerta.
 * @param {() => void} props.onClose Função para fechar o modal após a conclusão da ação.
 * @returns {JSX.Element} O conteúdo do modal de confirmação.
 */
export function DeletePaymentConfirmation({ paymentId, paymentValue, onClose }: DeletePaymentConfirmationProps): JSX.Element {
  // Usa o Custom Hook de Exclusão
  const { deletePayment, isDeleting } = useDeletePayment();

  // Função de manipulação da exclusão
  const handleDelete = (): void => {
    deletePayment(paymentId, {
      onSuccess: () => {
        // Fecha o modal/dialogo após o sucesso
        onClose();
      }
    });
  };

  return (
    <AlertDialogContent
      onOpenAutoFocus={(e) => e.preventDefault()}
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      <AlertDialogHeader>
        <AlertDialogTitle>Tem certeza que deseja excluir este pagamento?</AlertDialogTitle>
        <AlertDialogDescription>
          Esta ação é irreversível. Excluir o pagamento de {paymentValue}
          irá reverter o saldo da dívida.
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
            'Excluir Pagamento'
          )}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
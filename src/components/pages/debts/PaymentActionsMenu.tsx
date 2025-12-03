'use client';

import { JSX, useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { AlertDialog, Button, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui';
import { DeletePaymentConfirmation } from './DeletePaymentConfirmation';
import { EditPaymentForm } from './EditPaymentForm';
import { UpdatePaymentFormValues } from '@/hooks/debts/use-update-payment-form'; // 💡 Importação para tipagem

interface PaymentActionsMenuProps {
  debtId: string;
  paymentId: string;
  // Valor já formatado para o modal de exclusão
  formattedValue: string;
  // Valores iniciais formatados para o formulário de edição
  defaultEditValues: UpdatePaymentFormValues;
}

/**
 * @component
 * @description Exibe os botões de ação (Editar e Excluir) para um pagamento,
 * gerenciando a abertura dos modais de `Dialog` (edição) e `AlertDialog` (exclusão).
 * @param {PaymentActionsMenuProps} props As propriedades do componente.
 * @returns {JSX.Element} O menu de ações e os modais relacionados.
 */
export function PaymentActionsMenu({ paymentId, debtId, formattedValue, defaultEditValues }: PaymentActionsMenuProps): JSX.Element {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      {/* 1. Contêiner dos Botões de Ação */}
      <div className="flex items-center space-x-1">

        {/* Botão de Edição (Abre o Dialog) */}
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 p-0"
          title="Editar Pagamento"
          onClick={(e) => {
            e.stopPropagation(); // Impede que o clique suba (ex: para o Accordion pai)
            setIsEditModalOpen(true);
          }}
        >
          <Edit className="h-3 w-3" />
        </Button>

        {/* Botão de Exclusão (Abre o AlertDialog) */}
        <Button
          variant="destructive"
          size="icon"
          className="h-6 w-6 p-0"
          title="Excluir Pagamento"
          onClick={(e) => {
            e.stopPropagation(); // Impede que o clique suba
            setIsDeleteModalOpen(true);
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>


      {/* 2. Modal de Edição de Pagamento (Dialog) */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      >
        <DialogContent
          className="sm:max-w-[425px] bg-card border-border"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Editar Pagamento: {formattedValue}</DialogTitle>
          </DialogHeader>

          <EditPaymentForm
            debtId={debtId}
            paymentId={paymentId}
            currentValues={defaultEditValues}
            onSuccess={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* 3. Modal de Confirmação de Exclusão (AlertDialog) */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DeletePaymentConfirmation
          paymentId={paymentId}
          paymentValue={formattedValue}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      </AlertDialog>
    </>
  );
}
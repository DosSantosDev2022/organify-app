'use client';

import { JSX, useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { AlertDialog, Button, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui';
import { DeleteDebtConfirmation } from './DeleteDebtConfirmation';
import { EditDebtForm } from './EditDebtForm';
import { UpdateDebtFormValues } from '@/hooks/debts/use-update-debt-form';

interface DebtActionsMenuProps {
  debtId: string;
  description: string;
  defaultEditValues: UpdateDebtFormValues;
}

/**
 * @component
 * @description Exibe botões de ação (Editar e Excluir) para uma dívida,
 * gerenciando os modais de `Dialog` (Edição) e `AlertDialog` (Exclusão).
 * @param {DebtActionsMenuProps} props As propriedades do componente.
 * @param {string} props.debtId O ID da dívida para as ações.
 * @param {string} props.description A descrição da dívida (usada no título dos modais).
 * @param {UpdateDebtFormValues} props.defaultEditValues Valores iniciais para o formulário de edição.
 * @returns {JSX.Element} Os botões de ação e os modais correspondentes.
 */
export function DebtActionsMenu({ debtId, description, defaultEditValues }: DebtActionsMenuProps): JSX.Element {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      {/* 1. Contêiner dos Botões de Ação */}
      <div className="flex items-center space-x-1">

        {/* Botão de Edição (Abre o Dialog) */}
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          title="Editar Dívida"
          onClick={(e) => {
            // Impede que o clique suba e acione o Accordion/outros elementos
            e.stopPropagation();
            setIsEditModalOpen(true);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>

        {/* Botão de Exclusão (Abre o AlertDialog) */}
        <Button
          variant="destructive"
          className="h-8 w-8 p-0"
          title="Excluir Dívida"
          onClick={(e) => {
            // Impede que o clique suba e acione o Accordion/outros elementos
            e.stopPropagation();
            setIsDeleteModalOpen(true);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* 2. Modal de Edição de Dívida (Dialog) */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      >
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="sm:max-w-[425px] bg-card border-border"
        >
          <DialogHeader>
            <DialogTitle>Editar Dívida: {description}</DialogTitle>
          </DialogHeader>

          <EditDebtForm
            debtId={debtId}
            currentValues={defaultEditValues}
            onSuccess={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* 3. Modal de Confirmação de Exclusão (AlertDialog) */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DeleteDebtConfirmation
          debtId={debtId}
          description={description}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      </AlertDialog>
    </>
  );
}
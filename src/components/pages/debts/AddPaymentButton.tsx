'use client'

import { JSX, useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui';
import { AddPaymentForm } from './AddPaymentForm';

interface AddPaymentButtonProps {
  debtId: string;
  description: string;
}

/**
 * @component
 * @description Botão que abre um modal para registrar um novo pagamento em uma dívida específica.
 * @param {AddPaymentButtonProps} props As propriedades do componente.
 * @param {string} props.debtId O ID da dívida à qual o pagamento será associado.
 * @param {string} props.description A descrição da dívida (usada no título do modal).
 * @returns {JSX.Element} O botão e o componente modal.
 */
export function AddPaymentButton({ debtId, description }: AddPaymentButtonProps): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Função para fechar o modal. É passada para o `AddPaymentForm` para ser chamada após o sucesso da submissão.
   * @function
   */
  const handleSuccess = (): void => {
    setIsModalOpen(false);
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center space-x-1"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar Pagamento</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl">Novo Pagamento</DialogTitle>
          <p className="text-sm text-gray-400 mt-1">Dívida: **{description}**</p>
        </DialogHeader>

        <AddPaymentForm
          debtId={debtId}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
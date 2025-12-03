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
import { DebtForm } from './DebtForm';

/**
 * @component
 * @description Botão que abre um modal (`Dialog`) contendo o formulário (`DebtForm`) para adicionar uma nova dívida.
 * O modal é fechado automaticamente após o sucesso do cadastro.
 * @returns {JSX.Element} O botão e o componente modal.
 */
export function AddDebtButton(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Função para fechar o modal. É passada para o `DebtForm` para ser chamada após o sucesso da submissão.
   * @function
   */
  const handleSuccess = (): void => {
    setIsModalOpen(false);
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-1">
          <Plus className="h-4 w-4" />
          <span>Adicionar</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl">Nova Dívida</DialogTitle>
        </DialogHeader>

        <DebtForm onSuccess={handleSuccess} />

      </DialogContent>
    </Dialog>
  );
}
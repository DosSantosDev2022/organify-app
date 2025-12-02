'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddPaymentForm } from './AddPaymentForm'; // Formulário a criar

interface AddPaymentButtonProps {
  debtId: string;
  description: string;
}

export function AddPaymentButton({ debtId, description }: AddPaymentButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsModalOpen(false);
    // O formulário de pagamento deve invalidar as queries no onSuccess
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center space-x-1 border-blue-600 text-blue-400 hover:bg-blue-900/50"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar Pagamento</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-white">
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
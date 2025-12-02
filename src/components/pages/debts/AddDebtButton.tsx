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
} from '@/components/ui/dialog'; // Assumindo o componente Dialog/Modal
import { DebtForm } from './DebtForm';

export function AddDebtButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para fechar o modal após o sucesso do cadastro
  const handleSuccess = () => {
    setIsModalOpen(false);
    // Aqui você também pode invalidar a query do React Query para atualizar a lista:
    // queryClient.invalidateQueries({ queryKey: ['debtsList'] }); 
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      {/* Botão que abre o modal, idêntico ao do seu print */}
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4" />
          <span>Adicionar</span>
        </Button>
      </DialogTrigger>

      {/* Conteúdo do Modal (Formulário) */}
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">Nova Dívida</DialogTitle>
        </DialogHeader>

        {/* Passa a função de fechar o modal para o formulário */}
        <DebtForm onSuccess={handleSuccess} />

      </DialogContent>
    </Dialog>
  );
}
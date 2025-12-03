'use client';

import { useQuery } from '@tanstack/react-query';
import { getDebts, DebtWithPaidInfo } from '@/app/actions/debt-actions';
import { DebtItem } from './DebtItem';
import { JSX } from 'react';

/**
 * @component
 * @description Componente principal que busca todas as dívidas registradas usando TanStack Query.
 * Ele gerencia os estados de carregamento, erro e lista vazia, e renderiza cada dívida usando `DebtItem`.
 * @returns {JSX.Element} A lista de dívidas ou mensagens de status.
 */
export function DebtList(): JSX.Element {
  const {
    data: debts,
    isLoading,
    isError
  } = useQuery<DebtWithPaidInfo[]>({
    queryKey: ['debtsList'],
    queryFn: getDebts,
  });

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-400">
        Carregando dívidas...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-500">
        Erro ao carregar as dívidas.
      </div>
    );
  }

  if (!debts || debts.length === 0) {
    return (
      <div className="rounded-md border border-border p-8 text-center">
        Nenhuma dívida registrada. Utilize o botão "+ Adicionar" para lançar uma.
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[70vh] px-2 overflow-y-auto scrollbar-custom ">
      {debts.map((debt) => (
        <DebtItem
          key={debt.id}
          debt={debt}
        />
      ))}
    </div>
  );
}
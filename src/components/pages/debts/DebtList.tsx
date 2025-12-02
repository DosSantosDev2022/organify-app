'use client'

import { useQuery } from '@tanstack/react-query';
import { getDebts, DebtWithPaidInfo } from '@/app/actions/debt-actions';
import { DebtItem } from './DebtItem'; // Componente de item individual (a criar)

export function DebtList() {
  const { data: debts, isLoading, isError } = useQuery<DebtWithPaidInfo[]>({
    queryKey: ['debtsList'],
    queryFn: getDebts,
  });

  if (isLoading) return <div className="p-4 text-center text-gray-400">Carregando dívidas...</div>;
  if (isError) return <div className="p-4 text-center text-red-500">Erro ao carregar as dívidas.</div>;

  if (!debts || debts.length === 0) {
    return (
      <div className="rounded-md border border-gray-800 p-8 text-center text-gray-400">
        Nenhuma dívida registrada. Utilize o botão "+ Adicionar" para lançar uma.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {debts.map((debt) => (
        // Renderiza o componente individual para cada dívida
        <DebtItem key={debt.id} debt={debt} />
      ))}
    </div>
  );
}
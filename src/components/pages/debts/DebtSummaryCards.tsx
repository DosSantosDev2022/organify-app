'use client';

// Remove useQuery do summary e DebtSummaryCards
import { DebtListSection } from '@/components/pages/debts/DebtListSection'; // Novo componente para encapsular lista e botão

export default function DebtSummaryCards() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center">
        Gestão de Dívidas <span className="text-2xl ml-2">💰</span>
      </h1>
      <DebtListSection />
    </div>
  );
}
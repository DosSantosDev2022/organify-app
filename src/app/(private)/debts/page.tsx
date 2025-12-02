'use client';

// Remove useQuery do summary, DebtSummaryCards e DebtListTable (substituída por DebtListSection)
import { DebtListSection } from '@/components/pages/debts/DebtListSection';

export default function DebtsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center">
        Gestão de Dívidas <span className="text-2xl ml-2">💰</span>
      </h1>
      <DebtListSection />
    </div>
  );
}
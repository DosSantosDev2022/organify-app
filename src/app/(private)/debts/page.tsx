'use client';

import { AddDebtButton, DebtList } from '@/components/pages/debts';

export default function DebtsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center">
        Gestão de Dívidas
      </h1>
      <section className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Minhas dívidas</h2>
          <AddDebtButton />
        </div>

        {/* A lista agora usa DebtList, que exibirá os itens individuais */}
        <DebtList />
      </section>
    </div>
  );
}
'use client';

import { AddDebtButton, DebtList } from '@/components/pages/debts';
import { CreditCard, Landmark } from 'lucide-react';

export default function DebtsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-card border rounded-2xl shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gestão de Dívidas</h1>
            <p className="text-sm text-muted-foreground">Monitore seus parcelamentos e compromissos financeiros</p>
          </div>
        </div>
        <AddDebtButton />
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <CreditCard className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Minhas dívidas</h2>
        </div>

        <DebtList />
      </section>
    </div>
  );
}
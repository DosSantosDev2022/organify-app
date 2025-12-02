'use client'

import { AddDebtButton } from './AddDebtButton';
import { DebtList } from './DebtList'; // O novo componente de lista de Dívidas

export function DebtListSection() {
  return (
    <section className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Dívidas Lançadas</h2>
        <AddDebtButton />
      </div>

      {/* A lista agora usa DebtList, que exibirá os itens individuais */}
      <DebtList />
    </section>
  );
}
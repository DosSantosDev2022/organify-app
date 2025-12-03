'use client';

import { JSX } from 'react';
import { AddDebtButton } from './AddDebtButton';
import { DebtList } from './DebtList';

/**
 * @component
 * @description Página ou seção de resumo de dívidas. 
 * Serve como contêiner principal para o título e a lista completa de gestão de dívidas (`DebtListSection`).
 * @returns {JSX.Element} A interface principal de gestão de dívidas.
 */
export default function DebtSummaryCards(): JSX.Element {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center">
        Gestão de Dívidas <span className="text-2xl ml-2">💰</span>
      </h1>
      <section className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Dívidas Lançadas</h2>
          <AddDebtButton />
        </div>

        {/* A lista agora usa DebtList, que exibirá os itens individuais */}
        <DebtList />
      </section>
    </div>
  );
}
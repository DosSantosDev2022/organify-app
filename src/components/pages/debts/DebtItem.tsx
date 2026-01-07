'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui';
import { DollarSign, CheckCircle, TrendingDown, Clock, ReceiptText, } from 'lucide-react';
import { DebtWithPaidInfo } from '@/app/actions/debt-actions';
import { DebtPaymentsList } from './DebtPaymentsList';
import { formatCurrency } from '@/lib/formatters';
import { formatDate } from 'date-fns';
import { AddPaymentButton } from './AddPaymentButton';
import { DebtActionsMenu } from './DebtActionsMenu';
import { JSX } from 'react';

interface DebtItemProps {
  debt: DebtWithPaidInfo;
}

export function DebtItem({ debt }: DebtItemProps): JSX.Element {
  const remainingAmount = debt.remainingAmount;
  const paidPercentage = Math.round((debt.amountPaid / debt.totalAmount) * 100);
  const isPaidOff = debt.isPaidOff || remainingAmount <= 0;

  // Configuração visual dos cards internos
  const cardsData = [
    {
      title: "Dívida Inicial",
      value: formatCurrency(debt.totalAmount),
      icon: DollarSign,
      style: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Saldo Devedor",
      value: formatCurrency(remainingAmount),
      icon: TrendingDown,
      style: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    },
    {
      title: "Já Pago",
      value: `${formatCurrency(debt.amountPaid)} (${paidPercentage}%)`,
      icon: CheckCircle,
      style: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Data de vencimento",
      value: debt.dueDate ? `Dia ${formatDate(new Date(debt.dueDate), 'dd')} do mês` : 'N/A', icon: Clock,
      style: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
  ];

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={debt.id} className="border rounded-2xl bg-card shadow-sm overflow-hidden mb-4">

        {/* HEADER DO ITEM */}
        <div className="flex items-center justify-between px-6 hover:bg-muted/30 transition-colors">
          <AccordionTrigger className="hover:no-underline py-6 grow">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${isPaidOff ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                <ReceiptText className="w-5 h-5" />
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="font-bold text-lg leading-none mb-1">
                  {debt.description}
                </span>
                {isPaidOff ? (
                  <span className="text-xs font-medium text-emerald-500 uppercase tracking-wider">Quitada</span>
                ) : (
                  <span className="text-xs text-muted-foreground">Em aberto</span>
                )}
              </div>
            </div>
          </AccordionTrigger>

          {/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
          {/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div className="flex items-center gap-6" onClick={(e) => e.stopPropagation()}>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Restante</span>
              <span className={`font-bold text-xl ${isPaidOff ? 'text-emerald-500' : 'text-rose-500'}`}>
                {formatCurrency(remainingAmount)}
              </span>
            </div>
            <DebtActionsMenu debtId={debt.id} description={debt.description} defaultEditValues={{ ...debt, category: debt.category ?? undefined }} />
          </div>
        </div>

        {/* CONTEÚDO EXPANDIDO */}
        <AccordionContent className="px-6 pb-6 pt-2 border-t bg-muted/5">
          {/* GRID DE CARDS DE RESUMO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {cardsData.map((card) => (
              <div key={card.title} className={`p-4 rounded-xl border ${card.style} shadow-sm`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase opacity-80">{card.title}</span>
                  <card.icon className="h-4 w-4 opacity-80" />
                </div>
                <div className="text-lg font-bold">{card.value}</div>
              </div>
            ))}
          </div>

          {/* HISTÓRICO DE PAGAMENTOS */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-bold flex items-center gap-2">
                <div className="w-1.5 h-5 bg-primary rounded-full" />
                Histórico de Pagamentos
              </h3>
              <AddPaymentButton debtId={debt.id} description={debt.description} />
            </div>

            <DebtPaymentsList
              debtId={debt.id}
              payments={debt.payments}
              totalAmount={debt.totalAmount}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
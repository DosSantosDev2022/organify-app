'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'; // Componente para expansão
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, CheckCircle, TrendingDown, Clock } from 'lucide-react';
import { DebtWithPaidInfo } from '@/app/actions/debt-actions';
import { DebtPaymentsList } from './DebtPaymentsList';
import { formatCurrency } from '@/lib/formatters';
import { formatDate } from 'date-fns';
import { AddPaymentButton } from './AddPaymentButton';

interface DebtItemProps {
  debt: DebtWithPaidInfo;
}

export function DebtItem({ debt }: DebtItemProps) {
  const remainingPercentage = Math.round((debt.remainingAmount / debt.totalAmount) * 100);
  const paidPercentage = 100 - remainingPercentage;
  const isPaidOff = debt.isPaidOff || debt.remainingAmount <= 0;

  const cardsData = [
    {
      title: "Saldo Devedor",
      value: formatCurrency(debt.remainingAmount),
      icon: TrendingDown,
      bgColor: isPaidOff ? 'bg-gray-800/50' : 'bg-red-900/50 border-red-800',
      textColor: isPaidOff ? 'text-gray-400' : 'text-red-400',
    },
    {
      title: "Dívida Inicial",
      value: formatCurrency(debt.totalAmount),
      icon: DollarSign,
      bgColor: 'bg-yellow-900/50 border-yellow-800',
      textColor: 'text-yellow-400',
    },
    {
      title: "Já Pago",
      value: `${formatCurrency(debt.amountPaid)} (${paidPercentage}%)`,
      icon: CheckCircle,
      bgColor: 'bg-green-900/50 border-green-800',
      textColor: 'text-green-400',
    },
    // ... (outros cards)
    {
      title: "Próx. Vencimento",
      // CORREÇÃO AQUI: Passar a string de formato como segundo argumento
      value: debt.dueDate ? formatDate(debt.dueDate, 'dd/MM/yyyy') : 'N/A',
      icon: Clock,
      bgColor: 'bg-gray-800/50 border-gray-700',
      textColor: 'text-gray-400',
    },
  ];

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={debt.id} className="border-gray-700 bg-gray-900 rounded-lg px-4 shadow-xl">

        {/* Cabeçalho da Dívida com Ação */}
        <AccordionTrigger className="hover:no-underline py-4">
          <div className="flex justify-between w-full pr-4">
            <span className="font-semibold text-lg flex items-center">
              {debt.description}
              {isPaidOff && <span className="ml-3 text-sm text-green-500">(Quitada)</span>}
            </span>
            <div className="text-right text-lg font-bold text-red-400">
              {formatCurrency(debt.remainingAmount)}
            </div>
          </div>
        </AccordionTrigger>

        {/* Conteúdo Expandido (Cards de Resumo e Pagamentos) */}
        <AccordionContent className="pt-4 pb-4">

          {/* Cards de Resumo INDIVIDUAL */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {cardsData.map((card) => (
              <Card
                key={card.title}
                className={`${card.bgColor} border-l-4 shadow-lg`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    {card.title}
                  </CardTitle>
                  <card.icon className={`h-4 w-4 ${card.textColor}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Título e Botão para Adicionar Pagamento */}
          <div className="flex justify-between items-center mb-3 mt-6">
            <h3 className="text-lg font-semibold text-gray-200">Histórico de Pagamentos</h3>
            <AddPaymentButton debtId={debt.id} description={debt.description} />
          </div>

          {/* Lista de Pagamentos (A ser criada) */}
          <DebtPaymentsList payments={debt.payments} totalAmount={debt.totalAmount} />

        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
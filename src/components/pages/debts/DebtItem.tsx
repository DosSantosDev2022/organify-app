'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui';
import { DollarSign, CheckCircle, TrendingDown, Clock, LucideIcon } from 'lucide-react';
import { DebtWithPaidInfo } from '@/app/actions/debt-actions';
import { DebtPaymentsList } from './DebtPaymentsList';
import { formatCurrency } from '@/lib/formatters';
import { formatDate } from 'date-fns';
import { AddPaymentButton } from './AddPaymentButton';
import { DebtActionsMenu } from './DebtActionsMenu';
import { UpdateDebtFormValues } from '@/hooks/debts/use-update-debt-form';
import { JSX } from 'react';


interface DebtItemProps {
  debt: DebtWithPaidInfo;
}

/**
 * @component
 * @description Exibe uma dívida individual como um item de `Accordion`.
 * Inclui um resumo visual (Cards), histórico de pagamentos e botões de ação (Editar/Excluir/Adicionar Pagamento).
 * @param {DebtItemProps} props Os dados completos da dívida, incluindo o status de pagamento.
 * @param {DebtWithPaidInfo} props.debt Os dados completos da dívida, incluindo o status de pagamento.
 * @returns {JSX.Element} O item de Acordeão para a dívida.
 */
export function DebtItem({ debt }: DebtItemProps): JSX.Element {
  // Cálculos de Resumo
  const remainingAmount = debt.remainingAmount;
  const remainingPercentage = Math.round((remainingAmount / debt.totalAmount) * 100);
  const paidPercentage = 100 - remainingPercentage;
  const isPaidOff = debt.isPaidOff || remainingAmount <= 0;

  // Dados formatados para o EditDebtForm, passados via DebtActionsMenu
  const defaultEditValues: UpdateDebtFormValues = {
    description: debt.description,
    totalAmount: debt.totalAmount,
    // Converte null para undefined para compatibilidade com o hook form
    installments: debt.installments ?? undefined,
    // Converte para Date se existir (new Date() é seguro, mesmo se for string ISO)
    dueDate: debt.dueDate ? new Date(debt.dueDate) : undefined,
    category: debt.category ?? undefined,
  };

  interface CardData {
    title: string;
    value: string;
    icon: LucideIcon;
    bgColor: string;
    textColor: string;
  }

  const cardsData: CardData[] = [
    {
      title: "Dívida Inicial",
      value: formatCurrency(debt.totalAmount),
      icon: DollarSign,
      bgColor: 'bg-warning/80 border-l-4 border-yellow-800',
      textColor: 'text-warning-foreground',
    },
    {
      title: "Saldo Devedor",
      value: formatCurrency(remainingAmount),
      icon: TrendingDown,
      bgColor: isPaidOff ? 'bg-destructive/50 border-l-4 border-red-800' : 'bg-destructive/50 border-l-4 border-red-800',
      textColor: isPaidOff ? 'text-destructive-foreground' : 'text-destructive-foreground',
    },

    {
      title: "Já Pago",
      value: `${formatCurrency(debt.amountPaid)} (${paidPercentage}%)`,
      icon: CheckCircle,
      bgColor: 'bg-success/50 border-l-4 border-green-800',
      textColor: 'text-success-foreground',
    },
    {
      title: "Próx. Vencimento",
      value: debt.dueDate ? formatDate(new Date(debt.dueDate), 'dd/MM/yyyy') : 'N/A',
      icon: Clock,
      bgColor: 'bg-accent border-l-4 border-gray-700',
      textColor: 'text-accent-foreground',
    },
  ];

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={debt.id} className="border-border bg-card rounded-lg px-4 shadow-xl">

        <div className="flex justify-between items-center w-full">

          {/* 1. O AccordionTrigger (o botão que expande/recolhe) */}
          {/* Ele agora contém APENAS o título e o indicador de expansão */}
          <AccordionTrigger className="hover:no-underline py-4 grow">
            <span className="font-semibold text-lg flex items-center pr-4">
              {debt.description}
              {isPaidOff && <span className="ml-3 text-sm text-success">(Quitada)</span>}
            </span>
          </AccordionTrigger>

          <div
            className="flex items-center space-x-4 pr-4"
            // Impede que o clique nas ações acione a expansão/recolha do Accordion
            onClick={(e) => e.stopPropagation()}
          >
            {/* Valor Devedor */}
            <div className="text-right text-lg font-bold text-destructive">
              {formatCurrency(remainingAmount)}
            </div>

            <DebtActionsMenu
              debtId={debt.id}
              description={debt.description}
              defaultEditValues={defaultEditValues}
            />

          </div>
        </div>
        {/* FIM DA CORREÇÃO */}

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
                  <CardTitle className="text-sm font-medium">
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
            <h3 className="text-lg font-semibold">Histórico de Pagamentos</h3>
            <AddPaymentButton debtId={debt.id} description={debt.description} />
          </div>

          {/* Lista de Pagamentos */}
          <DebtPaymentsList
            debtId={debt.id}
            payments={debt.payments}
            totalAmount={debt.totalAmount}
          />

        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
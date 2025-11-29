// components/SummaryCards.tsx
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton
} from "@/components/ui";
import { formatCurrency } from "@/lib/formatters";
import { useGetRunningBalance, useGetSummary } from "@/hooks/transactions";

import {
  TrendingUp,
  Receipt,
  ShoppingCart,
  Scale,
  Wallet,
  Briefcase,
} from "lucide-react";
import React from "react";

interface SummaryCardsProps {
  selectedMonth: Date;
}

export function SummaryCards({ selectedMonth }: SummaryCardsProps) {
  const { summary, isLoading: isLoadingSummary } = useGetSummary(selectedMonth);

  const { data: runningBalanceData, isLoading: isLoadingBalance } =
    useGetRunningBalance(selectedMonth);

  // DESESTRUTURAÇÃO CORRETA:
  const runningBalance = runningBalanceData?.runningBalance; // Saldo de Fluxo de Caixa Acumulado
  const investmentAccumulated = runningBalanceData?.investmentTotal; // Total Investido Acumulado


  // Função auxiliar para renderizar o card
  const renderCard = (
    title: string,
    value: number | undefined,
    colorClasses: string,
    isLoading: boolean,
    IconComponent: React.ElementType

  ) => {
    // ... (renderCard code)
    return (
      <Card className={colorClasses}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm sm:text-base font-medium">{title}</CardTitle>
            <IconComponent className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-3/4" />
          ) : (
            <p className="text-2xl sm:text-3xl font-bold">
              {formatCurrency(value || 0)}
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      {renderCard(
        "Receitas", summary?.income, "text-success bg-success/10 border-success/20", isLoadingSummary, TrendingUp
      )}
      {renderCard(
        "Despesas Fixas", summary?.fixedExpense, "text-destructive bg-destructive/10 border-destructive/20", isLoadingSummary, Receipt,
      )}
      {renderCard(
        "Despesas Variáveis", summary?.variableExpense, "text-warning bg-warning/10 border-warning/20", isLoadingSummary, ShoppingCart
      )}

      {renderCard(
        "Saldo mês atual", summary?.balance, "text-success bg-success/10 border-success/20", isLoadingSummary, Scale
      )}

      {renderCard(
        "Saldo Acumulado",
        runningBalance, // <-- Valor do Saldo Acumulado (Exclui Investimento)
        "text-foreground bg-card border-border",
        isLoadingBalance,
        Wallet
      )}

      {renderCard(
        "Total Investido",
        investmentAccumulated, // <-- Valor do Total Investido Acumulado
        "text-primary bg-primary/10 border-primary/20",
        isLoadingBalance,
        Briefcase
      )}
    </section>
  );
}
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
} from "lucide-react";
import React from "react";

interface SummaryCardsProps {
  selectedMonth: Date;
}

export function SummaryCards({ selectedMonth }: SummaryCardsProps) {
  const { summary, isLoading: isLoadingSummary } = useGetSummary(selectedMonth);
  const { balance: runningBalance, isLoading: isLoadingBalance } =
    useGetRunningBalance(selectedMonth);

  // Função auxiliar para renderizar o card
  const renderCard = (
    title: string,
    value: number | undefined,
    colorClasses: string,
    isLoading: boolean,
    IconComponent: React.ElementType

  ) => {
    return (
      <Card className={colorClasses}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <IconComponent className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-3/4" />
          ) : (
            <p className="text-2xl font-bold">
              {formatCurrency(value || 0)}
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
      {renderCard(
        "Receitas",
        summary?.income,
        "text-success bg-success/10 border-success/20",
        isLoadingSummary,
        TrendingUp
      )}
      {renderCard(
        "Despesas Fixas",
        summary?.fixedExpense,
        "text-destructive bg-destructive/10 border-destructive/20",
        isLoadingSummary,
        Receipt,
      )}
      {renderCard(
        "Despesas Variáveis",
        summary?.variableExpense,
        "text-warning bg-warning/10 border-warning/20",
        isLoadingSummary,
        ShoppingCart
      )}
      {/*  {renderCard(
        "Investimentos",
        summary?.investment,
        "text-primary bg-primary/10 border-primary/20",
        isLoadingSummary,
        Briefcase
      )} */}
      {renderCard(
        "Saldo mês atual",
        summary?.balance,
        "text-success bg-success/10 border-success/20",
        isLoadingSummary,
        Scale
      )}

      {renderCard(
        "Saldo Acumulado", // <-- Novo card
        runningBalance, // <-- Valor do novo hook
        "text-foreground bg-card border-border", // <-- Cor neutra
        isLoadingBalance,
        Wallet
      )}
    </section>
  );
}
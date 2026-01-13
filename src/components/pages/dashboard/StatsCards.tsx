"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Receipt, ShoppingCart, Wallet, Briefcase } from "lucide-react";
import { useGetSummary, useGetRunningBalance } from "@/hooks/transactions";
import { formatCurrency } from "@/lib/formatters";

interface StatsCardsProps {
  selectedMonth: Date;
  isFiltered: boolean;
}

export function StatsCards({ selectedMonth }: StatsCardsProps) {
  const { summary } = useGetSummary(selectedMonth);
  const { data: balanceData } = useGetRunningBalance(selectedMonth);

  const stats = [
    { title: "Receitas", value: summary?.income, change: summary?.fixedExpense, icon: TrendingUp, color: "border-l-emerald-500", type: "income" },
    { title: "Desp. Fixas", value: summary?.fixedExpense, change: summary?.fixedExpense, icon: Receipt, color: "border-l-rose-500", type: "expense" },
    { title: "Desp. Variáveis", value: summary?.variableExpense, change: summary?.variableExpense, icon: ShoppingCart, color: "border-l-orange-500", type: "expense" },
    { title: "Saldo Acumulado", value: balanceData?.runningBalance, icon: Wallet, color: "border-l-blue-500", type: "balance" },
    { title: "Total Investido", value: balanceData?.investmentTotal, icon: Briefcase, color: "border-l-violet-500", type: "investment" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((item) => {
        return (
          <Card key={item.title} className={`border-l-4 ${item.color} rounded-xl shadow-sm`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase opacity-60">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{formatCurrency(item.value || 0)}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
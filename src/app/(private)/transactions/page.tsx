'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { MonthSelector, TransactionTabContent } from "@/components/pages/transactions";
import { MdAttachMoney } from "react-icons/md";

import {
  ReceiptText,
  Receipt,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { TransactionType } from "@prisma/client";
import { startOfMonth } from "date-fns";

export default function TransactionPage() {
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="flex items-center justify-between w-full border border-white/10 p-4 bg-card rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-success/10 rounded-lg">
            <MdAttachMoney className="w-6 h-6 text-success" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Minhas transações</h2>
        </div>
        <MonthSelector
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
      </div>

      {/* Sistema de Abas (Tabs) */}
      <section>
        <Tabs defaultValue="income" className="w-full">
          <TabsList className="w-full flex justify-start gap-2 bg-transparent h-auto p-0 mb-6 overflow-x-auto">
            <TabsTrigger
              value="income"
              className="data-[state=active]:bg-muted px-4 py-2 rounded-full border border-transparent data-[state=active]:border-border"
            >
              <ReceiptText className="mr-2 h-4 w-4 text-emerald-500" />
              Receitas
            </TabsTrigger>

            <TabsTrigger
              value="fixed-expenses"
              className="data-[state=active]:bg-muted px-4 py-2 rounded-full border border-transparent data-[state=active]:border-border"
            >
              <Receipt className="mr-2 h-4 w-4 text-red-400" />
              Despesas Fixas
            </TabsTrigger>

            <TabsTrigger
              value="variable-expenses"
              className="data-[state=active]:bg-muted px-4 py-2 rounded-full border border-transparent data-[state=active]:border-border"
            >
              <Receipt className="mr-2 h-4 w-4 text-orange-400" />
              Despesas Variáveis
            </TabsTrigger>

            <TabsTrigger
              value="investments"
              className="data-[state=active]:bg-muted px-4 py-2 rounded-full border border-transparent data-[state=active]:border-border"
            >
              <TrendingUp className="mr-2 h-4 w-4 text-blue-400" />
              Investimentos
            </TabsTrigger>
          </TabsList>

          {/* Conteúdo das Abas */}
          <div className="mt-4">
            <TabsContent value="income">
              <TransactionTabContent
                type={TransactionType.INCOME}
                title="Receitas"
                selectedMonth={selectedMonth}
              />
            </TabsContent>

            <TabsContent value="fixed-expenses">
              <TransactionTabContent
                type={TransactionType.FIXED_EXPENSE}
                title="Despesas Fixas"
                selectedMonth={selectedMonth}
              />
            </TabsContent>

            <TabsContent value="variable-expenses">
              <TransactionTabContent
                type={TransactionType.VARIABLE_EXPENSE}
                title="Despesas Variáveis"
                selectedMonth={selectedMonth}
              />
            </TabsContent>

            <TabsContent value="investments">
              <TransactionTabContent
                type={TransactionType.INVESTMENT}
                title="Investimentos"
                selectedMonth={selectedMonth}
              />
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </div>
  );
}
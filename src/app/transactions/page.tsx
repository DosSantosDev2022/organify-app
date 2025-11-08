'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { SummaryCards, MonthSelector, TransactionTabContent } from "@/components/pages/transactions";
import {
  ReceiptText,
  Receipt,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { TransactionType } from "@prisma/client";
import { startOfMonth } from "date-fns";
import { Header } from "@/components/global";

export default function TransactionPage() {
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
  return (
    <main className="container mx-auto p-8">
      {/* Cabeçalho (sem alteração) */}
      <Header />

      {/* --- NOVO COMPONENTE --- */}
      <MonthSelector
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />

      {/* --- ATUALIZADO: Passa o selectedMonth --- */}
      <SummaryCards selectedMonth={selectedMonth} />

      {/* Sistema de Abas (Tabs) */}
      <section>
        <Tabs defaultValue="income">
          <TabsList>
            {/* ... TabsTriggers (sem alteração) ... */}
            <TabsTrigger value="income">
              <ReceiptText className="mr-2 h-4 w-4" />
              Receitas
            </TabsTrigger>
            <TabsTrigger value="fixed-expenses">
              <Receipt className="mr-2 h-4 w-4" />
              Despesas Fixas
            </TabsTrigger>
            <TabsTrigger value="variable-expenses">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Despesas Variáveis
            </TabsTrigger>
            <TabsTrigger disabled value="investments">
              <TrendingUp className="mr-2 h-4 w-4" />
              Investimentos
            </TabsTrigger>
          </TabsList>

          {/* --- ATUALIZADO: Passa o selectedMonth para cada aba --- */}
          <TabsContent value="income" className="mt-4">
            <TransactionTabContent
              type={TransactionType.INCOME}
              title="Receitas"
              selectedMonth={selectedMonth}
            />
          </TabsContent>

          <TabsContent value="fixed-expenses" className="mt-4">
            <TransactionTabContent
              type={TransactionType.FIXED_EXPENSE}
              title="Despesas Fixas"
              selectedMonth={selectedMonth}
            />
          </TabsContent>

          <TabsContent value="variable-expenses" className="mt-4">
            <TransactionTabContent
              type={TransactionType.VARIABLE_EXPENSE}
              title="Despesas Variáveis"
              selectedMonth={selectedMonth}
            />
          </TabsContent>

          <TabsContent value="investments" className="mt-4">
            <TransactionTabContent
              type={TransactionType.INVESTMENT}
              title="Investimentos"
              selectedMonth={selectedMonth}
            />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
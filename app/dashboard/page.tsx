// src/app/(dashboard)/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, DollarSign, Percent } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo de volta! Aqui está o resumo das suas finanças.</p>
      </div>

      {/* Grid de Estatísticas Rápidas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Geral</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 12.450,00</div>
            <p className="text-xs text-muted-foreground mt-1">+2.1% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">+ R$ 5.200,00</div>
            <p className="text-xs text-muted-foreground mt-1">Meta mensal 84% concluída</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">- R$ 1.850,20</div>
            <p className="text-xs text-muted-foreground mt-1">Limite do orçamento: R$ 3.000,00</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economizado</CardTitle>
            <Percent className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35,5%</div>
            <p className="text-xs text-muted-foreground mt-1">Taxa de poupança atual</p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder para os Gráficos ou Transações Recentes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 h-87.5 flex items-center justify-center border-dashed">
          <p className="text-muted-foreground text-sm">[Área do Gráfico de Fluxo de Caixa]</p>
        </Card>
        <Card className="col-span-3 h-87.5 flex items-center justify-center border-dashed">
          <p className="text-muted-foreground text-sm">[Lista de Transações Recentes]</p>
        </Card>
      </div>
    </div>
  );
}
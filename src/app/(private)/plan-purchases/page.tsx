// app/planejar-compras/page.tsx
"use client";
import { ChevronLeft, ChevronRight, Trash2, Loader2, CheckCircle, Edit, PlusCircle } from "lucide-react";

// Componentes Shadcn
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Novo componente de Formulário
import { PlannedPurchaseFormDialog } from "@/components/pages/planned-purchases/PlannedPurchaseFormDialog"; // Ajuste o caminho

// Hook Controller
import { usePlannedPurchasesController } from "@/hooks/planned-purchases/use-planned-purchases-controller";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui";
import { useMemo } from "react";
import { PlannedPurchase } from "@prisma/client";

export default function PlanejarComprasPage() {
  // Chamada única do hook
  const {
    items, isLoading,
    totalPlanned, totalPurchased, purchasedCount,
    isDialogOpen,
    setIsDialogOpen,
    currentDate: selectedMonth,
    currentMonthFormatted, handlePrevMonth, handleNextMonth,
    formatCurrency, toggleStatus, itemToDeleteId,
    handleDeleteItemClick,
    handleDeleteConfirmation,
    handleCancelDelete,
    itemToEdit,
    handleEditItem,
    handleNewItemClick
  } = usePlannedPurchasesController();

  const itemToDelete = useMemo(() => {
    return items.find(item => item.id === itemToDeleteId);
  }, [items, itemToDeleteId]);


  return (
    <div className="p-6 space-y-6 text-foreground bg-background min-h-screen">

      {/* --- Cabeçalho e Navegação (Inalterados) --- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planejar Compras</h1>
          <p className="text-muted-foreground">Organize seus objetivos de compra mês a mês.</p>
        </div>

        <div className="flex items-center gap-4 p-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="font-semibold text-lg capitalize w-48 text-center block">
            {currentMonthFormatted}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextMonth}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* --- Cards de Resumo (Inalterados) --- */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Planejado</CardTitle>
            <span className="text-muted-foreground">R$</span>
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <div className="text-2xl font-bold">{formatCurrency(totalPlanned)}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-emerald-950/20 border-emerald-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-500">Já Comprado</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-emerald-500" /> : (
              <>
                <div className="text-2xl font-bold text-emerald-500">{formatCurrency(totalPurchased)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {purchasedCount} itens concluídos
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* --- BOTÃO DE AÇÃO (Renderiza o Novo Componente) --- */}
      <div className="flex justify-end">
        <Button onClick={handleNewItemClick} className="gap-2">
          <PlusCircle className="h-4 w-4" /> Novo Plano
        </Button>

        <PlannedPurchaseFormDialog
          isDialogOpen={isDialogOpen}
          selectedMonth={selectedMonth}
          setIsDialogOpen={setIsDialogOpen} // Chama o handler de fechar/limpar
          initialData={itemToEdit} // Item para pré-preencher em caso de edição
        />
      </div>

      {/* --- Tabela: Agora com Edição na Linha --- */}
      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Item</TableHead>
              <TableHead>Prazo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="text-center w-[150px]">Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="inline mr-2 h-4 w-4 animate-spin" /> Carregando planos...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Nenhum plano encontrado para este mês.</TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow
                  key={item.id}
                  className={item.status === 'PURCHASED' ? 'bg-muted/30' : 'cursor-pointer hover:bg-muted/50'}
                >
                  {/* Células de dados que podem disparar a edição ao clicar */}
                  <TableCell onClick={() => handleEditItem(item)} className="cursor-pointer">
                    <div className="flex flex-col">
                      <span className={`font-medium ${item.status === 'PURCHASED' ? 'line-through text-muted-foreground' : ''}`}>
                        {item.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </div>
                  </TableCell>
                  <TableCell onClick={() => handleEditItem(item)} className="text-sm cursor-pointer">
                    {new Date(item.deadline).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </TableCell>
                  <TableCell onClick={() => handleEditItem(item)} className="font-medium cursor-pointer">{formatCurrency(item.amount)}</TableCell>

                  <TableCell className="text-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleStatus(item.id); }} // Impedir edição na linha
                      className="cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 rounded-full"
                      title="Clique para alterar status"
                      type="button"
                    >
                      {item.status === 'PURCHASED' ? (
                        <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 pointer-events-none">Comprado</Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600/50 hover:bg-yellow-600/10 pointer-events-none">Pendente</Badge>
                      )}
                    </button>
                  </TableCell>


                  <TableCell className="text-right space-x-2">
                    {/* Botão de Edição explícito */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation(); // Impedir a edição da linha
                        handleEditItem(item);
                      }}
                      title="Editar item"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    {/* Botão de Deleção */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation(); // Impedir a edição da linha
                        handleDeleteItemClick(item.id)
                      }}
                      className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                      title="Excluir item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- ALERT DIALOG DE CONFIRMAÇÃO --- */}
      <AlertDialog open={!!itemToDeleteId} onOpenChange={(open) => !open && handleCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Você está prestes a remover permanentemente o item: **{itemToDelete?.name || 'Item Desconhecido'}**.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={handleCancelDelete}>
                Cancelar
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={handleDeleteConfirmation}>
                Sim, excluir
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
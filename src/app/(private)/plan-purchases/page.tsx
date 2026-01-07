"use client";

import {
  ChevronLeft, ChevronRight, Trash2, Loader2, CheckCircle,
  Edit, PlusCircle, ShoppingBag, Calendar, ListChecks
} from "lucide-react";

// Componentes Shadcn
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Novo componente de Formulário
import { PlannedPurchaseFormDialog } from "@/components/pages/planned-purchases/PlannedPurchaseFormDialog";

// Hook Controller
import { usePlannedPurchasesController } from "@/hooks/planned-purchases/use-planned-purchases-controller";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle
} from "@/components/ui";
import { useMemo } from "react";

export default function PlanejarComprasPage() {
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
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 bg-card border rounded-2xl shadow-sm gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Planejar Compras</h1>
            <p className="text-sm text-muted-foreground">Organize seus objetivos de compra mês a mês</p>
          </div>
        </div>

        {/* NAVEGAÇÃO DE MÊS */}
        <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-xl border w-full lg:w-auto justify-between lg:justify-start">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="hover:bg-background">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 px-2 min-w-[140px] justify-center">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-semibold capitalize">{currentMonthFormatted}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleNextMonth} className="hover:bg-background">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* --- CARDS DE RESUMO --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Planejado */}
        <div className="p-6 rounded-2xl border bg-blue-500/5 border-blue-500/20 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-12 h-12 text-blue-500" />
          </div>
          <p className="text-sm font-medium text-blue-500 uppercase tracking-wider mb-1">Total Planejado</p>
          <div className="flex items-baseline gap-1">
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-blue-500" /> : (
              <span className="text-3xl font-bold">{formatCurrency(totalPlanned)}</span>
            )}
          </div>
        </div>

        {/* Já Comprado */}
        <div className="p-6 rounded-2xl border bg-emerald-500/5 border-emerald-500/20 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-emerald-500 uppercase tracking-wider mb-1">Já Comprado</p>
          <div className="flex flex-col">
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-emerald-500" /> : (
              <>
                <span className="text-3xl font-bold text-emerald-500">{formatCurrency(totalPurchased)}</span>
                <span className="text-xs font-medium text-muted-foreground mt-1 flex items-center gap-1">
                  <ListChecks className="w-3 h-3" /> {purchasedCount} itens concluídos
                </span>
              </>
            )}
          </div>
        </div>

        {/* Botão de Adicionar*/}
        <button
          type="button"
          onClick={handleNewItemClick}
          className="p-6 rounded-2xl cursor-pointer border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group"
        >
          <PlusCircle className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="font-semibold text-muted-foreground group-hover:text-primary">Novo Plano de Compra</span>
        </button>
      </div>

      {/* --- LISTAGEM DE ITENS --- */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <div className="w-1.5 h-5 bg-primary rounded-full" />
          <h2 className="text-xl font-semibold">Itens do Planejamento</h2>
        </div>

        {/* TABELA DESKTOP */}
        <div className="hidden md:block rounded-2xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[40%]">Item</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="h-32 text-center"><Loader2 className="inline h-6 w-6 animate-spin text-primary" /></TableCell></TableRow>
              ) : items.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">Nenhum plano encontrado para este mês.</TableCell></TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className={`font-bold text-base ${item.status === 'PURCHASED' ? 'line-through text-muted-foreground/60' : ''}`}>
                          {item.name}
                        </span>
                        <span className="text-xs text-muted-foreground italic">{item.description}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {new Date(item.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </TableCell>
                    <TableCell className="font-bold text-lg">{formatCurrency(item.amount)}</TableCell>
                    <TableCell className="text-center">
                      <button
                        type="button"
                        onClick={() => toggleStatus(item.id)}
                        className="transition-transform active:scale-95"
                      >
                        {item.status === 'PURCHASED' ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 px-3 py-1">Comprado</Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 px-3 py-1">Pendente</Badge>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditItem(item)} className="h-9 w-9">
                          <Edit className="h-4 w-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteItemClick(item.id)} className="h-9 w-9 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <PlannedPurchaseFormDialog
        isDialogOpen={isDialogOpen}
        selectedMonth={selectedMonth}
        setIsDialogOpen={setIsDialogOpen}
        initialData={itemToEdit}
      />

      {/* ALERT DIALOG */}
      <AlertDialog open={!!itemToDeleteId} onOpenChange={(open) => !open && handleCancelDelete()}>
        <AlertDialogContent className="rounded-2xl border-2">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Confirmar exclusão?</AlertDialogTitle>
            <AlertDialogDescription>
              O item <strong className="text-foreground">{itemToDelete?.name}</strong> será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={handleDeleteConfirmation} className="rounded-xl px-8">Excluir</Button>
            </AlertDialogAction>
            <AlertDialogCancel asChild>
              <Button variant="ghost" className="rounded-xl">Cancelar</Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
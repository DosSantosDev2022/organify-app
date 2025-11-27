// app/planejar-compras/page.tsx
"use client";
import { ChevronLeft, ChevronRight, Trash2, Loader2, CheckCircle, Edit, PlusCircle } from "lucide-react";

// Componentes Shadcn
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Novo componente de Formulário
import { PlannedPurchaseFormDialog } from "@/components/pages/planned-purchases/PlannedPurchaseFormDialog";

// Hook Controller
import { usePlannedPurchasesController } from "@/hooks/planned-purchases/use-planned-purchases-controller";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui";
import { useMemo } from "react";

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
    <div className="p-4 md:p-6 space-y-6 text-foreground bg-background min-h-screen">
      {/* Ajuste: p-4 em mobile, p-6 em desktop */}

      {/* --- Cabeçalho e Navegação: FLEX-WRAP em Mobile --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Bloco do Título */}
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Planejar Compras</h1> {/* Tamanho de texto ajustado */}
          <p className="text-sm text-muted-foreground">Organize seus objetivos de compra mês a mês.</p>
        </div>

        {/* Bloco de Navegação */}
        <div className="flex items-center justify-between sm:justify-end gap-4 p-1 sm:p-2 w-full sm:w-auto">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="font-semibold text-base md:text-lg capitalize text-center block truncate">
            {currentMonthFormatted}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextMonth}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* --- Cards de Resumo: GRID RESPONSIVO --- */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-3"> {/* Alterado de 2 colunas para 3 a partir de md */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total Planejado</CardTitle>
            <span className="text-muted-foreground">R$</span>
          </CardHeader>
          <CardContent className="pt-2 md:pt-3">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <div className="text-xl md:text-2xl font-bold">{formatCurrency(totalPlanned)}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-success/20 dark:bg-success/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Já Comprado</CardTitle>
            <CheckCircle className="h-4 w-4 text-success-foreground" />
          </CardHeader>
          <CardContent className="pt-2 md:pt-3">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-emerald-500" /> : (
              <>
                <div className="text-xl md:text-2xl font-bold text-success-foreground">{formatCurrency(totalPurchased)}</div>
                <p className="text-xs text-foreground mt-1">
                  {purchasedCount} itens concluídos
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* --- BOTÃO DE AÇÃO: Sempre visível, alinhado à direita --- */}
      <div className="flex justify-end">
        <Button onClick={handleNewItemClick} className="gap-2 w-full sm:w-auto"> {/* w-full em mobile */}
          <PlusCircle className="h-4 w-4" /> Novo Plano
        </Button>

        <PlannedPurchaseFormDialog
          isDialogOpen={isDialogOpen}
          selectedMonth={selectedMonth}
          setIsDialogOpen={setIsDialogOpen}
          initialData={itemToEdit}
        />
      </div>

      {/* --- TABELA DE ITENS (Desktop/Tablet) --- */}
      <div className="hidden md:block rounded-md border border-border bg-card">
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
            {/* Conteúdo da tabela (inalterado) */}
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
                  {/* Células da Tabela (inalteradas, mas ocultas em mobile) */}
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
                      onClick={(e) => { e.stopPropagation(); toggleStatus(item.id); }}
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditItem(item);
                      }}
                      title="Editar item"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
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

      {/* --- CARDS DE ITENS (Mobile) --- */}
      <div className="md:hidden flex flex-col gap-3">
        {/* Adiciona o estado de carregamento/vazio também para mobile */}
        {isLoading ? (
          <div className="h-24 text-center flex items-center justify-center">
            <Loader2 className="inline mr-2 h-4 w-4 animate-spin" /> Carregando planos...
          </div>
        ) : items.length === 0 ? (
          <p className="h-24 text-center text-muted-foreground pt-8">Nenhum plano encontrado para este mês.</p>
        ) : (
          items.map((item) => (
            // biome-ignore lint/a11y/useButtonType: <explanation>
            <button
              key={item.id}
              className={`border rounded-lg p-4 shadow-sm ${item.status === 'PURCHASED' ? 'bg-muted/30 border-green-200/50' : 'bg-card'}`}
              onClick={() => handleEditItem(item)} // Clica no card para editar
            >
              <div className="flex justify-between items-start mb-2">
                {/* Nome e Descrição */}
                <div className="flex flex-col overflow-hidden mr-4">
                  <span className={`font-semibold ${item.status === 'PURCHASED' ? 'line-through text-muted-foreground' : ''} truncate`}>
                    {item.name}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">{item.description}</span>
                </div>
                {/* Status e Valor */}
                <div className="text-right flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleStatus(item.id); }}
                    className="mb-1 cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 rounded-full"
                    title="Clique para alterar status"
                    type="button"
                  >
                    {item.status === 'PURCHASED' ? (
                      <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-xs">Comprado</Badge>
                    ) : (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600/50 hover:bg-yellow-600/10 text-xs">Pendente</Badge>
                    )}
                  </button>
                  <span className="block font-bold text-base">{formatCurrency(item.amount)}</span>
                </div>
              </div>

              {/* Rodapé do Card: Prazo e Ações */}
              <div className="flex justify-between items-center border-t border-border pt-2 mt-2">
                <span className="text-xs text-muted-foreground">
                  Prazo: {new Date(item.deadline).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </span>

                <div className="flex space-x-1 flex-shrink-0">
                  {/* Botão de Edição explícito (pode ser redundante, mas é bom ter) */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditItem(item);
                    }}
                    title="Editar item"
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  {/* Botão de Deleção */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItemClick(item.id)
                    }}
                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    title="Excluir item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </button>
          ))
        )}
      </div>


      {/* --- ALERT DIALOG DE CONFIRMAÇÃO (INALETRADO) --- */}
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
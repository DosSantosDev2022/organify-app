"use client"
import { Trash2, Edit, Plus, Loader2, Tag, ListFilter, TrendingUp, Receipt, ShoppingCart, Banknote } from "lucide-react";
import {
  Button, Input, Label, Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow, Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  Badge,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui";
import { formatCategoryType } from '@/utils/formatters';
import { useCategoryController } from '@/hooks/categories/use-category-controller';

// 1. Configuração de Estilos por Tipo de Categoria
const CATEGORY_STYLES = {
  INCOME: {
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    icon: <Banknote className="w-4 h-4" />
  },
  FIXED_EXPENSE: {
    color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    icon: <Receipt className="w-4 h-4" />
  },
  VARIABLE_EXPENSE: {
    color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    icon: <Receipt className="w-4 h-4" />
  },
  INVESTMENT: {
    color: "text-sky-500 bg-sky-500/10 border-sky-500/20",
    icon: <TrendingUp className="w-4 h-4" />
  }
};

const categoryTypeOptions = [
  { value: "INCOME", label: "Receita" },
  { value: "FIXED_EXPENSE", label: "Despesa Fixa" },
  { value: "VARIABLE_EXPENSE", label: "Despesa Variável" },
  { value: "INVESTMENT", label: "Investimento" },
];

export default function CategoriesPage() {
  const {
    categoriesList, isLoading,
    isDialogOpen, newCategoryName, setNewCategoryName,
    newCategoryType, setNewCategoryType, editingCategory,
    isAlertOpen, categoryToDelete, isMutating,
    deleteIsPending,
    handleCloseDialog, handleEditClick, handleAddOrUpdateCategory,
    handleDeleteClick, handleConfirmDelete, handleCloseAlert,
  } = useCategoryController();

  if (isLoading) {
    return (
      <div className="container mx-auto py-20 flex flex-col justify-center items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Carregando categorias...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">

      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-card border rounded-2xl shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Categorias</h1>
            <p className="text-sm text-muted-foreground">Gerencie como você classifica suas finanças</p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => handleEditClick(null)} disabled={isMutating} className="w-full md:w-auto shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Categoria
            </Button>
          </DialogTrigger>
          {/* ... DialogContent se mantém igual, apenas ajuste no UI se desejar ... */}
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {editingCategory ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingCategory ? "Editar Categoria" : "Nova Categoria"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="category-name">Nome</Label>
                <Input
                  id="category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Ex: Aluguel, Salário, Lazer"
                  className="bg-muted/50"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="category-type-select">Tipo</Label>
                <Select value={newCategoryType} onValueChange={setNewCategoryType}>
                  <SelectTrigger id="category-type-select">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddOrUpdateCategory} disabled={isMutating} className="w-full">
                {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingCategory ? "Salvar Alterações" : "Criar Categoria"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* TABELA (DESKTOP) */}
      <div className="hidden md:block border rounded-xl overflow-hidden bg-card">
        <div className="relative overflow-y-auto max-h-[60vh] scrollbar-thin">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted/90 backdrop-blur-sm">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-bold text-foreground py-4">Nome da Categoria</TableHead>
                <TableHead className="font-bold text-foreground py-4">Tipo de Fluxo</TableHead>
                <TableHead className="text-right font-bold text-foreground py-4 px-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoriesList.map((category) => {
                const style = CATEGORY_STYLES[category.type as keyof typeof CATEGORY_STYLES] || CATEGORY_STYLES.VARIABLE_EXPENSE;
                return (
                  <TableRow key={category.id} className="group transition-colors hover:bg-muted/30">
                    <TableCell className="font-medium py-4">{category.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`flex items-center gap-2 w-fit py-1 px-3 border ${style.color}`}>
                        {style.icon}
                        {formatCategoryType(category.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1 px-6">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(category)} className="hover:bg-blue-500/10 hover:text-blue-500">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(category)} className="hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* CARDS (MOBILE) */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {categoriesList.map((category) => {
          const style = CATEGORY_STYLES[category.type as keyof typeof CATEGORY_STYLES] || CATEGORY_STYLES.VARIABLE_EXPENSE;
          return (
            <div key={category.id} className="flex items-center justify-between border bg-card p-4 rounded-xl shadow-sm">
              <div className="flex flex-col gap-2">
                <span className="font-bold text-lg">{category.name}</span>
                <Badge variant="outline" className={`flex items-center gap-1.5 w-fit border ${style.color}`}>
                  {style.icon}
                  {formatCategoryType(category.type)}
                </Badge>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" onClick={() => handleEditClick(category)} className="rounded-full">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDeleteClick(category)} className="rounded-full text-destructive border-destructive/20">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {categoriesList.length === 0 && !isLoading && (
        <div className="text-center py-20 border-2 border-dashed rounded-2xl">
          <ListFilter className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium">Nenhuma categoria encontrada</h3>
          <p className="text-muted-foreground italic">Comece adicionando uma categoria para organizar seus lançamentos.</p>
        </div>
      )}

      {/* ALERT DIALOG - Mantido mas com botão de delete mais visível */}
      <AlertDialog open={isAlertOpen} onOpenChange={handleCloseAlert}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso removerá a categoria <strong className="text-foreground">{categoryToDelete?.name}</strong>.
              As transações ligadas a ela ficarão sem categoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={deleteIsPending} className="bg-destructive hover:bg-destructive/90 rounded-xl">
              {deleteIsPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
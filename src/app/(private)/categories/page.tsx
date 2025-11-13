"use client"
import { Trash2, Edit, Plus, Loader2 } from "lucide-react";
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

const categoryTypeOptions = [
  { value: "INCOME", label: "Receita" },
  { value: "FIXED_EXPENSE", label: "Despesa Fixa" },
  { value: "VARIABLE_EXPENSE", label: "Despesa Variável" },
  { value: "INVESTMENT", label: "Investimento" },
];



const CategoriesPage = () => {
  const {
    categoriesList, isLoading,
    isDialogOpen, newCategoryName, setNewCategoryName,
    newCategoryType, setNewCategoryType, editingCategory,
    isAlertOpen, categoryToDelete, isMutating,
    deleteIsPending, deleteMutationVariables,
    handleCloseDialog, handleEditClick, handleAddOrUpdateCategory,
    handleDeleteClick, handleConfirmDelete, handleCloseAlert,
  } = useCategoryController();

  // --- Renderização do Componente ---

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <p>Carregando categorias...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Categorias</h1>

        {/* MODAL DE ADIÇÃO/EDIÇÃO */}
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => handleEditClick(null)} disabled={isMutating}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Categoria
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Editar Categoria" : "Adicionar Nova Categoria"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Campo Nome */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category-name" className="text-right">Nome</Label>
                <Input
                  id="category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="col-span-3"
                  placeholder="Ex: Aluguel, Salário, Lazer"
                />
              </div>

              {/* Campo Tipo (Select) */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="category-type-select">
                  Tipo
                </Label>

                <Select
                  value={newCategoryType}
                  onValueChange={setNewCategoryType}
                >
                  <SelectTrigger id="category-type-select" className="col-span-3 w-full">
                    <SelectValue placeholder="Selecione o Tipo de Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryTypeOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                onClick={handleAddOrUpdateCategory}
                disabled={isMutating}
              >
                {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingCategory ? "Salvar Alterações" : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 2. Tabela de Categorias */}
      <div className="border rounded-lg overflow-y-auto max-h-[70vh] scrollbar-custom ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoriesList.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <Badge className={` ${category.type.includes("INCOME")
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}>
                    {formatCategoryType(category.type)}
                  </Badge>
                </TableCell>

                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(category)}
                    disabled={isMutating}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(category)}
                    disabled={isMutating}
                  >
                    {deleteIsPending && deleteMutationVariables?.id === category.id
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Trash2 className="h-4 w-4 text-destructive" />
                    }
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mensagem de Categoria Vazia */}
      {categoriesList.length === 0 && !isLoading && (
        <p className="text-center text-muted-foreground mt-8">
          Você ainda não tem categorias cadastradas. Adicione a primeira!
        </p>
      )}

      {/* ALERT DIALOG DE CONFIRMAÇÃO */}
      <AlertDialog open={isAlertOpen} onOpenChange={handleCloseAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso removerá permanentemente a
              categoria {categoryToDelete?.name}**.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteIsPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteIsPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoriesPage;
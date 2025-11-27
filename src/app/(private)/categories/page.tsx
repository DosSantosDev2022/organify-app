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
    <div className="container mx-auto py-10 px-4 md:px-6"> {/* Adicionando padding horizontal para telas menores */}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Categorias</h1> {/* Ajuste no tamanho do texto */}

        {/* MODAL DE ADIÇÃO/EDIÇÃO */}
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            {/* Botão com largura total em mobile e auto em desktop */}
            <Button onClick={() => handleEditClick(null)} disabled={isMutating} className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Categoria
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Editar Categoria" : "Adicionar Nova Categoria"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Campo Nome: Removendo grid-cols-4 para melhor layout em mobile */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="category-name" className="text-left">Nome</Label>
                <Input
                  id="category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Ex: Aluguel, Salário, Lazer"
                />
              </div>

              {/* Campo Tipo (Select): Removendo grid-cols-4 para melhor layout em mobile */}
              <div className="flex flex-col gap-2">
                <Label className="text-left" htmlFor="category-type-select">
                  Tipo
                </Label>

                <Select
                  value={newCategoryType}
                  onValueChange={setNewCategoryType}
                >
                  <SelectTrigger id="category-type-select" className="w-full">
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

      {/* 2. Tabela de Categorias (Desktop/Tablet) */}
      {/* Visível apenas em telas >= md (768px) */}
      <div className="hidden md:block border rounded-lg overflow-y-auto max-h-[70vh] scrollbar-custom">
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

      {/* 3. Cards de Categorias (Mobile) */}
      {/* Visível apenas em telas < md (768px) */}
      <div className="md:hidden flex flex-col gap-3">
        {categoriesList.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between border rounded-lg p-4"
          >
            {/* Informações da Categoria */}
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-base">{category.name}</span>
              <Badge className={`w-fit ${category.type.includes("INCOME")
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                }`}>
                {formatCategoryType(category.type)}
              </Badge>
            </div>

            {/* Ações */}
            <div className="flex space-x-2">
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
            </div>
          </div>
        ))}
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
              categoria **{categoryToDelete?.name}**.
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
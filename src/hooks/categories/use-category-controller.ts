// hooks/categories/use-category-controller.ts

import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { useCategories } from '@/hooks/transactions/use-categories';
import { useDeleteCategory, useUpdateCategory } from './use-category-mutations';
import { useCreateCategory } from './use-add-category'; 
import { Category, TransactionType } from '@prisma/client';

/**
 * Interface que define o formato do objeto retornado pelo hook.
 */
interface UseCategoryControllerReturn {
    // Dados de leitura
    categoriesList: Category[];
    isLoading: boolean;
    isError: boolean;
    error: any;
    // Estados de formulário
    isDialogOpen: boolean;
    newCategoryName: string;
    newCategoryType: TransactionType;
    editingCategory: Category | null;
    // Estados de exclusão
    isAlertOpen: boolean;
    categoryToDelete: Category | null;
    // Status de mutação
    isMutating: boolean;
    deleteIsPending: boolean;
    deleteMutationVariables: { id: string } | undefined;
    // Handlers e Setters
    setNewCategoryName: (name: string) => void;
    setNewCategoryType: (type: TransactionType) => void;
    handleCloseDialog: (open: boolean) => void;
    handleEditClick: (category: Category | null) => void;
    handleAddOrUpdateCategory: () => Promise<void>;
    handleDeleteClick: (category: Category) => void;
    handleConfirmDelete: () => Promise<void>;
    handleCloseAlert: (open: boolean) => void;
}


export function useCategoryController(): UseCategoryControllerReturn {
    // 1. DADOS E MUTAÇÕES
    // O 'data' é tipado como Category[] | undefined
    const { data: categories, isLoading, isError, error } = useCategories();
    const updateMutation = useUpdateCategory();
    const deleteMutation = useDeleteCategory();
    const createMutation = useCreateCategory(); 

    const categoriesList: Category[] = categories || [];

    // 2. ESTADOS LOCAIS PARA O MODAL (Adição/Edição)
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [newCategoryName, setNewCategoryName] = useState<string>("");
    // Usamos CategoryType para garantir que apenas tipos válidos sejam usados
    const [newCategoryType, setNewCategoryType] = useState<TransactionType>("INCOME");
    // editingCategory pode ser Category ou null
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // 3. ESTADOS LOCAIS PARA O ALERT DIALOG (Exclusão)
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
    // categoryToDelete também pode ser Category ou null
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null); 

    // 4. ESTADO DE CARREGAMENTO COMBINADO
    const isMutating = useMemo(() => 
        updateMutation.isPending || createMutation.isPending || deleteMutation.isPending, 
        [updateMutation.isPending, createMutation.isPending, deleteMutation.isPending]
    );

    // --- HANDLERS ---
    // Usamos useCallback para memoizar as funções, melhorando a performance e o 'linting'

    const handleResetStates = useCallback(() => {
        setNewCategoryName("");
        setNewCategoryType("INCOME");
        setEditingCategory(null);
        setIsDialogOpen(false);
        setCategoryToDelete(null);
        setIsAlertOpen(false);
    }, []);

    const handleAddOrUpdateCategory = useCallback(async () => {
        if (!newCategoryName.trim() || isMutating) return;

        try {
            if (editingCategory) {
                // Verificação de id para garantir que não é null no modo edição
                if (!editingCategory.id) throw new Error("ID da categoria de edição ausente.");

                await updateMutation.mutateAsync({
                    id: editingCategory.id,
                    name: newCategoryName,
                    type: newCategoryType,
                });
                toast.success("Categoria atualizada com sucesso.");
            } else {
                await createMutation.mutateAsync({
                    name: newCategoryName,
                    type: newCategoryType,
                });
                toast.success("Nova categoria criada com sucesso!");
            }
        } catch (err: any) {
            const errorMessage = err?.message || "Não foi possível salvar as alterações.";
            toast.error(errorMessage);
            return;
        }

        handleResetStates();
    }, [newCategoryName, newCategoryType, editingCategory, isMutating, updateMutation, createMutation, handleResetStates]);

    const handleEditClick = useCallback((category: Category | null) => {
        setEditingCategory(category);
        setNewCategoryName(category?.name || "");
        setNewCategoryType(category?.type || "INCOME");
        setIsDialogOpen(true);
    }, []);
    
    const handleDeleteClick = useCallback((category: Category) => {
        setCategoryToDelete(category);
        setIsAlertOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (isMutating || !categoryToDelete) return;

        const id = categoryToDelete.id;

        try {
            await deleteMutation.mutateAsync({ id });
            toast.success("Categoria excluída com sucesso.");
        } catch (err) {
            toast.error("Não foi possível excluir a categoria.");
        } finally {
            setCategoryToDelete(null);
            setIsAlertOpen(false);
        }
    }, [isMutating, categoryToDelete, deleteMutation]);

    const handleCloseDialog = useCallback((open: boolean) => {
        if (!open) {
            handleResetStates();
        }
        setIsDialogOpen(open);
    }, [handleResetStates]);
    
    const handleCloseAlert = useCallback((open: boolean) => {
        if (!open) {
            setCategoryToDelete(null); // Limpa a categoria ao fechar
        }
        setIsAlertOpen(open);
    }, []);

    // Retorna o objeto com a interface UseCategoryControllerReturn
    return {
        // Dados de leitura
        categoriesList,
        isLoading,
        isError,
        error,
        // Estados de formulário
        isDialogOpen,
        newCategoryName,
        newCategoryType,
        editingCategory,
        // Estados de exclusão
        isAlertOpen,
        categoryToDelete,
        // Status de mutação
        isMutating,
        deleteIsPending: deleteMutation.isPending,
        deleteMutationVariables: deleteMutation.variables as { id: string } | undefined, // Tipagem explícita
        // Handlers e Setters
        setNewCategoryName,
        setNewCategoryType,
        handleCloseDialog,
        handleEditClick,
        handleAddOrUpdateCategory,
        handleDeleteClick,
        handleConfirmDelete,
        handleCloseAlert
    };
}
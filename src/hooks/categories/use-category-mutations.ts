// hooks/transactions/use-category-mutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory, deleteCategory } from "@/app/actions/category.actions"; // Importar as Server Actions

// Tipos baseados na sua estrutura
type CategoryUpdatePayload = { id: string; name: string; type: string };
type CategoryDeletePayload = { id: string };

/**
 * Hook para Edição de Categoria.
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryUpdatePayload) => 
      updateCategory(data.id, data.name, data.type),
    
    // O que fazer após o sucesso da Server Action
    onSuccess: () => {
      // Invalida o cache para que 'useCategories' refetch os dados atualizados
      queryClient.invalidateQueries({ queryKey: ["categories"] }); 
    },
    // Você pode adicionar onError para lidar com erros na UI
  });
}

/**
 * Hook para Exclusão de Categoria.
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryDeletePayload) => 
      deleteCategory(data.id),
      
    // O que fazer após o sucesso da Server Action
    onSuccess: () => {
      // Invalida o cache para que 'useCategories' refetch os dados atualizados
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    // Você pode adicionar onError
  });
}
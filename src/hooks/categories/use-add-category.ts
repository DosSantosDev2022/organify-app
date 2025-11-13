// hooks/transactions/use-category-mutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
// Importar a nova Server Action
import { createCategory } from "@/app/actions/category.actions"; 
type CategoryCreatePayload = { name: string; type: string};

/**
 * Hook para Criação de Categoria.
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryCreatePayload) => 
      createCategory(data.name, data.type),
    
    onSuccess: () => {
      // Invalida o cache para que 'useCategories' refetch os dados atualizados
      queryClient.invalidateQueries({ queryKey: ["categories"] }); 
    },
    // Você pode adicionar onError para lidar com erros na UI
  });
}
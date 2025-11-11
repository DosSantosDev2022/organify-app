// hooks/use-categories.ts

import { getCategories } from "@/app/actions/category.actions";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@prisma/client";

/**
 * Hook para buscar categorias usando React Query.
 * Retorna uma lista de categorias, o status de carregamento e o erro.
 */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"], // Chave única para o cache
    queryFn: async () => {
      const result = await getCategories();

      if (!result.success || !result.data) {
        // Lança um erro se a Server Action falhar
        throw new Error(result.error || "Falha ao buscar categorias.");
      }

      return result.data as Category[];
    },
    // Opcional: Define um tempo para que os dados sejam considerados "stale" (antigos)
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

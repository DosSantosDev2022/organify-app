// app/actions/category.actions.ts
"use server"; // Marca este ficheiro como contendo Server Actions

import db from "@/lib/prisma";
import { Category } from "@prisma/client";

/**
 * Busca todas as categorias associadas ao usuário logado.
 * @returns Um objeto com sucesso (true/false) e os dados das categorias.
 */
export async function getCategories() {
  try {
    const categories: Category[] = await db.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories." };
  }
}

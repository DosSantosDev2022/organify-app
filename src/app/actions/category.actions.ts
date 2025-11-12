// app/actions/category.actions.ts
"use server"; // Marca este ficheiro como contendo Server Actions

import db from "@/lib/prisma";
import { Category, TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";

type ActionResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
}

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

/**
 * Server Action para criar uma nova categoria.
 */
export async function createCategory(name: string, type: string): Promise<ActionResponse<any>> {
    if (!name || !type) {
        return { success: false, error: "Nome e Tipo da categoria são obrigatórios." };
    }

    // A conversão de string para o enum do Prisma é importante
    const categoryTypeEnum = type as TransactionType; 

    try {
        const newCategory = await db.category.create({
            data: {
                name: name.trim(),
                type: categoryTypeEnum,
                // Assumindo que você tem um userId ou um accountId para linkar a categoria
                // userId: '...', 
            },
        });

        // Invalida o cache da rota onde a tabela de categorias é exibida
        revalidatePath('/categories'); 

        return { success: true, data: newCategory };
    } catch (error) {
        
        console.error("Erro ao criar categoria:", error);
        return { 
            success: false, 
            error: "Falha ao criar a categoria. Tente novamente mais tarde." 
        };
    }
}


// 1. Ação para EDIÇÃO
/**
 * Server Action para atualizar uma categoria existente.
 */
export async function updateCategory(id: string, name: string, type: string): Promise<ActionResponse<any>> {
    if (!id || !name || !type) {
        return { success: false, error: "Dados incompletos fornecidos para atualização." };
    }

    // A conversão de string para o enum do Prisma é importante
    const categoryTypeEnum = type as TransactionType; 

    try {
        const updatedCategory = await db.category.update({
            where: { id },
            data: {
                name: name.trim(), // Remove espaços em branco
                type: categoryTypeEnum,
            },
        });

        // Invalida o cache da rota onde a tabela de categorias é exibida
        revalidatePath('/categories'); 

        return { success: true, data: updatedCategory };
    } catch (error) {
        console.error("Erro ao atualizar categoria:", error);
        return { 
            success: false, 
            error: "Falha na atualização da categoria. O ID pode ser inválido ou o nome já existe." 
        };
    }
}

// 2. Ação para EXCLUSÃO
/**
 * Server Action para excluir uma categoria.
 */
export async function deleteCategory(id: string): Promise<ActionResponse<string>> {
    if (!id) {
        return { success: false, error: "ID da categoria não fornecido para exclusão." };
    }

    try {
        await db.category.delete({
            where: { id },
        });

        // Invalida o cache da rota para que a lista seja atualizada
        revalidatePath('/categories'); 
        
        return { success: true, data: `Categoria com ID ${id} excluída com sucesso.` };
    } catch (error) {
 
        console.error("Erro ao excluir categoria:", error);
        return { 
            success: false, 
            error: "Falha na exclusão da categoria. O ID pode ser inválido." 
        };
    }
}

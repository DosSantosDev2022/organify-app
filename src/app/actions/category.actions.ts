// app/actions/category.actions.ts
"use server"; // Marca este ficheiro como contendo Server Actions

import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import { Category, TransactionType } from "@prisma/client";
import { getServerSession } from "next-auth";
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

 async function getAuthenticatedUserId() {
   const session = await getServerSession(authOptions); // Obtém a sessão do Next-Auth
   const userId = session?.user?.id;
 
   if (!userId) {
     throw new Error("User not authenticated.");
   }
   return userId;
 }

export async function getCategories() {
    
  try {
    const userId = await getAuthenticatedUserId();
    const categories: Category[] = await db.category.findMany({
      where: {
        userId: userId
      },
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

function normalizeCategoryName(name: string): string {
    // 1. Converte para minúsculas
    // 2. Normaliza para decompor caracteres acentuados (ex: 'á' -> 'a' + acento)
    // 3. Remove todos os caracteres diacríticos (acentos)
    // 4. Remove espaços extras e pontuações que não queremos
    return name
        .toLowerCase()
        .normalize("NFD") 
        .replace(/[\u0300-\u036f]/g, "") 
        .replace(/[^a-z0-9]/g, ""); // Opcional: remove espaços/pontuações
}

/**
 * Server Action para criar uma nova categoria.
 */
export async function createCategory(name: string, type: string): Promise<ActionResponse<any>> {
    const userId = await getAuthenticatedUserId();
    if (!name || !type) {
        return { success: false, error: "Nome e Tipo da categoria são obrigatórios." };
    }

    // A conversão de string para o enum do Prisma é importante
    const categoryTypeEnum = type as TransactionType; 

    const normalizedName = normalizeCategoryName(name.trim());

    try {
        const newCategory = await db.category.create({
            
            data: {
                userId: userId,
                name: name.trim(),
                normalizedName: normalizedName,
                type: categoryTypeEnum,
            },
        });

        // Invalida o cache da rota onde a tabela de categorias é exibida
        revalidatePath('/categories'); 

        return { success: true, data: newCategory };
    } catch (error) {
        // 🔑 VERIFICAÇÃO CHAVE: Usar o Type Guard para checar o erro P2002
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
            // Se for P2002 (Duplicação), lança a mensagem específica
            throw new Error("Você já possui uma categoria com este nome. Por favor, escolha um nome diferente.");
        }
        
        // Se for qualquer outro erro (ou se o Type Guard falhar), lança a mensagem genérica
        console.error("Erro ao criar categoria:", error);
        throw new Error("Falha ao criar a categoria. Tente novamente mais tarde.");
    }
}


// 1. Ação para EDIÇÃO
/**
 * Server Action para atualizar uma categoria existente.
 */
export async function updateCategory(id: string, name: string, type: string ): Promise<ActionResponse<any>> {
    const userId = await getAuthenticatedUserId();
    if (!id || !name || !type) {
        return { success: false, error: "Dados incompletos fornecidos para atualização." };
    }

    // A conversão de string para o enum do Prisma é importante
    const categoryTypeEnum = type as TransactionType; 

    try {
        const updatedCategory = await db.category.update({
            where: {
                userId: userId,
                id
             },
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
    const userId = await getAuthenticatedUserId();
    if (!id) {
        return { success: false, error: "ID da categoria não fornecido para exclusão." };
    }

    try {
        await db.category.delete({
            where: {
                userId: userId,
                id 
            },
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

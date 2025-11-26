"use server";

import { db } from "@/lib/prisma"; // Ajuste o import do seu client prisma
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { PlannedPurchase } from "@prisma/client";
import { authOptions } from "@/lib/auth";

async function getAuthenticatedUserId() {
  const session = await getServerSession(authOptions); // Obtém a sessão do Next-Auth
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated.");
  }
  return userId;
}

// 💡 Definição do tipo de entrada para a edição/criação
export interface PlannedPurchasePayload {
  id?: string; // Opcional para criação, presente para edição
  name: string;
  description: string | undefined;
  amount: number; // Em centavos
  deadline: Date;
  status: "PENDING" | "PURCHASED";
}

/**
 * Server Action unificada para CRIAR ou ATUALIZAR uma Compra Planejada.
 */
export async function createOrUpdatePlannedPurchase(data: PlannedPurchasePayload): Promise<PlannedPurchase> {
 
  const userId = await getAuthenticatedUserId(); // Garante o ID do usuário

  // Simulação de um atraso de rede (mantemos, mas a lógica do DB é a principal)
  await new Promise(resolve => setTimeout(resolve, 800));

  const { id, name, description, amount, deadline, status } = data;

  if (id) {
    // LÓGICA DE EDIÇÃO (UPDATE)
    console.log(`[SERVER ACTION] Editando Compra Planejada ID: ${id}`, name);

    const updatedPurchase = await db.plannedPurchase.update({
      where: { id, userId },
      data: {
        name,
        description,
        amount,
        deadline,
        status,
      },
    });
    revalidatePath("/plan-purchases");
    return updatedPurchase;
  } else {
    // LÓGICA DE CRIAÇÃO (CREATE)
    console.log(`[SERVER ACTION] Criando Compra Planejada:`, name);

    const createdPurchase = await db.plannedPurchase.create({ // 👈 USO REAL DO PRISMA
      data: {
        userId,
        name,
        description,
        amount,
        deadline,
        status,
      },
    });
    revalidatePath("/plan-purchases");
    return createdPurchase;
  }
}

// 1. LISTAR (Filtrado por mês/ano)
export async function getPlannedPurchases({ month, year }: { month: number; year: number }) {
  const userId = await getAuthenticatedUserId()
  // Definir intervalo do mês
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0); // Último dia do mês

  const purchases = await db.plannedPurchase.findMany({
    where: {
      userId,
      deadline: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      deadline: "asc",
    },
  });

  return purchases;
}

// 2. CRIAR
export async function createPlannedPurchase(data: {
  name: string;
  description?: string;
  amount: number; // Recebe em centavos
  deadline: Date;
}) {
  const userId = await getAuthenticatedUserId();

  await db.plannedPurchase.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      amount: data.amount,
      deadline: data.deadline,
      status: "PENDING",
    },
  });

  revalidatePath("/planejar-compras"); // Ajuste a rota se necessário
}

// 3. ALTERAR STATUS (Toggle)
export async function togglePlannedPurchaseStatus(id: string) {
  const userId = await getAuthenticatedUserId();

  // Primeiro buscamos para saber o status atual
  const item = await db.plannedPurchase.findUnique({
    where: { id, userId },
  });

  if (!item) throw new Error("Item não encontrado");

  const newStatus = item.status === "PENDING" ? "PURCHASED" : "PENDING";

  await db.plannedPurchase.update({
    where: { id },
    data: { status: newStatus },
  });

  revalidatePath("/planejar-compras");
}

// 4. DELETAR
export async function deletePlannedPurchase(id: string) {
  const userId = await getAuthenticatedUserId();

  await db.plannedPurchase.delete({
    where: { id, userId },
  });

  revalidatePath("/planejar-compras");
}
// app/actions/transaction.actions.ts
"use server"; // Marca este ficheiro como contendo Server Actions

import { z } from "zod";
import { TransactionType } from "@prisma/client";
import { transactionSchema } from "@/schemas/validations";
import { revalidatePath } from "next/cache";
import { endOfMonth, startOfMonth } from "date-fns";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type TransactionData = z.infer<typeof transactionSchema>;

async function getAuthenticatedUserId() {
  const session = await getServerSession(authOptions); // Obtém a sessão do Next-Auth
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated.");
  }
  return userId;
}

export async function createTransaction(data: TransactionData) {

  // --- 3. OBTER O USERID ---
    const userId = await getAuthenticatedUserId();
  // 1. Validar os dados no servidor (nunca confiar no cliente)
  const validation = transactionSchema.safeParse(data);

  if (!validation.success) {
    // Retorna um erro detalhado
    return {
      success: false,
      error: validation.error.format(),
    };
  }

  const { amount, date, description, type,categoryId, status } = validation.data;

  try {
    // 2. Converter o valor para centavos (ex: 10.50 -> 1050)
    const amountInCents = Math.round(amount * 100);

    // 3. Inserir no banco de dados
    await db.transaction.create({
      data: {
        description: description,
        amount: amountInCents,
        date: date,
        type: type,
        status:status,
        categoryId: categoryId === "" ? undefined : categoryId,
        userId: userId,
      },
    });

    // 4. Limpar o cache da página para que os novos dados sejam mostrados
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { success: false, error: "Failed to create transaction." };
  }
}



// ---  FUNÇÃO PARA BUSCAR TRANSAÇÕES ---
export async function getTransactions(
  type: TransactionType,
  selectedDate: Date // <-- NOVO PARÂMETRO
) {

  try {
    const userId = await getAuthenticatedUserId();
    const startDate = startOfMonth(selectedDate);
    const endDate = endOfMonth(selectedDate);


    const transactions = await db.transaction.findMany({
      where: {
        userId: userId,
        type: type,
        date: {
          gte: startDate, // gte = 'maior ou igual a'
          lte: endDate, // lte = 'menor ou igual a'
        },
      },
      include: {
        category: true, 
      },
      orderBy: {
        date: "desc",
      },
    });

    const formattedTransactions = transactions.map((tx) => ({
      ...tx,
      amount: tx.amount / 100,
    }));

    return { success: true, data: formattedTransactions };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { success: false, error: "Failed to fetch transactions." };
  }
}


// --- FUNÇÃO PARA BUSCAR SOMA DOS RESUMOS (MENSAL) ---
export async function getSummaryTotals(selectedDate: Date) {

  try {
    const userId = await getAuthenticatedUserId();
    const startDate = startOfMonth(selectedDate);
    const endDate = endOfMonth(selectedDate);

    // Consulta que INCLUI TODOS os tipos para que possamos extrair 'INVESTMENT'
    const summaryData = await db.transaction.groupBy({
      by: ["type"],
      _sum: { amount: true },
      where: {
        userId: userId,
        date: { gte: startDate, lte: endDate },
        // IMPORTANTE: NÃO HÁ FILTRO 'NOT' AQUI!
      },
    });

    const totals = {
      income: 0,
      fixedExpense: 0,
      variableExpense: 0,
      investment: 0 // Valor mensal do investimento
    };
    for (const item of summaryData) {
      const amountInReais = (item._sum.amount || 0) / 100;
      switch (item.type) {
        case TransactionType.INCOME:
          totals.income = amountInReais;
          break;
        case TransactionType.FIXED_EXPENSE:
          totals.fixedExpense = amountInReais;
          break;
        case TransactionType.VARIABLE_EXPENSE:
          totals.variableExpense = amountInReais;
          break;
        case TransactionType.INVESTMENT:
          totals.investment = amountInReais; // Captura o valor
          break;
      }
    }
    
    // CÁLCULO DO SALDO MENSAL (FLUXO DE CAIXA): Investment NÃO é incluído
    const balance =
      totals.income -
      totals.fixedExpense -
      totals.variableExpense -
      totals.investment

    return {
      success: true,
      data: { ...totals, balance }, // Retorna o saldo (sem investimento) e o total de investimento mensal
    };
  } catch (error) {
    console.error("Error fetching summary totals:", error);
    return { success: false, error: "Failed to fetch summary." };
  }
}

// --- FUNÇÃO PARA SALDO ACUMULADO (RUNNING BALANCE) ---
export async function getRunningBalance(selectedDate: Date) {
  try {
    const userId = await getAuthenticatedUserId();
    const endDate = endOfMonth(selectedDate);
    
    // Executa 4 agregações: 3 para o Saldo e 1 para o Investimento
    const [
      totalIncome,
      totalFixedExpense,
      totalVariableExpense,
      totalInvestment,
    ] = await db.$transaction([
      db.transaction.aggregate({ _sum: { amount: true }, where: { userId, type: TransactionType.INCOME, date: { lte: endDate } } }),
      db.transaction.aggregate({ _sum: { amount: true }, where: { userId, type: TransactionType.FIXED_EXPENSE, date: { lte: endDate }, NOT: { 
          type: TransactionType.INVESTMENT 
      } } }),
      db.transaction.aggregate({ _sum: { amount: true }, where: { userId, type: TransactionType.VARIABLE_EXPENSE, date: { lte: endDate }, NOT: { 
          type: TransactionType.INVESTMENT 
      } } }),
      db.transaction.aggregate({ _sum: { amount: true }, where: { userId, type: TransactionType.INVESTMENT, date: { lte: endDate } } }),
    ]);

    const income = totalIncome._sum.amount || 0;
    const fixed = totalFixedExpense._sum.amount || 0;
    const variable = totalVariableExpense._sum.amount || 0;
    const investment = totalInvestment._sum.amount || 0;

    // CÁLCULO DO SALDO ACUMULADO (FLUXO DE CAIXA): Investment NÃO é incluído
    const balanceInCents = income - fixed - variable - investment;
    const balanceInReais = balanceInCents / 100;

    // Valor do investimento acumulado
    const investmentInReais = investment / 100;

    // Retorna o objeto completo com os dois saldos
    return { 
        success: true, 
        data: { 
            runningBalance: balanceInReais, // Saldo principal
            investmentTotal: investmentInReais // Total Investido
        } 
    };
  } catch (error) {
    console.error("Error fetching running balance:", error);
    return { success: false, error: "Failed to fetch running balance." };
  }
}

// --- 1. NOVA FUNÇÃO: updateTransaction ---
export async function updateTransaction(
  id: string,
  data: TransactionData
) {
  const userId = await getAuthenticatedUserId();
  // Validação no servidor
  const validation = transactionSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.format() };
  }

  const { amount, date, description, type,categoryId,status } = validation.data;

  try {
    // Converte para centavos
    const amountInCents = Math.round(amount * 100);

    await db.transaction.update({
      where: { id: id, userId: userId, },
      data: {
        description: description,
        amount: amountInCents,
        date: date,
        type: type,
        status: status,
        categoryId: categoryId === "" ? undefined : categoryId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating transaction:", error);
    return { success: false, error: "Failed to update transaction." };
  }
}

// --- 2. NOVA FUNÇÃO: deleteTransaction ---
export async function deleteTransaction(id: string) {
  if (!id) {
    return { success: false, error: "Invalid transaction ID." };
  }

  try {
    const userId = await getAuthenticatedUserId();

    await db.transaction.delete({
      where: { id: id, userId: userId, },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { success: false, error: "Failed to delete transaction." };
  }
}
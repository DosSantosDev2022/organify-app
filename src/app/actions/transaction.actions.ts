// app/actions/transaction.actions.ts
"use server"; // Marca este ficheiro como contendo Server Actions

import { z } from "zod";
import { PrismaClient, TransactionType } from "@prisma/client";
import { transactionSchema } from "@/schemas/validations";
import { revalidatePath } from "next/cache";
import { endOfMonth, startOfMonth } from "date-fns";

const prisma = new PrismaClient();
type TransactionData = z.infer<typeof transactionSchema>;

export async function createTransaction(data: TransactionData) {
  // 1. Validar os dados no servidor (nunca confiar no cliente)
  const validation = transactionSchema.safeParse(data);

  if (!validation.success) {
    // Retorna um erro detalhado
    return {
      success: false,
      error: validation.error.format(),
    };
  }

  const { amount, date, description, type } = validation.data;

  try {
    // 2. Converter o valor para centavos (ex: 10.50 -> 1050)
    const amountInCents = Math.round(amount * 100);

    // 3. Inserir no banco de dados
    await prisma.transaction.create({
      data: {
        description: description,
        amount: amountInCents,
        date: date,
        type: type,
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
  // Calcula o início e o fim do mês no servidor
  const startDate = startOfMonth(selectedDate);
  const endDate = endOfMonth(selectedDate);

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        type: type,
        date: {
          gte: startDate, // gte = 'maior ou igual a'
          lte: endDate, // lte = 'menor ou igual a'
        },
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


// --- FUNÇÃO PARA BUSCAR SOMA DOS RESUMOS  ---
export async function getSummaryTotals(
  selectedDate: Date // <-- NOVO PARÂMETRO
) {
  const startDate = startOfMonth(selectedDate);
  const endDate = endOfMonth(selectedDate);

  try {
    const summaryData = await prisma.transaction.groupBy({
      by: ["type"],
      _sum: {
        amount: true,
      },
      // Adiciona o filtro de data aqui
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // ... (o resto da lógica de processamento de 'totals' e 'balance' continua igual)
    const totals = {
      income: 0,
      fixedExpense: 0,
      variableExpense: 0,
      investment: 0,
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
          totals.investment = amountInReais;
          break;
      }
    }
    const balance =
      totals.income -
      totals.fixedExpense -
      totals.variableExpense -
      totals.investment;

    return {
      success: true,
      data: { ...totals, balance },
    };
  } catch (error) {
    console.error("Error fetching summary totals:", error);
    return { success: false, error: "Failed to fetch summary." };
  }
}

// --- 1. NOVA FUNÇÃO: updateTransaction ---
export async function updateTransaction(
  id: string,
  data: TransactionData
) {
  // Validação no servidor
  const validation = transactionSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.format() };
  }

  const { amount, date, description, type } = validation.data;

  try {
    // Converte para centavos
    const amountInCents = Math.round(amount * 100);

    await prisma.transaction.update({
      where: { id: id },
      data: {
        description: description,
        amount: amountInCents,
        date: date,
        type: type,
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
    await prisma.transaction.delete({
      where: { id: id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { success: false, error: "Failed to delete transaction." };
  }
}

export async function getRunningBalance(selectedDate: Date) {
  // Queremos o saldo total até o FIM do mês selecionado
  const endDate = endOfMonth(selectedDate);

  try {
    // Usamos $transaction para executar todas as consultas em
    // uma única transação de banco de dados.
    const [
      totalIncome,
      totalFixedExpense,
      totalVariableExpense,
      totalInvestment,
    ] = await prisma.$transaction([
      // 1. Soma de todas as Receitas até a data
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          type: TransactionType.INCOME,
          date: { lte: endDate }, // lte = menor ou igual a
        },
      }),
      // 2. Soma de todas as Despesas Fixas até a data
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          type: TransactionType.FIXED_EXPENSE,
          date: { lte: endDate },
        },
      }),
      // 3. Soma de todas as Despesas Variáveis até a data
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          type: TransactionType.VARIABLE_EXPENSE,
          date: { lte: endDate },
        },
      }),
      // 4. Soma de todos os Investimentos até a data
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          type: TransactionType.INVESTMENT,
          date: { lte: endDate },
        },
      }),
    ]);

    // Extrai os valores (em centavos)
    const income = totalIncome._sum.amount || 0;
    const fixed = totalFixedExpense._sum.amount || 0;
    const variable = totalVariableExpense._sum.amount || 0;
    const investment = totalInvestment._sum.amount || 0;

    // Calcula o saldo final e converte de volta para Reais
    const balanceInCents = income - fixed - variable - investment;
    const balanceInReais = balanceInCents / 100;

    return { success: true, data: balanceInReais };
  } catch (error) {
    console.error("Error fetching running balance:", error);
    return { success: false, error: "Failed to fetch running balance." };
  }
}
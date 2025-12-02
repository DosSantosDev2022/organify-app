'use server';

import { authOptions } from '@/lib/auth';
import db from '@/lib/prisma'; // Assumindo que você usa 'db' em vez de 'db'
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache'; // Adicionado para consistência

// --- Funções de Autenticação ---
async function getAuthenticatedUserId() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error('User not authenticated.');
  }
  return userId;
}

// --- Tipos de Dados ---

/**
 * Tipo de dados retornado para o frontend, onde os valores monetários
 * são convertidos para Reais (float) para exibição.
 * NOTA: Assumimos que a Category é um campo simples (string) ou nulo.
 */
export type DebtWithPaidInfo = {
  id: string;
  description: string;
  totalAmount: number; // Em Reais (float)
  startDate: Date;
  dueDate: Date | null;
  isPaidOff: boolean;
  // 🔑 AJUSTE DA TIPAGEM: Retornando a string da categoria (se existir)
  category: string | null;
  installments: number | null;
  amountPaid: number; // Acumulado pago em Reais (float)
  remainingAmount: number; // Saldo devedor em Reais (float)
  payments: {
    id: string;
    paymentDate: Date;
    amountPaid: number; // Valor do pagamento em Reais (float)
    installmentNumber: number | null;
    notes?: string | null;
  }[];
};

// Tipo de dados recebido do formulário de criação de dívida
export type CreateDebtFormState = {
  description: string;
  totalAmount: number; // Recebido em Reais (float)
  installments?: number | null;
  dueDate?: Date | null;
  category?: string | null;
};

// Tipo de dados recebido do formulário de adição de pagamento
type AddPaymentFormState = {
  debtId: string;
  amountPaid: number; // Recebido em Reais (float)
  paymentDate: Date;
  installmentNumber?: number | null;
  notes?: string | null;
};

// ---------------------------------------------
// Ações de Leitura
// ---------------------------------------------

/**
 * 🔑 FUNÇÃO CORRIGIDA: Busca todas as dívidas, soma pagamentos e serializa Decimals.
 *
 * @returns Array de dívidas com informações de pagamento em Reais (float) para o frontend.
 */
export async function getDebts(): Promise<DebtWithPaidInfo[]> {
  const userId = await getAuthenticatedUserId();

  // 1. Busca no Prisma, incluindo os pagamentos
  const debts = await db.debt.findMany({
    where: { userId: userId },
    include: {
      payments: true,
    },
    orderBy: {
      startDate: 'asc',
    },
  });

  // 2. Mapeamento e Serialização (Centavos e Reais)
  return debts.map((debt) => {
    // 🔑 SERIALIZAÇÃO: Converter Decimal/BigInt (se for o caso) para number (em Centavos)
    // Se o seu campo 'totalAmount' for 'Int' no schema, '.toNumber()' não é necessário
    const totalAmountCents = debt.totalAmount;

    // 2.1. Calcular o total pago acumulado em Centavos
    const totalPaidCents = debt.payments.reduce(
      // Se 'amountPaid' for Decimal/BigInt no schema, use: sum + payment.amountPaid.toNumber()
      (sum, payment) => sum + payment.amountPaid,
      0
    );

    // 2.2. Calcular o restante em Centavos
    const remainingAmountCents = totalAmountCents - totalPaidCents;

    // 2.3. Formatar os pagamentos internos
    const formattedPayments = debt.payments.map((p) => ({
      id: p.id,
      paymentDate: p.paymentDate,
      // Converte Centavos para Reais para o Frontend
      amountPaid: p.amountPaid / 100,
      installmentNumber: p.installmentNumber,
      notes: p.notes,
    }));

    return {
      // Campos de data/meta
      id: debt.id,
      description: debt.description,
      dueDate: debt.dueDate,
      startDate: debt.startDate,
      installments: debt.installments,
      isPaidOff: debt.isPaidOff,
      // 🔑 CAMPO AJUSTADO: Se 'category' for um ID, ele já é string ou null.
      category: debt.category,

      // Campos monetários (Convertidos para Reais para o Frontend)
      totalAmount: totalAmountCents / 100,
      amountPaid: totalPaidCents / 100,
      remainingAmount: remainingAmountCents / 100,

      // Pagamentos formatados
      payments: formattedPayments,
    };
  });
}

/**
 * Obtém o resumo consolidado de todas as dívidas ativas.
 */
export async function getDebtsSummary() {
  // Reutilizamos a ação anterior, que já retorna valores em Reais (float)
  const debtsWithInfo = await getDebts();

  // Soma direta, pois os valores já estão em Reais
  const totalDebt = debtsWithInfo.reduce((sum, debt) => sum + debt.totalAmount, 0);
  const totalPaid = debtsWithInfo.reduce((sum, debt) => sum + debt.amountPaid, 0);
  const totalRemaining = totalDebt - totalPaid;
  // Usamos > 0.01 para garantir que pequenas imprecisões de float não afetem a contagem
  const activeDebts = debtsWithInfo.filter(d => !d.isPaidOff && d.remainingAmount > 0.01).length;

  return {
    totalDebt: totalDebt,
    totalPaid: totalPaid,
    totalRemaining: totalRemaining,
    activeDebtsCount: activeDebts,
  };
}


// ---------------------------------------------
// Ações de Escrita (CRUD)
// ---------------------------------------------

/**
 * Cria um novo registro de dívida no banco de dados.
 */
export async function createDebt(data: CreateDebtFormState) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'Usuário não autenticado. Acesso negado.' };
  }

  // CONVERSÃO CRUCIAL: Reais (float) -> Centavos (Int)
  const totalAmountCents = Math.round(data.totalAmount * 100);

  try {
    const newDebt = await db.debt.create({
      data: {
        userId: session.user.id,
        description: data.description,
        totalAmount: totalAmountCents, // Salva em centavos
        installments: data.installments,
        dueDate: data.dueDate,
        category: data.category,
        // isPaidOff inicia como falso por padrão
      },
    });

    // Limpa o cache para atualizar a lista no frontend
    revalidatePath('/debts');
    revalidatePath('/');

    return { success: true, debt: newDebt };
  } catch (error) {
    console.error('Erro ao criar dívida:', error);
    return { success: false, error: 'Falha ao salvar a dívida no banco de dados.' };
  }
}


/**
 * Registra um novo pagamento para uma dívida existente e atualiza o status de quitação.
 */
export async function addPaymentToDebt(data: AddPaymentFormState) {
  const userId = await getAuthenticatedUserId();

  // CONVERSÃO CRUCIAL: Reais (float) -> Centavos (Int)
  const amountPaidCents = Math.round(data.amountPaid * 100);

  try {
    // 1. Cria o registro do pagamento
    const newPayment = await db.debtPayment.create({
      data: {
        debtId: data.debtId,
        amountPaid: amountPaidCents, // Salva em centavos
        paymentDate: data.paymentDate,
        installmentNumber: data.installmentNumber,
        notes: data.notes,
      },
    });

    // 2. Verifica se a dívida foi quitada
    const debt = await db.debt.findUnique({
      where: { id: data.debtId, userId: userId },
      // Não precisamos de 'payments' aqui, faremos a soma do lado do DB para mais precisão
      select: { id: true, totalAmount: true, isPaidOff: true },
    });

    if (debt) {
      // Calcula o total pago novamente, somando o novo pagamento
      const totalPaidResult = await db.debtPayment.aggregate({
        where: { debtId: data.debtId },
        _sum: { amountPaid: true },
      });

      const totalPaid = totalPaidResult._sum.amountPaid || 0;
      const totalAmount = debt.totalAmount;

      // Atualiza o status isPaidOff se necessário
      if (totalPaid >= totalAmount && !debt.isPaidOff) {
        await db.debt.update({
          where: { id: data.debtId },
          data: { isPaidOff: true },
        });
      } else if (totalPaid < totalAmount && debt.isPaidOff) {
        await db.debt.update({
          where: { id: data.debtId },
          data: { isPaidOff: false },
        });
      }
    }

    // Limpa o cache para atualizar a lista no frontend
    revalidatePath('/debts');
    revalidatePath('/');

    return { success: true, payment: newPayment };
  } catch (error) {
    console.error('Erro ao adicionar pagamento:', error);
    return { success: false, error: 'Falha ao registrar o pagamento.' };
  }
}
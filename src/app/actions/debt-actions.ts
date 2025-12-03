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


// Tipo de dados para a edição de uma dívida
export type UpdateDebtFormState = {
  id: string; // ID da dívida é obrigatório
  description?: string;
  totalAmount?: number;
  installments?: number | null;
  dueDate?: Date | null;
  category?: string | null;
  isPaidOff?: boolean; // Podemos permitir a edição manual do status de quitação
};

// Tipo de dados para a edição de um pagamento
export type UpdatePaymentFormState = {
  id: string; // ID do pagamento é obrigatório
  debtId: string; // Necessário para reavaliar o status da dívida
  amountPaid?: number;
  paymentDate?: Date;
  installmentNumber?: number | null;
  notes?: string | null;
};

// ---------------------------------------------
// Ações de Escrita (CRUD) - UPDATE
// ---------------------------------------------

/**
 * Edita um registro de dívida existente.
 */
export async function updateDebt(data: UpdateDebtFormState) {
  const userId = await getAuthenticatedUserId();

  // Prepara os dados para o Prisma
  const dataToUpdate: Omit<typeof data, 'id' | 'totalAmount'> & { totalAmount?: number } = { ...data };

  // CONVERSÃO CRUCIAL: Reais (float) -> Centavos (Int), se o valor for enviado
  if (data.totalAmount !== undefined) {
    dataToUpdate.totalAmount = Math.round(data.totalAmount * 100);
  } else {
    // Remove a chave se não for alterada para evitar erro de tipo/conversão no Prisma
    delete dataToUpdate.totalAmount;
  }

  try {
    const updatedDebt = await db.debt.update({
      where: { id: data.id, userId: userId }, // Garante que apenas o proprietário edite
      data: dataToUpdate,
    });

    // Limpa o cache
    revalidatePath('/debts');
    revalidatePath('/');

    return { success: true, debt: updatedDebt };
  } catch (error) {
    console.error(`Erro ao editar dívida ${data.id}:`, error);
    return { success: false, error: 'Falha ao editar a dívida.' };
  }
}

/**
 * Edita um pagamento existente e reavalia o status da dívida.
 */
export async function updatePayment(data: UpdatePaymentFormState) {
  const userId = await getAuthenticatedUserId();

  // 1. Prepara os dados para o Prisma
  const dataToUpdate: Omit<typeof data, 'id' | 'debtId' | 'amountPaid'> & { amountPaid?: number } = { ...data };

  // CONVERSÃO CRUCIAL: Reais (float) -> Centavos (Int), se o valor for enviado
  if (data.amountPaid !== undefined) {
    dataToUpdate.amountPaid = Math.round(data.amountPaid * 100);
  } else {
    delete dataToUpdate.amountPaid;
  }

  try {
    // 2. Atualiza o registro do pagamento
    const updatedPayment = await db.debtPayment.update({
      where: { id: data.id, debt: { userId: userId } }, // Garante a posse através da relação
      data: dataToUpdate,
    });

    // 3. Reavalia o status de quitação da dívida
    await revalidateDebtStatus(data.debtId, userId);

    // Limpa o cache
    revalidatePath('/debts');
    revalidatePath('/');

    return { success: true, payment: updatedPayment };
  } catch (error) {
    console.error(`Erro ao editar pagamento ${data.id}:`, error);
    return { success: false, error: 'Falha ao editar o pagamento.' };
  }
}

// ⚠️ FUNÇÃO AUXILIAR REQUERIDA (Para não duplicar a lógica de quitação)
async function revalidateDebtStatus(debtId: string, userId: string) {
  const debt = await db.debt.findUnique({
    where: { id: debtId, userId: userId },
    select: { id: true, totalAmount: true, isPaidOff: true },
  });

  if (debt) {
    const totalPaidResult = await db.debtPayment.aggregate({
      where: { debtId: debtId },
      _sum: { amountPaid: true },
    });

    const totalPaid = totalPaidResult._sum.amountPaid || 0;
    const totalAmount = debt.totalAmount;
    const isPaidOffNew = totalPaid >= totalAmount;

    // Atualiza o status isPaidOff se houver mudança
    if (isPaidOffNew !== debt.isPaidOff) {
      await db.debt.update({
        where: { id: debtId },
        data: { isPaidOff: isPaidOffNew },
      });
    }
  }
}

// ---------------------------------------------
// Ações de Escrita (CRUD) - DELETE
// ---------------------------------------------

/**
 * Exclui um registro de dívida e todos os seus pagamentos relacionados (cascata).
 */
export async function deleteDebt(debtId: string) {
  const userId = await getAuthenticatedUserId();

  try {
    // 1. Exclui todos os pagamentos relacionados primeiro (se não estiver configurado como CASCADE no Schema)
    // Se for CASCADE, basta excluir a dívida.
    // Vamos assumir que o Prisma está configurado para deletar em cascata ou que você tem um Transaction:

    const deletedDebt = await db.debt.delete({
      where: { id: debtId, userId: userId }, // Garante que apenas o proprietário exclua
    });

    // Limpa o cache
    revalidatePath('/debts');
    revalidatePath('/');

    return { success: true, debt: deletedDebt };
  } catch (error) {
    console.error(`Erro ao excluir dívida ${debtId}:`, error);
    return { success: false, error: 'Falha ao excluir a dívida. Verifique se há pagamentos relacionados.' };
  }
}

/**
 * Exclui um pagamento e reavalia o status da dívida.
 */
export async function deletePayment(paymentId: string) {
  const userId = await getAuthenticatedUserId();

  try {
    // 1. Busca o pagamento para obter o debtId
    const payment = await db.debtPayment.findUnique({
      where: { id: paymentId, debt: { userId: userId } },
      select: { debtId: true },
    });

    if (!payment) {
      return { success: false, error: 'Pagamento não encontrado ou acesso negado.' };
    }

    const debtId = payment.debtId;

    // 2. Exclui o pagamento
    const deletedPayment = await db.debtPayment.delete({
      where: { id: paymentId },
    });

    // 3. Reavalia o status de quitação da dívida
    await revalidateDebtStatus(debtId, userId);

    // Limpa o cache
    revalidatePath('/debts');
    revalidatePath('/');

    return { success: true, payment: deletedPayment };
  } catch (error) {
    console.error(`Erro ao excluir pagamento ${paymentId}:`, error);
    return { success: false, error: 'Falha ao excluir o pagamento.' };
  }
}
// app/actions/onboardingActions.ts
"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import db from "@/lib/prisma"; // Seu Prisma Client
import { SubscriptionStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";

// Defina a função que será chamada pelo componente
export async function completeOnboardingAction(
  subscriptionChoice: SubscriptionStatus // 'FREE' ou 'PREMIUM'
) {
  // 1. Obter a sessão do usuário
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { 
      success: false, 
      message: "Erro: Usuário não autenticado." 
    };
  }

  const userId = session.user.id;

  try {
    // 2. Atualizar o usuário no banco de dados (Prisma)
    await db.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: subscriptionChoice, // Atualiza para FREE ou PREMIUM
        hasCompletedOnboarding: true,          // Marca o onboarding como completo
      },
    });

    // 3. Revalidar o caminho (opcional, mas bom para cache)
    // Se o usuário for para /transactions, revalidamos esse caminho
    revalidatePath("/transactions");
    
    // 4. Retornar sucesso
    return { 
      success: true, 
      message: "Escolha de plano salva com sucesso." 
    };

  } catch (error) {
    console.error("Erro ao completar o onboarding:", error);
    return { 
      success: false, 
      message: "Erro interno do servidor ao salvar a escolha." 
    };
  }

  // 💡 NOTA IMPORTANTE SOBRE A SESSÃO:
  // A sessão do Next-Auth (JWT) será ATUALIZADA na próxima requisição (ex: ao navegar). 
  // O OnboardingGuard irá ler o novo estado hasCompletedOnboarding: true 
  // e subscriptionStatus correto, resolvendo o loop de redirecionamento.
}
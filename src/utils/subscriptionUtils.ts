// lib/subscriptionUtils.ts

// Tipagem para o status de assinatura, garantindo que seja consistente com o Prisma
export type SubscriptionPlan = "FREE" | "PREMIUM" | null;

/**
 * Verifica se o plano de assinatura atual do usuário atende ao plano exigido
 * para aceder a uma funcionalidade ou rota.
 * * @param currentUserPlan O plano atual do usuário (vindo do Next-Auth Session).
 * @param requiredPlan O plano mínimo necessário para a funcionalidade.
 * @returns true se o acesso for permitido, false caso contrário.
 */
export const hasRequiredAccess = (
  currentUserPlan: SubscriptionPlan | undefined, 
  requiredPlan: SubscriptionPlan
): boolean => {
  // 1. Nenhuma restrição
  if (requiredPlan === null) {
    return true; 
  }

  // 2. Plano Exigido: FREE
  // Se o recurso é FREE, o acesso é sempre concedido (assumindo que o usuário está autenticado e tem um plano)
  if (requiredPlan === "FREE") {
    return true;
  }

  // 3. Plano Exigido: PREMIUM
  // Se o recurso exige PREMIUM, o plano do usuário deve ser PREMIUM
  if (requiredPlan === "PREMIUM") {
    return currentUserPlan === "PREMIUM";
  }

  // Fallback (ex: plano inesperado)
  return false;
};
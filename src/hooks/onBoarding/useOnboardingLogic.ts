// hooks/useOnboardingLogic.ts
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { completeOnboardingAction } from "@/app/actions/onboardingActions";

// Definimos o tipo de plano para tipagem forte
type SubscriptionPlan = "FREE" | "PREMIUM";

interface OnboardingLogic {
  loading: boolean;
  handlePlanSelection: (plan: SubscriptionPlan) => Promise<void>;
}

export function useOnboardingLogic(): OnboardingLogic {
  const router = useRouter();
  const { update } = useSession();
  const [loading, setLoading] = useState(false);

  // Usamos useCallback para memorizar a função. 
  // Isso impede que handlePlanSelection seja recriada a cada render, 
  // o que é uma pequena otimização de performance, especialmente se o 
  // componente pai fosse renderizado com frequência.
  const handlePlanSelection = useCallback(
    async (plan: SubscriptionPlan) => {
      setLoading(true);

      const result = await completeOnboardingAction(plan);

      if (result.success) {
        // 1. FORÇA ATUALIZAÇÃO DA SESSÃO (Next-Auth)
        // Isso é crucial para que o Middleware veja o hasCompletedOnboarding: true
        await update();

        // 2. FORÇA NAVEGAÇÃO PARA QUE O MIDDLEWARE POSSA AGIR
        if (plan === "PREMIUM") {
          // Navega para a página de pagamento
          router.push("/checkout/subscription");
        } else {
          // Se for FREE, navega para /transactions. 
          // O Middleware irá interceptar e permitir a navegação, 
          // já que o hasCompletedOnboarding agora é true.
          router.push("/transactions");
        }
      } else {
        console.error("Erro ao selecionar o plano:", result.message);
        // Implementar Toast/Notificação de erro aqui
      }

      // O setLoading(false) é mantido aqui para garantir que o estado seja limpo 
      // em caso de falha da Server Action ou do push.
      setLoading(false);
    },
    [router, update] // Dependências do useCallback
  );

  return {
    loading,
    handlePlanSelection,
  };
}
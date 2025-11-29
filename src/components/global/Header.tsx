// components/Header.tsx
"use client";

import { ContributePixModal } from "./ContributePixModal";
import { LogoApp } from "./logo";
import { SideBar } from "./sidebar";
import { ThemeButton } from "./ThemeButton";
import { UserAvatar } from "./UserAvatar";

import { useSession } from "next-auth/react";
import {
  SubscriptionPlan
} from "@/utils/subscriptionUtils";

const Header = () => {
  const { data: session } = useSession();

  // 1. Obtém o status de assinatura do usuário
  const userSubscriptionStatus = session?.user?.subscriptionStatus as SubscriptionPlan | undefined;

  // 2. Define o plano exigido para NÃO VER o modal Pix. 
  // Queremos esconder de quem tem PREMIUM, ou seja, queremos que SÓ APAREÇA para quem é FREE.
  // Criamos uma flag para verificar se o modal DEVE ser exibido.
  // Se o usuário for FREE, ele DEVE ser exibido.
  // No entanto, para esconder o Pix do Premium, a lógica direta é mais clara:
  const isPremium = userSubscriptionStatus === "PREMIUM";
  const shouldShowPix = !isPremium; // Mostrar se não for Premium (se for FREE)

  return (
    <header className="mb-6 sm:mb-8 border-b pb-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1.5">
          <LogoApp />
        </div>

        <div className="flex items-center gap-2.5">

          {/* 💡 RENDERIZAÇÃO CONDICIONAL */}
          {shouldShowPix && (
            <ContributePixModal />
          )}

          <SideBar />
          <ThemeButton />
          <UserAvatar />
        </div>
      </div>
    </header>
  )
}

export { Header }
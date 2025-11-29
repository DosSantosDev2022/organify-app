// components/SideBar.tsx (COM LÓGICA DE PLANO)
"use client"; // Se ainda não estiver

import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui"
import { Menu, Wallet, Tag, Wrench, TrendingUp, ShoppingBag, Lock } from "lucide-react" // Importar Lock
import Link from "next/link"
import { useSession } from "next-auth/react" // 💡 Importar useSession
import React from 'react';
import { hasRequiredAccess } from "@/utils/subscriptionUtils";

// Definição dos planos (para garantir a tipagem)
type SubscriptionPlan = "FREE" | "PREMIUM" | null;

// Dados dos links de navegação
const navLinks: {
  href: string;
  label: string;
  icon: React.ElementType;
  inDev: boolean;
  requiredPlan: SubscriptionPlan; // Novo campo
}[] = [
    { href: "/transactions", label: "Transações", icon: Wallet, inDev: false, requiredPlan: "FREE" },
    { href: "/categories", label: "Categorias", icon: Tag, inDev: false, requiredPlan: "FREE" },
    { href: "/plan-purchases", label: "Planejar compras", icon: ShoppingBag, inDev: false, requiredPlan: "PREMIUM" },
    { href: "/investments", label: "Investimentos", icon: TrendingUp, inDev: true, requiredPlan: "FREE" },
    { href: "/settings", label: "Configurações", icon: Wrench, inDev: true, requiredPlan: "FREE" },
  ]

const SideBar = () => {
  const { data: session } = useSession();

  // 💡 Obtém o plano do usuário (deve vir da sessão que configuramos anteriormente)
  const userSubscriptionStatus = session?.user?.subscriptionStatus as SubscriptionPlan | undefined;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-64 flex flex-col p-4 sm:w-80">
        <SheetHeader>
          <SheetTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
            Organify App
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col space-y-2 flex-1">
          {navLinks.map((link) => {
            const Icon = link.icon;


            // 💡 VERIFICAÇÃO DE ESTADO DO LINK
            const isUnderDevelopment = link.inDev;
            const hasAccess = hasRequiredAccess(userSubscriptionStatus, link.requiredPlan);

            const isDisabled = isUnderDevelopment || !hasAccess; // Link desabilitado se estiver em Dev OU não tiver acesso

            // Estilos condicionais: Mudar cor do texto e remover hover se desabilitado
            const baseClasses = "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors";
            const classes = isDisabled
              ? `${baseClasses} text-gray-500 cursor-not-allowed` // Estilo desabilitado
              : `${baseClasses} text-foreground hover:bg-muted`; // Estilo normal/ativo

            // Conteúdo visual do link
            const renderLinkContent = (
              <>
                <Icon className={`h-5 w-5 ${isDisabled ? 'text-gray-400' : ''}`} />

                {link.label}

                {/* 💡 INDICADOR DE RESTRIÇÃO */}
                {isUnderDevelopment && (
                  <span className="ml-auto text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-600 rounded-full">
                    Em Breve
                  </span>
                )}
                {!hasAccess && (
                  <span className="ml-auto text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded-full flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Premium
                  </span>
                )}
              </>
            );

            // Renderiza DIV (não clicável) se o link estiver desabilitado ou sem acesso
            if (isDisabled) {
              return (
                <div key={link.label} className={classes}>
                  {renderLinkContent}
                </div>
              );
            }

            // Renderiza LINK (navegável) se houver acesso e não estiver em desenvolvimento
            return (
              <SheetClose asChild key={link.label}>
                <Link
                  href={link.href}
                  className={classes}
                >
                  {renderLinkContent}
                </Link>
              </SheetClose>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export { SideBar }
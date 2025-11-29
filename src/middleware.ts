// middleware.ts

import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define a rota de Onboarding
const ONBOARDING_ROUTE = "/onboarding";

export default withAuth(
  // Esta função é executada após o Next-Auth ter resolvido a sessão
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    
    // O status do usuário é acessível via req.nextauth.token
    const token = req.nextauth.token;

   /*  console.log("Middleware Token Status:", {
      authenticated: !!token,
      hasCompletedOnboarding: token?.hasCompletedOnboarding,
      pathname: req.nextUrl.pathname
    }); */

    // 1. O usuário não completou o Onboarding
    const requiresOnboarding = token?.hasCompletedOnboarding === false;
    
    // 2. O usuário está tentando aceder a uma página privada/protegida (que não é o Onboarding)
    const isAccessingPrivateRoute = pathname !== ONBOARDING_ROUTE;
    
    // 3. O usuário está a aceder a página de Onboarding
    const isOnboardingPage = pathname === ONBOARDING_ROUTE;


    // 🛑 Lógica de Redirecionamento 1: Forçar Onboarding
    // Se for necessário Onboarding E o usuário não estiver na página de Onboarding
    if (requiresOnboarding && isAccessingPrivateRoute) {
      return NextResponse.redirect(new URL(ONBOARDING_ROUTE, req.url));
    }

    // ✅ Lógica de Redirecionamento 2: Sair do Onboarding
    // Se o Onboarding foi completado (hasCompletedOnboarding: true) E o usuário estiver na página de Onboarding
    if (!requiresOnboarding && isOnboardingPage) {
      // Redireciona para o dashboard ou transações após a conclusão
      return NextResponse.redirect(new URL("/transactions", req.url));
    }
    
    // Se nenhuma condição de redirecionamento for atendida, continua
    return NextResponse.next();
  },
  {
    // ⚙️ Configuração do Next-Auth Middleware
    callbacks: {
      // Requer autenticação para todas as rotas definidas no `matcher`
      authorized: ({ token }) => !!token,
    },
    pages: {
        signIn: '/signIn', // Redireciona não autenticados para a tela de login
    }
  }
);

// 🔒 Rotas Protegidas
// O `matcher` define as rotas que este middleware deve proteger
export const config = {
  // Protege todas as rotas exceto: API, estáticos, favicon, landing page, e rotas de autenticação
  matcher: [
    "/transactions",
    "/categories",
    "/plan-purchases",
    "/settings",
    "/onboarding", // Também incluímos o Onboarding para podermos redirecionar para fora dele
  ],
};
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname === "/login";

    // Se estiver autenticado e tentar acessar a página de login, redireciona para o dashboard
    if (isAuthPage && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Retorna true para garantir que a função middleware acima seja sempre executada
      authorized: () => true,
    },
  }
);

// Define as rotas protegidas pelo middleware
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
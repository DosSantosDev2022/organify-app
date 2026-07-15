import type { Metadata } from "next";
import { LoginCard } from "./login-card";
import type { JSX } from "react/jsx-runtime";

export const metadata: Metadata = {
  title: "Login | Organify",
  description: "Faça login para acessar o seu painel financeiro.",
};

export default function LoginPage(): JSX.Element {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
      {/* Elemento de fundo decorativo com gradiente sutil */}
      <div 
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-500/10 via-background to-background" 
        aria-hidden="true" 
      />
      
      <div className="w-full flex justify-center z-10">
        <LoginCard />
      </div>
    </main>
  );
}
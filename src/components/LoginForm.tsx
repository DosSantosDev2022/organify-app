// components/LoginForm.tsx
"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc"; // Importa o ícone do Google
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  // Estado para controlar o loading do botão
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Inicia o fluxo de login do Google
      // O NextAuth cuidará do redirecionamento
      await signIn("google", {
        callbackUrl: "/transactions", // Redireciona para o dashboard após o sucesso
      });
      // O 'toast' de sucesso/erro pode ser tratado na página de callback
      // ou globalmente, mas para o 'signIn' de provedor,
      // o feedback imediato é menos comum.
    } catch (error) {
      // Se o 'signIn' falhar antes do redirecionamento
      console.error("Erro ao tentar logar com o Google:", error);
      setIsLoading(false);
      // Aqui você poderia adicionar um toast.error, se desejado.
    }
  };

  return (
    <div className="w-full">
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <FcGoogle className="mr-2 h-5 w-5" /> // 
        )}
        {isLoading ? "Aguarde..." : "Entrar com Google"}
      </Button>
    </div>
  );
}
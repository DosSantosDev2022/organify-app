// app/onboarding/page.tsx (CORRIGIDO)
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight, HandCoins, Crown, Loader2 } from "lucide-react";
import { useOnboardingLogic } from "@/hooks/onBoarding/useOnboardingLogic";

// Conteúdo estático (mantido o mesmo)
const PREMIUM_FEATURES = [
  "Relatórios Avançados e Customizáveis",
  "Planejamento de compras",
  "Exportação de Dados (CSV/PDF)",
  "Suporte Prioritário",
];

const FREE_FEATURES = [
  "Controle básico de Receitas e Despesas",
  "Visualização Mensal",
  "Acesso Ilimitado",
  "Opção de Contribuição PIX",
];


export default function OnboardingPage() {

  const { loading, handlePlanSelection } = useOnboardingLogic();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 p-4">
      <h1 className="text-4xl font-extrabold text-white mb-3">
        Escolha seu Caminho
      </h1>
      <p className="text-lg text-gray-400 mb-12 max-w-2xl text-center">
        Você pode começar de forma gratuita, ou desbloquear todas as ferramentas
        de gestão com o plano Premium.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Opção FREE */}
        <Card className="p-6 flex flex-col justify-between border-green-500/50">
          <div>
            <CardHeader className="p-0 mb-4 text-center">
              <HandCoins className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <CardTitle className="text-2xl font-bold">Plano Gratuito</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-center">
              <p className="text-4xl font-extrabold text-green-500 mb-6">
                R$ 0,00
              </p>
              <ul className="text-left space-y-2 mb-8 text-muted-foreground">
                {FREE_FEATURES.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </div>
          <Button
            onClick={() => handlePlanSelection("FREE")}
            variant="secondary"
            disabled={loading} // 💡 Desativa o botão
            className="w-full mt-auto bg-green-700 hover:bg-green-800 text-white"
          >
            {/* 💡 Lógica visual de Loading */}
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Redirecionando...
              </>
            ) : (
              <>
                Continuar Grátis
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </Card>

        {/* Opção PREMIUM */}
        <Card className="p-6 flex flex-col justify-between border-primary border-2">
          <div>
            <CardHeader className="p-0 mb-4 text-center">
              <Crown className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-2xl font-bold">Plano Premium</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-center">
              <p className="text-4xl font-extrabold text-primary mb-6">
                R$ 9,90<span className="text-xl font-normal text-muted-foreground">/mês</span>
              </p>
              <ul className="text-left space-y-2 mb-8">
                {PREMIUM_FEATURES.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </div>
          <Button
            onClick={() => handlePlanSelection("PREMIUM")}
            disabled={loading}
            className="w-full mt-auto"
          >
            {loading ? "Aguarde..." : "Assinar e Testar 15 Dias Grátis"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Card>
      </div>
    </div>
  );
}
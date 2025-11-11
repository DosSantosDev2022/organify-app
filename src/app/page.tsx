import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Zap, Target, BarChart3, TrendingUp, Handshake, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// URL da imagem
const APP_SCREENSHOT_URL = "/screenshot.png";

// --- 1. Dados e Estrutura de Conteúdo ---

const features = [
  {
    icon: DollarSign,
    title: "Receitas Simples",
    description: "Registre todas as suas entradas de dinheiro de forma rápida. Seja salário, renda extra ou bônus, tudo em um só lugar.",
  },
  {
    icon: Target,
    title: "Controle de Despesas Fixas",
    description: "Mapeie gastos recorrentes como aluguel e mensalidades. Saiba exatamente quanto está comprometido todo mês.",
  },
  {
    icon: Zap,
    title: "Despesas Variáveis",
    description: "Gerencie gastos do dia a dia, como supermercado e lazer, e identifique onde você pode economizar sem esforço.",
  },
  {
    icon: BarChart3,
    title: "Visualização Clara",
    description: "Gráficos e relatórios fáceis de entender que transformam números complexos em decisões inteligentes.",
  },
];

const pricing = {
  price: "R$ 19,00",
  trialDays: 15,
  billing: "mensal",
};

// --- 2. Componente Principal ---

export default function OrganifyLandingPage() {
  return (
    // 'min-h-screen' garante que o div ocupe todo o ecrã verticalmente
    <div className="dark min-h-screen">

      {/* Header (Responsivo por natureza: container e classes de espaçamento) */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="text-xl sm:text-2xl font-bold text-primary">
            Organify <span className="text-sm font-normal text-primary-foreground">App</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Button
              asChild
              // Aumenta o tamanho do botão em ecrãs maiores
              size="sm"
              className="h-9 px-3 sm:h-10 sm:px-4 sm:text-base text-sm"
            >
              <Link href={'/register'}>
                Teste Grátis
              </Link>
            </Button>

            <Button
              asChild
              variant={'outline'}
              size="sm"
              className="h-9 px-3 sm:h-10 sm:px-4 sm:text-base text-sm"
            >
              <Link href={'/signIn'}>
                Fazer login
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Seção Hero - Ajustes finos no tamanho do texto e espaçamento */}
        <section className="container mx-auto py-16 px-4 text-center sm:py-24 lg:py-32">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Organize Sua Vida Financeira com{" "}
            <span className="text-primary">Simplicidade</span>.
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-400 sm:text-xl lg:text-2xl">
            O Organify transforma o caos financeiro em clareza. Ferramentas poderosas, mas tão simples que qualquer pessoa pode usar.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              asChild
              size="sm"
              className="h-9 px-3 sm:h-10 sm:px-4 sm:text-base text-sm"
            >
              <Link href={'/signIn'}>
                Começar Meu Teste de {pricing.trialDays} Dias!
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {pricing.trialDays} dias grátis. Sem compromisso, cancele quando quiser.
          </p>

          {/* Imagem do Produto (Mockup) - Mantida a largura total dentro do container */}
          <div className="mt-12 sm:mt-16 overflow-hidden rounded-xl shadow-2xl shadow-green-900/50 border border-border">
            <Image
              src={APP_SCREENSHOT_URL}
              alt="Screenshot da interface do aplicativo Organify"
              className="w-full h-auto object-cover"
              width={1280}
              height={600}
              quality={100}
            />
          </div>
        </section>

        {/* Seção de Proposta de Valor: Poderoso, mas Simples - Uso de 'lg:grid-cols-2' para tablets/desktop */}
        <section className="py-16 sm:py-20 bg-secondary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">O Segredo do Organify:</h2>
            <p className="text-base sm:text-xl max-w-4xl mx-auto mb-10 sm:mb-12">
              A organização financeira não precisa ser complicada. Nós removemos a confusão para que você possa focar no que realmente importa: crescer seu patrimônio.
            </p>

            {/* Ajuste: md:grid-cols-2 para duas colunas a partir do tamanho 'md' (tablet) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
              <Card className="text-left p-6 sm:p-8">
                <CardHeader className="p-0 mb-4">
                  <Handshake className="h-7 w-7 sm:h-8 sm:w-8 text-primary mb-2" />
                  <CardTitle className="text-xl sm:text-2xl font-bold">Extremamente Simples</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-sm sm:text-base">
                  A interface é intuitiva e limpa. Menos cliques, mais organização. Se você sabe usar um smartphone, sabe usar o Organify.
                </CardContent>
              </Card>
              <Card className="text-left p-6 sm:p-8">
                <CardHeader className="p-0 mb-4">
                  <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 text-primary mb-2" />
                  <CardTitle className="text-xl sm:text-2xl font-bold">Funcionalidades Poderosas</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-sm sm:text-base">
                  Embora simples, ele não é básico. Controle receitas, despesas (fixas e variáveis) e tenha uma visão completa do seu Saldo Acumulado.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>


        {/* Seção de Recursos (Features) - Uso de grid-cols-1, sm:grid-cols-2, lg:grid-cols-4 */}
        <section className="py-16 sm:py-20 container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">O que você pode fazer com o Organify?</h2>

          {/* Ajuste: grid-cols-1 (mobile), sm:grid-cols-2 (tablet), lg:grid-cols-4 (desktop) */}
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="p-6 text-center transition-transform duration-300 hover:scale-[1.03] hover:shadow-green-500/20 shadow-xl"
              >
                <CardHeader className="flex flex-col items-center p-0">
                  <feature.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-4" />
                  <CardTitle className="text-lg sm:text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="mt-4 p-0 text-sm sm:text-base">
                  {feature.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Seção de Preços e CTA Final - Ajustes no espaçamento e tamanhos de texto */}
        <section className="py-16 sm:py-20 bg-secondary-foreground">
          <div className="container mx-auto px-4 text-center max-w-3xl flex flex-col items-center justify-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Pronto para Começar a Organizar?</h2>
            <p className="text-lg sm:text-xl text-gray-400 mb-8 sm:mb-10">
              Comece hoje o seu teste grátis de {pricing.trialDays} dias e descubra como é fácil ter controlo total.
            </p>

            {/* Cartão de Preço */}
            <Card className="border-border border-2 p-6 sm:p-8 mb-6 sm:mb-8 max-w-xl">
              <CardHeader className="p-0 mb-4">
                <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl sm:text-3xl font-bold">Plano Mensal Completo</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-4xl sm:text-5xl font-extrabold text-primary mt-2 mb-2">
                  {pricing.price}
                  <span className="text-lg sm:text-xl font-normal text-muted-foreground">/{pricing.billing}</span>
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Sem taxas escondidas. Acesso total a todas as funcionalidades.</p>
              </CardContent>
            </Card>

            <Button
              asChild
              size="sm"
              className="h-9 px-3 sm:h-10 sm:px-4 sm:text-base text-sm"
            >
              <Link href={"#"}>
                Aproveitar Teste Grátis de {pricing.trialDays} Dias
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 sm:py-8 text-center text-muted-foreground">
        <div className="container mx-auto px-4">
          <p className="text-sm sm:text-base">&copy; {new Date().getFullYear()} Organify App. Todos os direitos reservados.</p>
          <div className="mt-2 text-xs sm:text-sm space-x-3 sm:space-x-4">
            <Link href="#" className="hover:text-primary transition-colors">Termos de Serviço</Link>
            <Link href="#" className="hover:text-primary transition-colors">Política de Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
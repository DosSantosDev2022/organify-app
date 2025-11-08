import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Zap, Target, BarChart3, TrendingUp, Handshake, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// URL da imagem de exemplo (Substitua pelo caminho real do seu screenshot)
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
    // Usa a classe 'dark' para forçar o Dark Mode se não estiver globalmente configurado
    <div className="dark min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="text-2xl font-bold text-primary">
            Organify <span className="text-sm font-normal text-primary-foreground">App</span>
          </div>
          <Button
            asChild
            size="lg"
          >
            <Link href={'/signIn'}>
              Começar Meu Teste Grátis
            </Link>
          </Button>
        </div>
      </header>

      <main>
        {/* Seção Hero */}
        <section className="container mx-auto py-20 px-4 text-center sm:py-28 lg:py-36">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Organize Sua Vida Financeira com{" "}
            <span className="text-primary">Simplicidade</span>.
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-400 sm:text-2xl">
            O Organify transforma o caos financeiro em clareza. Ferramentas poderosas, mas tão simples que qualquer pessoa pode usar.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              asChild
              className="px-10 py-7 text-lg font-bold transition-all duration-300 transform hover:scale-[1.02]"
            >
              <Link href={'/signIn'}>
                Começar Meu Teste de {pricing.trialDays} Dias!
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {pricing.trialDays} dias grátis. Sem compromisso, cancele quando quiser.
          </p>

          {/* Imagem do Produto (Mockup) */}
          <div className="mt-16 overflow-hidden rounded-xl shadow-2xl shadow-green-900/50 border border-border">
            {/* DOCUMENTAÇÃO: Aqui a imagem deve ser otimizada. No Next.js, é melhor usar o 
              componente <Image /> para otimização de performance. 
              Substitua `APP_SCREENSHOT_URL` pelo caminho real da sua imagem.
            */}
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

        {/* Seção de Proposta de Valor: Poderoso, mas Simples */}
        <section className="py-20 bg-secondary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">O Segredo do Organify:</h2>
            <p className="text-xl max-w-4xl mx-auto mb-12">
              A organização financeira não precisa ser complicada. Nós removemos a confusão para que você possa focar no que realmente importa: crescer seu patrimônio.
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="text-left p-6">
                <CardHeader className="p-0 mb-4">
                  <Handshake className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-2xl font-bold">Extremamente Simples</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  A interface é intuitiva e limpa. Menos cliques, mais organização. Se você sabe usar um smartphone, sabe usar o Organify.
                </CardContent>
              </Card>
              <Card className="text-left p-6">
                <CardHeader className="p-0 mb-4">
                  <TrendingUp className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-2xl font-bold">Funcionalidades Poderosas</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  Embora simples, ele não é básico. Controle receitas, despesas (fixas e variáveis) e tenha uma visão completa do seu Saldo Acumulado.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>


        {/* Seção de Recursos (Features) */}
        <section className="py-20 container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">O que você pode fazer com o Organify?</h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="p-6 text-center transition-transform duration-300 hover:scale-[1.03] hover:shadow-green-500/20 shadow-xl"
              >
                <CardHeader className="flex flex-col items-center p-0">
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="mt-4 p-0">
                  {feature.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Seção de Preços e CTA Final */}
        <section className="py-20 bg-secondary-foreground">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-4xl font-extrabold mb-4">Pronto para Começar a Organizar?</h2>
            <p className="text-xl text-gray-400 mb-8">
              Comece hoje o seu teste grátis de {pricing.trialDays} dias e descubra como é fácil ter controlo total.
            </p>

            {/* Cartão de Preço */}
            <Card className="border-border border-2 p-8 mb-8">
              <CardHeader className="p-0 mb-4">
                <CheckCircle className="h-10 w-10 text-primary mx-auto mb-4" />
                <CardTitle className="text-3xl font-bold">Plano Mensal Completo</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-5xl font-extrabold text-primary mt-2 mb-2">
                  {pricing.price}
                  <span className="text-xl font-normal text-muted-foreground">/{pricing.billing}</span>
                </p>
                <p className="text-sm text-muted-foreground">Sem taxas escondidas. Acesso total a todas as funcionalidades.</p>
              </CardContent>
            </Card>

            <Button
              asChild
              className="px-12 py-8 text-xl font-bold transition-all duration-300 shadow-lg"
            >
              <Link href={"#"}>
                Aproveitar Teste Grátis de {pricing.trialDays} Dias
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Organify App. Todos os direitos reservados.</p>
          <div className="mt-2 text-sm space-x-4">
            <Link href="#" className="hover:text-primary transition-colors">Termos de Serviço</Link>
            <Link href="#" className="hover:text-primary transition-colors">Política de Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
// config/landing-page-content.ts

import { DollarSign, Zap, Target, BarChart3, TrendingUp, Handshake, CheckCircle, HandCoins } from "lucide-react";
import { LucideIcon } from "lucide-react";

// Tipagem para garantir que a estrutura dos dados está correta
type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type PricingPlan = {
  title: string;
  price: string;
  billing: string;
  cta: string;
  features: string[];
  notes?: string;
};

type Content = {
  header: {
    logoName: string;
    logoTag: string;
    signIn: string;
  };
  hero: {
    titlePart1: string;
    titleEmphasis: string;
    subtitle: string;
    ctaButton: string;
    ctaNote: string;
  };
  pixSupport: {
    title: string;
    description: string;
    ctaButton: string;
    link: string;
  };
  valueProposition: {
    title: string;
    subtitle: string;
    cardSimpleTitle: string;
    cardSimpleDescription: string;
    cardPowerfulTitle: string;
    cardPowerfulDescription: string;
  };
  featuresSection: {
    title: string;
    features: Feature[];
  };
  pricingSection: {
    title: string;
    subtitle: string;
    plans: {
      free: PricingPlan;
      premium: PricingPlan;
    };
  };
  footer: {
    copyrightPrefix: string;
    terms: string;
    privacy: string;
  };
};

export const landingPageContent: Content = {
  header: {
    logoName: "Organify",
    logoTag: "App",
    signIn: "Fazer login",
  },
  hero: {
    titlePart1: "Organize Sua Vida Financeira com",
    titleEmphasis: "Simplicidade",
    subtitle: "O Organify transforma o caos financeiro em clareza. Ferramentas poderosas, mas tão simples que qualquer pessoa pode usar.",
    ctaButton: "Começar Agora (Grátis)",
    ctaNote: "Versão Gratuita Ilimitada ou Premium por R$ 9,90/mês.",
  },
  // Nova seção para apoio via PIX
  pixSupport: {
    title: "Apoie o Desenvolvimento",
    description: "Você está usando a versão Gratuita e quer ajudar o projeto? Considere fazer uma contribuição única via PIX de qualquer valor. Sua ajuda garante a melhoria contínua!",
    ctaButton: "Contribuir com PIX",
    link: "#", // O link/botão deve acionar o modal que já implementamos no Header
  },
  valueProposition: {
    title: "O Segredo do Organify:",
    subtitle: "A organização financeira não precisa ser complicada. Nós removemos a confusão para que você possa focar no que realmente importa: crescer seu patrimônio.",
    cardSimpleTitle: "Extremamente Simples",
    cardSimpleDescription: "A interface é intuitiva e limpa. Menos cliques, mais organização. Se você sabe usar um smartphone, sabe usar o Organify.",
    cardPowerfulTitle: "Funcionalidades Poderosas",
    cardPowerfulDescription: "Embora simples, ele não é básico. Controle receitas, despesas (fixas e variáveis) e tenha uma visão completa do seu Saldo Acumulado.",
  },
  featuresSection: {
    title: "O que você pode fazer com o Organify?",
    features: [
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
    ],
  },
  pricingSection: {
    title: "Escolha o Seu Plano",
    subtitle: "Comece com o Gratuito e evolua para o Premium para ter acesso total a todas as ferramentas de gestão.",
    plans: {
      // Plano Gratuito
      free: {
        title: "Plano Gratuito",
        price: "R$ 0,00",
        billing: "para sempre",
        cta: "Começar Agora",
        features: [
          "Controle básico de Receitas e Despesas",
          "Visualização Mensal",
          "Sem limite de tempo",
          "Acesso via Web",
        ],
        notes: "Ideal para quem está começando a organizar as finanças.",
      },
      // Plano Premium (Atualizado para 9,90)
      premium: {
        title: "Plano Premium",
        price: "R$ 9,90",
        billing: "mensal",
        cta: "Assine já",
        features: [
          "Tudo do plano Gratuito, mais:",
          "Relatórios Avançados",
          "Planejamento de compras",
          "Exportação de Dados (CSV/PDF)",
          "Suporte Prioritário",
        ],
        notes: "Controle total para quem leva a organização a sério",
      },
    },
  },
  footer: {
    copyrightPrefix: "Organify App. Todos os direitos reservados.",
    terms: "Termos de Serviço",
    privacy: "Política de Privacidade",
  },
};
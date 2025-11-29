// pages/OrganifyLandingPage.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, HandCoins, Lock, Handshake, TrendingUp } from "lucide-react"; // Adicionado Lock e ArrowRight
import Image from "next/image";
import Link from "next/link";
// 💡 Importar o conteúdo do novo arquivo de configuração
import { landingPageContent } from "../config/landing-page-content";
import { ContributePixModal } from "@/components/global";

// URL da imagem
const APP_SCREENSHOT_URL = "/screenshot.png"; // Mantido por ser um caminho/URL

// --- 1. Extração do Conteúdo ---
const content = landingPageContent;

// --- 2. Componente Principal ---

export default function OrganifyLandingPage() {
  return (
    <div className="dark min-h-screen">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="text-xl sm:text-2xl font-bold text-primary">
            {content.header.logoName} <span className="text-sm font-normal text-primary-foreground">{content.header.logoTag}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Button
              asChild
              // Botão de Ação Principal (Grátis)
              size="sm"
              className="h-9 px-3 sm:h-10 sm:px-4 sm:text-base text-sm"
            >
              <Link href={'/register'}>
                {content.pricingSection.plans.free.cta}
              </Link>
            </Button>

            <Button
              asChild
              variant={'outline'}
              size="sm"
              className="h-9 px-3 sm:h-10 sm:px-4 sm:text-base text-sm"
            >
              <Link href={'/signIn'}>
                {content.header.signIn}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Seção Hero */}
        <section className="container mx-auto py-16 px-4 text-center sm:py-24 lg:py-32">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            {content.hero.titlePart1}{" "}
            <span className="text-primary">{content.hero.titleEmphasis}</span>.
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-400 sm:text-xl lg:text-2xl">
            {content.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              asChild
              size="sm"
              className="h-9 px-3 sm:h-10 sm:px-4 sm:text-base text-sm"
            >
              <Link href={'/register'}>
                {content.hero.ctaButton}
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {content.hero.ctaNote}
          </p>

          {/* Imagem do Produto (Mockup) */}
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

        {/* Seção de Proposta de Valor */}
        <section className="py-16 sm:py-20 bg-secondary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">{content.valueProposition.title}</h2>
            <p className="text-base sm:text-xl max-w-4xl mx-auto mb-10 sm:mb-12">
              {content.valueProposition.subtitle}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
              <Card className="text-left p-6 sm:p-8">
                <CardHeader className="p-0 mb-4">
                  <Handshake className="h-7 w-7 sm:h-8 sm:w-8 text-primary mb-2" />
                  <CardTitle className="text-xl sm:text-2xl font-bold">{content.valueProposition.cardSimpleTitle}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-sm sm:text-base">
                  {content.valueProposition.cardSimpleDescription}
                </CardContent>
              </Card>
              <Card className="text-left p-6 sm:p-8">
                <CardHeader className="p-0 mb-4">
                  <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 text-primary mb-2" />
                  <CardTitle className="text-xl sm:text-2xl font-bold">{content.valueProposition.cardPowerfulTitle}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-sm sm:text-base">
                  {content.valueProposition.cardPowerfulDescription}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Seção de Recursos (Features) */}
        <section className="py-16 sm:py-20 container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">{content.featuresSection.title}</h2>

          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {content.featuresSection.features.map((feature) => (
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

        {/* Seção de Preços (Gratuito vs. Premium) e PIX */}
        <section className="py-16 sm:py-20 bg-secondary-foreground">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">{content.pricingSection.title}</h2>
            <p className="text-lg sm:text-xl text-gray-400 mb-12">
              {content.pricingSection.subtitle}
            </p>

            {/* Layout de Preços: Gratuito e Premium lado a lado */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

              {/* Plano Gratuito */}
              <Card className="p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <CardHeader className="p-0 mb-6">
                    <HandCoins className="h-8 w-8 sm:h-10 sm:w-10 text-green-500 mx-auto mb-4" />
                    <CardTitle className="text-2xl sm:text-3xl font-bold">{content.pricingSection.plans.free.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-4xl sm:text-5xl font-extrabold text-green-500 mt-2 mb-4">
                      {content.pricingSection.plans.free.price}
                      <span className="text-lg sm:text-xl font-normal text-muted-foreground">/{content.pricingSection.plans.free.billing}</span>
                    </p>
                    <ul className="text-left space-y-2 mb-6">
                      {content.pricingSection.plans.free.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm sm:text-base text-muted-foreground">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs sm:text-sm text-muted-foreground">{content.pricingSection.plans.free.notes}</p>
                  </CardContent>
                </div>
                <Button asChild className="mt-6 w-full">
                  <Link href={"/register"}>
                    {content.pricingSection.plans.free.cta}
                  </Link>
                </Button>
              </Card>

              {/* Plano Premium */}
              <Card className="border-primary border-2 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <CardHeader className="p-0 mb-6">
                    <Lock className="h-8 w-8 sm:h-10 sm:w-10 text-primary mx-auto mb-4" />
                    <CardTitle className="text-2xl sm:text-3xl font-bold">{content.pricingSection.plans.premium.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-4xl sm:text-5xl font-extrabold text-primary mt-2 mb-4">
                      {content.pricingSection.plans.premium.price}
                      <span className="text-lg sm:text-xl font-normal text-muted-foreground">/{content.pricingSection.plans.premium.billing}</span>
                    </p>
                    <ul className="text-left space-y-2 mb-6">
                      {content.pricingSection.plans.premium.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm sm:text-base">
                          <CheckCircle className="h-4 w-4 mr-2 text-primary shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs sm:text-sm text-muted-foreground">{content.pricingSection.plans.premium.notes}</p>
                  </CardContent>
                </div>
                <Button asChild className="mt-6 w-full">
                  <Link href={"/register"}>
                    {content.pricingSection.plans.premium.cta}
                  </Link>
                </Button>
              </Card>
            </div>

            {/* 💡 Nova Seção de Contribuição PIX (Apoio) */}
            <div className="mt-16 p-6 sm:p-8 border border-yellow-500/50 rounded-lg max-w-2xl mx-auto bg-yellow-900/10">
              <div className="flex flex-col sm:flex-row items-center justify-between text-left gap-4">
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-yellow-500 flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <HandCoins className="h-6 w-6" />
                    {content.pixSupport.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{content.pixSupport.description}</p>
                </div>
                <ContributePixModal />
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 sm:py-8 text-center text-muted-foreground">
        <div className="container mx-auto px-4">
          <p className="text-sm sm:text-base">&copy; {new Date().getFullYear()} {content.footer.copyrightPrefix}</p>
          <div className="mt-2 text-xs sm:text-sm space-x-3 sm:space-x-4">
            <Link href="#" className="hover:text-primary transition-colors">{content.footer.terms}</Link>
            <Link href="#" className="hover:text-primary transition-colors">{content.footer.privacy}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
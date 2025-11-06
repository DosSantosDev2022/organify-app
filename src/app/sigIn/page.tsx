// app/auth/login/page.tsx (ou similar)
import { LoginForm } from '@/components/LoginForm';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">

      <div className="relative hidden bg-primary p-12 lg:flex lg:flex-col">
        {/* Imagem de Fundo (com opacidade ligeiramente maior) */}
        <Image
          src="/images/background.jpg"
          alt="Imagem de fundo da autenticação"
          fill
          quality={50}
          className="object-cover opacity-10" // Opacidade 10%
        />

        {/* Container de Conteúdo (Organizado com Flex)
          'flex-1' força este div a crescer, empurrando o footer para baixo.
        */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center space-y-6 text-center">
          <Link href="/" className="text-center">
            {/* Logo principal (tamanho ligeiramente ajustado) */}
            <span className="text-5xl font-bold text-primary-foreground">
              Organify App
            </span>
          </Link>

          {/* Slogan (com cor e opacidade corrigidas) */}
          <h3 className="text-3xl font-medium text-primary-foreground/90">
            A ferramenta definitiva para organizar suas finanças pessoais.
          </h3>
        </div>

        {/* Rodapé (Corrigido e posicionado no fundo) */}
        <footer className="relative z-10 text-center text-sm text-primary-foreground/70">
          Todos os direitos reservados &copy; Organify App -{' '}
          {new Date().getFullYear()}
        </footer>
      </div>

      <div className="flex flex-col items-center justify-center p-8">

        {/* Logo visível apenas no mobile */}
        <div className="mb-8 lg:hidden">
          <Link href="/" className="text-center text-3xl font-bold text-primary">
            Organify App
          </Link>
        </div>

        <div className="flex w-full max-w-sm flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Entre com sua conta
            </h1>
            <p className="text-muted-foreground">Organize sua vida financeira!</p>
          </div>

          <LoginForm />
        </div>
      </div>


    </main>
  );
}
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui"

import {
  Menu,
  Wallet,
  Tag,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  BarChart2,
} from "lucide-react"
import Link from "next/link"

// Dados dos links de navegação
const navLinks = [
  { href: "/transactions", label: "Transações", icon: Wallet },
  { href: "/categories", label: "Categorias", icon: Tag },
  { href: "#", label: "Despesas Fixas", icon: ArrowDownCircle },
  { href: "#", label: "Despesas Variáveis", icon: ArrowUpCircle }, // Usei ArrowUpCircle, mas você pode mudar para algo como PiggyBank
  { href: "#", label: "Investimentos", icon: TrendingUp },
  { href: "#", label: "Relatórios", icon: BarChart2 },
]

const SideBar = () => {
  return (
    <Sheet>
      {/* 1. O botão que abre a sidebar (mantido o Menu icon) */}
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      {/* 2. O conteúdo da nossa nova barra lateral */}
      <SheetContent side="left" className="w-64 flex flex-col p-4 sm:w-80">
        <SheetHeader>
          <SheetTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
            Organify App
          </SheetTitle>
        </SheetHeader>
        {/* LOGO E TÍTULO */}


        {/* SEÇÃO DE LINKS DE NAVEGAÇÃO */}
        <nav className="flex flex-col space-y-2 flex-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <SheetClose asChild key={link.label}>
                <Link
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {/* RENDERIZAÇÃO DO ÍCONE */}
                  <Icon className="h-5 w-5" />

                  {link.label}
                </Link>
              </SheetClose>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export { SideBar }
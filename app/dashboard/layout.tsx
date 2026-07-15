// src/app/(dashboard)/layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        {/* Sidebar Oficial do Shadcn */}
        <AppSidebar />

        {/* Área de Conteúdo Principal */}
        <div className="flex flex-1 flex-col overflow-x-hidden">
          {/* Topbar/Header com botão de controle */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 md:px-6">
            <SidebarTrigger className="-ml-1 hover:bg-accent" />
            <div className="h-4 w-px bg-border" />
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Organify - Sistema de Gestão Financeira   
            </span>
          </header>

          {/* Área Principal */}
          <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
"use client"

import type * as React from "react"
import {
  LayoutDashboard,
  ArrowUpDown,
  TrendingDown,
  Tags,
  Settings2,
  Coins,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

const sidebarData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Transações",
      url: "/transactions",
      icon: ArrowUpDown,
    },
    {
      title: "Gestão de Dívidas",
      url: "/debts",
      icon: TrendingDown,
    },
    {
      title: "Categorias",
      url: "/categories",
      icon: Tags,
    },
    {
      title: "Configurações",
      url: "/settings",
      icon: Settings2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* 
        Ajuste do Header:
        - Quando expandido: Mantém padding interno normal.
        - Quando colapsado (isCollapsed): Zera o padding lateral para permitir centralização mecânica perfeita pelo flexbox.
      */}
      <SidebarHeader className={`border-b border-sidebar-border/50 py-4 transition-all duration-200 ${
        isCollapsed ? "px-0" : "px-4"
      }`}>
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center w-full">
            <SidebarMenuButton 
              size="lg" 
              className={`pointer-events-none transition-all duration-200 ${
                isCollapsed ? "justify-center px-0 w-9 h-9" : "w-full justify-start gap-3"
              }`}
            >
              {/* O Container do ícone herda o alinhamento centralizado perfeito */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Coins className="h-5 w-5 animate-pulse" />
              </div>
              
              {!isCollapsed && (
                <div className="flex flex-col gap-0.5 leading-none transition-opacity duration-200">
                  <span className="font-bold text-lg tracking-tight">Organify</span>
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
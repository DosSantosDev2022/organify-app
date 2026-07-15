"use client"

import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon: LucideIcon
}

interface NavMainProps {
  items: NavItem[]
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive = pathname === item.url

        return (
          <SidebarMenuItem key={item.title} className="p-2">
            <SidebarMenuButton
              isActive={isActive}
              tooltip={item.title}
              className="w-full transition-colors data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
            >
              <Link href={item.url} className="flex items-center gap-3 w-full">
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="font-medium text-sm truncate">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
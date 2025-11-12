import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { Header } from "@/components/global";

export const metadata: Metadata = {
  title: "Organify App",
  description: "Organize suas receitas, despesas e investimentos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <Providers>
        <div className="container mx-auto p-4 lg:p-8">
          <Header />
          {children}
        </div>

      </Providers>
    </html>
  );
}

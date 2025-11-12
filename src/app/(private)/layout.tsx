import type { Metadata } from "next";
import { Header } from "@/components/global";

export const metadata: Metadata = {
  title: "Organify App",
  description: "Organize suas receitas, despesas e investimentos",
};

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto p-4 lg:p-8">
      <Header />
      {children}
    </div>
  );
}

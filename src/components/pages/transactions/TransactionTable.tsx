'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { GrTransaction } from "react-icons/gr";
import { Category, Transaction, } from "@prisma/client";
import { formatCurrency } from "@/lib/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, CircleDollarSign, FileText, MoreHorizontal, Pencil, Tag, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Button, Badge } from "@/components/ui";
import { formatStatus } from "@/utils/formatters";
import { StatusVariant } from "@/utils/status-styles";

// A "Transaction" do Prisma tem 'amount' como Int (centavos)
// Mas a nossa 'getTransactions' action já converte para número (reais)
// Então vamos criar um tipo para a prop que espera 'amount' como número.
export type TransactionFromApi = Omit<Transaction, "amount"> & {
  amount: number;
  category: Category | null;
  categoryId: string | null;
};

interface TransactionTableProps {
  transactions: TransactionFromApi[];
  onEdit: (id: string) => void; // Prop para "Editar"
  onDelete: (id: string) => void; // Prop para "Excluir"
}

export function TransactionTable({ transactions, onEdit, onDelete, }: TransactionTableProps) {

  // Lógica para somar os valores lançados na tabela atual
  const totalAmount = transactions.reduce((acc, tx) => acc + tx.amount, 0);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="relative w-full max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20">
        <Table>
          {/* 2. CABEÇALHO MODERNO: Fundo colorido e fixo no topo */}
          <TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm shadow-sm">
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="w-[150px] text-foreground font-semibold">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Data</div>
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Descrição</div>
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-primary" /> Categoria</div>
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                <div className="flex items-center gap-2"><HiOutlineStatusOnline className="w-4 h-4 text-primary" /> Status</div>
              </TableHead>

              <TableHead className="text-right text-foreground font-semibold">
                <div className="flex items-center justify-end gap-2"><CircleDollarSign className="w-4 h-4 text-primary" /> Valor</div>
              </TableHead>
              <TableHead className="text-right text-foreground font-semibold">
                <div className="flex items-center justify-end gap-2"><GrTransaction className="w-4 h-4 text-primary" /> Ações</div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                {/* CORREÇÃO: colSpan={6} para cobrir toda a largura */}
                <TableCell colSpan={6} className="text-center h-32 text-muted-foreground italic">
                  Nenhuma transação encontrada para este período.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id} className="group transition-colors hover:bg-muted/30">
                  <TableCell className="py-4">
                    {format(new Date(tx.date), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>

                  <TableCell className="font-medium">{tx.description}</TableCell>

                  <TableCell>
                    <Badge variant={'outline'} className="bg-background/50 font-normal">
                      {tx.category ? tx.category.name : 'Sem Categoria'}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant={StatusVariant(tx.status)} className="shadow-sm">
                      {formatStatus(tx.status)}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right font-bold tracking-tight">
                    {/* Aqui podemos colocar uma cor dinâmica se quiseres (ex: verde para positivo) */}
                    {formatCurrency(tx.amount)}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onEdit(tx.id)} className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4 text-blue-500" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(tx.id)}
                          className="text-red-500 focus:text-red-500 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          {transactions.length > 0 && (
            <TableFooter className="bg-muted/50 border-t-2">
              <TableRow>
                <TableCell colSpan={4} className="font-bold text-foreground">Total transações</TableCell>
                <TableCell className="text-right font-black text-primary text-lg">
                  {formatCurrency(totalAmount)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>

      {/* Legenda opcional no rodapé para ficar mais limpo */}
      <div className="p-3 border-t bg-muted/20 text-center text-xs text-muted-foreground">
        {transactions.length > 0 ? `Mostrando ${transactions.length} transações` : "Organify App - Gestão Financeira"}
      </div>
    </div>
  );
}
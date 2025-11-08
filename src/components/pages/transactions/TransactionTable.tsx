'use client'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@prisma/client";
import { formatCurrency } from "@/lib/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Button } from "@/components/ui";

// A "Transaction" do Prisma tem 'amount' como Int (centavos)
// Mas a nossa 'getTransactions' action já converte para número (reais)
// Então vamos criar um tipo para a prop que espera 'amount' como número.
export type TransactionFromApi = Omit<Transaction, "amount"> & {
  amount: number;
};

interface TransactionTableProps {
  transactions: TransactionFromApi[];
  onEdit: (id: string) => void; // Prop para "Editar"
  onDelete: (id: string) => void; // Prop para "Excluir"
}

export function TransactionTable({ transactions, onEdit, onDelete, }: TransactionTableProps) {
  return (
    <Table>
      <TableCaption>
        {transactions.length === 0
          ? "Nenhuma transação registrada."
          : "Uma lista das suas transações recentes."}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[180px]">Data</TableHead>
          <TableHead className="">Descrição</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center h-24">
              Nenhuma transação registrada
            </TableCell>
          </TableRow>
        ) : (
          transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>
                {format(new Date(tx.date), "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell className="font-medium">{tx.description}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(tx.amount)}
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {/* Botão Editar */}
                    <DropdownMenuItem onClick={() => onEdit(tx.id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    {/* Botão Excluir */}
                    <DropdownMenuItem
                      onClick={() => onDelete(tx.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
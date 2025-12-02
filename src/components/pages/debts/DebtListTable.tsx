import { useQuery } from '@tanstack/react-query';
import { getDebts } from '@/app/actions/debt-actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { formatDate } from '@/utils/format-date';

export function DebtListTable() {
  const { data: debts, isLoading, isError } = useQuery({
    queryKey: ['debtsList'],
    queryFn: getDebts,
  });

  if (isLoading) return <div className="p-4 text-center">Carregando dívidas...</div>;
  if (isError) return <div className="p-4 text-center text-red-500">Erro ao carregar as dívidas.</div>;
  if (!debts || debts.length === 0) return <div className="p-4 text-center text-gray-400">Nenhuma dívida registrada.</div>;

  return (
    <div className="rounded-md border border-gray-800 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-800/50">
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Valor Inicial</TableHead>
            <TableHead className="text-right">Valor Pago</TableHead>
            <TableHead className="text-right">Saldo Devedor</TableHead>
            <TableHead>Prox. Vencimento</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {debts.map((debt) => (
            <TableRow key={debt.id} className="hover:bg-gray-800/30 transition-colors">
              <TableCell className="font-medium">
                {debt.description}
                {debt.isPaidOff && <CheckCircle className="ml-2 inline h-4 w-4 text-green-500" />}
              </TableCell>
              <TableCell className="text-gray-400">{debt.category || 'N/A'}</TableCell>
              <TableCell className="text-right">{formatCurrency(debt.totalAmount)}</TableCell>
              <TableCell className="text-right text-green-400">{formatCurrency(debt.amountPaid)}</TableCell>
              <TableCell className={`text-right font-bold ${debt.remainingAmount > 0 ? 'text-red-400' : 'text-green-500'}`}>
                {formatCurrency(debt.remainingAmount)}
              </TableCell>
              <TableCell className="text-gray-400">{debt.dueDate ? formatDate(debt.dueDate) : 'N/A'}</TableCell>
              <TableCell>
                <Button variant="ghost" className="h-8 w-8 p-0" title="Ver Detalhes/Adicionar Pagamento">
                  <span className="sr-only">Abrir menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
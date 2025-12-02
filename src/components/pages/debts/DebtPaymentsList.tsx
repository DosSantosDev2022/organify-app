import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';
import { formatDate } from '@/utils/format-date';


interface PaymentInfo {
  id: string;
  paymentDate: Date;
  amountPaid: number;
  installmentNumber: number | null;
}

interface DebtPaymentsListProps {
  payments: PaymentInfo[];
  totalAmount: number;
}

export function DebtPaymentsList({ payments, totalAmount }: DebtPaymentsListProps) {
  if (!payments || payments.length === 0) {
    return (
      <div className="p-4 border border-gray-800 rounded-md text-center text-gray-500">
        Nenhum pagamento registrado ainda para esta dívida.
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-800 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-800/50">
          <TableRow>
            <TableHead className="w-[100px]">Parcela</TableHead>
            <TableHead>Data do Pagamento</TableHead>
            <TableHead className="text-right">Valor Pago</TableHead>
            <TableHead>Notas</TableHead>
            {/* Adicione um <TableHead> para Ações se for implementar edição/exclusão */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id} className="hover:bg-gray-800/30 transition-colors">
              <TableCell className="font-medium text-gray-300">
                {payment.installmentNumber || 'Único'}
              </TableCell>
              <TableCell>{formatDate(payment.paymentDate)}</TableCell>
              <TableCell className="text-right text-green-400 font-semibold">
                {formatCurrency(payment.amountPaid)}
              </TableCell>
              <TableCell className="text-gray-400">
                {/* Aqui você precisaria buscar ou armazenar a nota do pagamento */}
                {/* Atualmente o `notes` está no modelo DebtPayment, mas não incluído na função getDebts para exibição completa. */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';
import { formatDate } from '@/utils/format-date';
import { PaymentActionsMenu } from '@/components/pages/debts/PaymentActionsMenu';
import { JSX } from 'react';

interface PaymentInfo {
  id: string;
  paymentDate: Date;
  amountPaid: number;
  installmentNumber: number | null;
  notes?: string | null | undefined;
}

interface DebtPaymentsListProps {
  debtId: string;
  payments: PaymentInfo[];
  totalAmount: number;
}

/**
 * @component
 * @description Exibe o histórico de pagamentos de uma dívida específica em formato de tabela.
 * Inclui botões de ação (edição/exclusão) para cada pagamento.
 * @param {DebtPaymentsListProps} props As propriedades do componente.
 * @param {string} props.debtId O ID da dívida principal.
 * @param {PaymentInfo[]} props.payments A lista de pagamentos realizados.
 * @param {number} props.totalAmount O valor total da dívida (para contexto).
 * @returns {JSX.Element} A tabela de pagamentos ou uma mensagem de lista vazia.
 */
export function DebtPaymentsList({ payments, debtId }: DebtPaymentsListProps): JSX.Element {
  if (!payments || payments.length === 0) {
    return (
      <div className="p-4 border border-border rounded-md text-center text-muted-foreground">
        Nenhum pagamento registrado ainda para esta dívida.
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border overflow-hidden">
      <div className="max-h-[300px] overflow-y-auto scrollbar-custom">
        <Table>
          <TableHeader className="bg-card/50">
            <TableRow>
              <TableHead className="w-[100px]">Parcela</TableHead>
              <TableHead>Data do Pagamento</TableHead>
              <TableHead className="text-right">Valor Pago</TableHead>
              <TableHead>Notas</TableHead>
              <TableHead className="w-20 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium text-muted-foreground">
                  {payment.installmentNumber || 'Único'}
                </TableCell>
                <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                <TableCell className="text-right text-success font-semibold">
                  {formatCurrency(payment.amountPaid)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {payment.notes || '-'}
                </TableCell>

                {/* CÉLULA DE AÇÕES */}
                <TableCell className="text-right p-2">
                  <PaymentActionsMenu
                    paymentId={payment.id}
                    formattedValue={formatCurrency(payment.amountPaid)}
                    debtId={debtId}
                    // Valores iniciais para o formulário de edição
                    defaultEditValues={{
                      amountPaid: payment.amountPaid,
                      paymentDate: new Date(payment.paymentDate),
                      installmentNumber: payment.installmentNumber ?? undefined,
                      notes: payment.notes ?? '',
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
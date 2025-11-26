import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { PlannedPurchaseForm } from './PlannedPurchaseForm';
import { PlannedPurchaseInitialData as PlannedPurchaseFromApi } from '@/hooks/planned-purchases/use-planned-purchases-controller';

// Tipagem das props do modal
interface PlannedPurchaseFormDialogProps {
  // Propriedades de controle do Modal (obrigatório)
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  // Propriedades para o formulário
  selectedMonth: Date;
  initialData?: PlannedPurchaseFromApi | null; // Dados para pré-preenchimento
}

export function PlannedPurchaseFormDialog({
  isDialogOpen,
  setIsDialogOpen,
  selectedMonth,
  initialData = null,
}: PlannedPurchaseFormDialogProps) {

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Compra Planejada" : "Adicionar Compra Planejada"}
          </DialogTitle>
        </DialogHeader>

        {/* Renderiza o formulário que usa o Controller Hook */}
        <PlannedPurchaseForm
          onClose={handleClose}
          initialData={initialData}
          selectedMonth={selectedMonth}
        />

      </DialogContent>
    </Dialog>
  );
}
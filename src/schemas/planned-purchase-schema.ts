// schemas/planned-purchase-schema.ts
import { z } from 'zod';
import { PlannedPurchaseStatus } from '@prisma/client'; // Importa o Enum do Prisma

// Schema Zod para o formulário de Compra Planejada
export const PlannedPurchaseFormSchema = z.object({
  id: z.string().optional(), // Opcional em caso de criação
  name: z.string().min(1, { message: 'O nome da compra é obrigatório.' }),
  description: z.string().optional(),
  
  // Valor (Recebe string do input, valida e transforma em número)
  amount: z
    .any()
    .refine(
      (val) => val !== undefined && val !== null && val !== "",
      "É necessário informar o valor."
    )
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), "O valor deve ser um número.")
    .refine((val) => val > 0, "O valor deve ser maior que 0."),
  
  // Prazo
  deadline: z.date({ 
    error: 'A data limite é obrigatória.',
  }),
  
  // Status (Opcional na criação, mas útil para edição)
  status: z.nativeEnum(PlannedPurchaseStatus).default(PlannedPurchaseStatus.PENDING),
});

// Tipagem do formulário
export type PlannedPurchaseFormValues = z.infer<typeof PlannedPurchaseFormSchema>;

// Tipo para dados iniciais (incluindo a data como string se vier da API em algum momento)
export interface PlannedPurchaseFromApi {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  deadline: Date;
  status: PlannedPurchaseStatus;
}
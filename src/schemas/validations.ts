// lib/validations.ts
import { z } from "zod";
import { TransactionType } from "@prisma/client";

export const transactionSchema = z.object({
  description: z.string().min(3, {
    message: "A descrição deve ter no mínimo 3 caracteres.",
  }),

  amount: z
    .any()
    .refine(
      (val) => val !== undefined && val !== null && val !== "",
      "É necessário informar o valor."
    )
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), "O valor deve ser um número.")
    .refine((val) => val > 0, "O valor deve ser maior que 0."),

  date: z.date({
    error: "A data é obrigatória.",
  }),

  // Garante que o tipo seja um dos valores do nosso Enum do Prisma
  type: z.enum(TransactionType, {
      // Usamos 'message' para simplificar o tratamento de erros
      message: "O tipo de transação é obrigatório e deve ser válido.", 
    }
  ),

  categoryId: z.string().min(1, "Categoria é obrigatória"),
});

// Vamos também exportar o tipo inferido para usar nos nossos componentes
export type TransactionSchema = z.infer<typeof transactionSchema>;
// lib/validations.ts
import { z } from "zod";
import { TransactionType } from "@prisma/client";

export const transactionSchema = z.object({
  description: z.string().min(3, {
    message: "Description must be at least 3 characters.",
  }),

  amount: z
    .any()
    .refine(
      (val) => val !== undefined && val !== null && val !== "",
      "Amount is required."
    )
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), "Amount must be a number.")
    .refine((val) => val > 0, "Amount must be greater than 0."),

  date: z.date({
    error: "A date is required.",
  }),

  // Garante que o tipo seja um dos valores do nosso Enum do Prisma
  type: z.nativeEnum(TransactionType, {
    error: "Please select a type.",
  }),
});

// Vamos também exportar o tipo inferido para usar nos nossos componentes
export type TransactionSchema = z.infer<typeof transactionSchema>;
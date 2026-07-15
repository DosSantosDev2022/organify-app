// src/lib/prisma.ts
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

if (globalForPrisma.prisma) {
  prismaInstance = globalForPrisma.prisma;
} else {
  // 1. Criamos a conexão pura com o banco usando a variável de ambiente
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  // 2. Criamos o adapter do Prisma v7
  const adapter = new PrismaPg(pool);
  
  // 3. Instanciamos o PrismaClient fornecendo obrigatoriamente o adapter
  prismaInstance = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
  }
}

export const prisma = prismaInstance;
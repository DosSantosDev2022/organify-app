// prisma/seed.ts

import { PrismaClient, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando o seeding de categorias...");

  // 1. Array de Categorias a serem criadas
  const categoriesData = [
    // ------------------------------------
    // RECEITAS (TransactionType.INCOME)
    // ------------------------------------
    { name: "Salário", type: TransactionType.INCOME },
    { name: "Renda Extra", type: TransactionType.INCOME },
    { name: "Presente/Doação", type: TransactionType.INCOME },
    { name: "Bônus", type: TransactionType.INCOME },

    // ------------------------------------
    // DESPESAS FIXAS (TransactionType.FIXED_EXPENSE)
    // ------------------------------------
    { name: "Aluguel", type: TransactionType.FIXED_EXPENSE },
    { name: "Financiamento", type: TransactionType.FIXED_EXPENSE },
    { name: "Condomínio", type: TransactionType.FIXED_EXPENSE },
    { name: "Internet", type: TransactionType.FIXED_EXPENSE },
    { name: "Seguros", type: TransactionType.FIXED_EXPENSE },
    { name: "Energia", type: TransactionType.FIXED_EXPENSE },
    { name: "Água", type: TransactionType.FIXED_EXPENSE },
    { name: "Empréstimos", type: TransactionType.FIXED_EXPENSE },
    { name: "Fatura cartão", type: TransactionType.FIXED_EXPENSE },
    { name: "Supermercado", type: TransactionType.VARIABLE_EXPENSE },
    { name: "Streaming", type: TransactionType.FIXED_EXPENSE },

    // ------------------------------------
    // DESPESAS VARIÁVEIS (TransactionType.VARIABLE_EXPENSE)
    // ------------------------------------
     { name: "Compras", type: TransactionType.FIXED_EXPENSE },
    { name: "Transporte", type: TransactionType.VARIABLE_EXPENSE },
    { name: "Combustível", type: TransactionType.VARIABLE_EXPENSE },
    { name: "Lazer", type: TransactionType.VARIABLE_EXPENSE },
    { name: "Restaurantes", type: TransactionType.VARIABLE_EXPENSE },
    { name: "Saúde", type: TransactionType.VARIABLE_EXPENSE },
    { name: "Vestuário", type: TransactionType.VARIABLE_EXPENSE },

    // ------------------------------------
    // INVESTIMENTOS (TransactionType.INVESTMENT)
    // ------------------------------------
    { name: "Ações Nacionais", type: TransactionType.INVESTMENT },
    { name: "Fundos Imobiliários (FIIs)", type: TransactionType.INVESTMENT },
    { name: "Renda Fixa (CDB, Tesouro)", type: TransactionType.INVESTMENT },
    { name: "Criptomoedas", type: TransactionType.INVESTMENT },
    { name: "Previdência Privada", type: TransactionType.INVESTMENT },
  ];

  // 2. Cria ou atualiza as categorias no banco de dados
  // Você DEVE ter `@@unique([name])` ou outro campo único no seu schema.prisma
  // para usar o 'name' no `where` do upsert!
  for (const data of categoriesData) {
    await prisma.category.upsert({
      where: { name: data.name }, // Busca a categoria pelo nome
      update: { type: data.type }, // Se existir, garante que o tipo está correto
      create: data, // Se não existir, cria
    });
    console.log(`Categoria "${data.name}" garantida.`);
  }

  console.log("Seeding concluído. Categorias criadas/atualizadas com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

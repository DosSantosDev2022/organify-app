// src/utils/formatters.ts (ou src/lib/utils.ts)

/**
 * Mapeia os tipos de categoria do banco de dados (em inglês/uppercase)
 * para um formato amigável e em português para exibição na interface.
 */
const categoryTypeMap: { [key: string]: string } = {
  // Receitas
  'INCOME': 'RECEITA',
  
  // Despesas
  'FIXED_EXPENSE': 'DESPESA FIXA',
  'VARIABLE_EXPENSE': 'DESPESA VARIÁVEL',
  
  // Investimento
  'INVESTMENT': 'INVESTIMENTO',
  
  // Caso tenha outros tipos
  'TRANSFER': 'TRANSFERÊNCIA',
  'DEBT': 'DÍVIDA',
};

/**
 * Converte a chave da categoria (ex: 'FIXED_EXPENSE') para o nome amigável (ex: 'DESPESA FIXA').
 * @param type A chave do tipo de categoria vinda do banco de dados.
 * @returns O nome da categoria formatado ou a chave original se não houver mapeamento.
 */
export function formatCategoryType(type: string): string {
  // Converte a chave para maiúsculas antes de buscar, para garantir a consistência
  const key = type.toUpperCase();
  
  // Retorna o valor mapeado, ou a chave original como fallback (caso um novo tipo seja adicionado e não mapeado)
  return categoryTypeMap[key] || type;
}
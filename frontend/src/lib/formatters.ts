/**
 * Funções utilitárias para formatação e validação de dados
 */

/**
 * Formata CPF adicionando pontos e traço
 * Exemplo: 12345678900 -> 123.456.789-00
 */
export function formatCPF(cpf: string): string {
  // Remove todos os caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, "");
  
  // Limita a 11 dígitos
  const limited = cleaned.slice(0, 11);
  
  // Aplica a máscara
  if (limited.length <= 3) {
    return limited;
  } else if (limited.length <= 6) {
    return `${limited.slice(0, 3)}.${limited.slice(3)}`;
  } else if (limited.length <= 9) {
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
  } else {
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
  }
}

/**
 * Formata CNPJ adicionando pontos, barra e traço
 * Exemplo: 12345678000190 -> 12.345.678/0001-90
 */
export function formatCNPJ(cnpj: string): string {
  // Remove todos os caracteres não numéricos
  const cleaned = cnpj.replace(/\D/g, "");
  
  // Limita a 14 dígitos
  const limited = cleaned.slice(0, 14);
  
  // Aplica a máscara
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 5) {
    return `${limited.slice(0, 2)}.${limited.slice(2)}`;
  } else if (limited.length <= 8) {
    return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5)}`;
  } else if (limited.length <= 12) {
    return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8)}`;
  } else {
    return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8, 12)}-${limited.slice(12)}`;
  }
}

/**
 * Formata telefone brasileiro
 * Exemplos:
 * - 11987654321 -> (11) 98765-4321
 * - 1133334444 -> (11) 3333-4444
 */
export function formatPhone(phone: string): string {
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, "");
  
  // Limita a 11 dígitos
  const limited = cleaned.slice(0, 11);
  
  // Aplica a máscara
  if (limited.length <= 2) {
    return limited.length > 0 ? `(${limited}` : "";
  } else if (limited.length <= 6) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  } else if (limited.length <= 10) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
  } else {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  }
}

/**
 * Formata data para DD/MM/YYYY
 * Exemplo: 25031992 -> 25/03/1992
 */
export function formatDate(date: string): string {
  // Remove todos os caracteres não numéricos
  const cleaned = date.replace(/\D/g, "");
  
  // Limita a 8 dígitos
  const limited = cleaned.slice(0, 8);
  
  // Aplica a máscara
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 4) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  } else {
    return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
  }
}

/**
 * Remove toda a formatação de um CPF
 */
export function unformatCPF(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

/**
 * Remove toda a formatação de um CNPJ
 */
export function unformatCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, "");
}

/**
 * Remove toda a formatação de um telefone
 */
export function unformatPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Converte data de DD/MM/YYYY para YYYY-MM-DD (formato do banco)
 */
export function formatDateToDB(date: string): string {
  const cleaned = date.replace(/\D/g, "");
  
  if (cleaned.length === 8) {
    const day = cleaned.slice(0, 2);
    const month = cleaned.slice(2, 4);
    const year = cleaned.slice(4, 8);
    return `${year}-${month}-${day}`;
  }
  
  return date;
}

/**
 * Valida se um email tem formato válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida se um CPF tem formato válido (11 dígitos)
 */
export function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, "");
  return cleaned.length === 11;
}

/**
 * Valida se um CNPJ tem formato válido (14 dígitos)
 */
export function isValidCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, "");
  return cleaned.length === 14;
}

/**
 * Valida se um telefone tem formato válido (10 ou 11 dígitos)
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10 || cleaned.length === 11;
}

/**
 * Detecta se o documento é CPF ou CNPJ e aplica a formatação adequada
 */
export function formatDocument(document: string): string {
  const cleaned = document.replace(/\D/g, "");
  
  // Se tem 14 dígitos ou mais, assume que é CNPJ
  if (cleaned.length >= 14) {
    return formatCNPJ(document);
  }
  
  // Caso contrário, assume que é CPF
  return formatCPF(document);
}

/**
 * Remove a formatação de qualquer documento
 */
export function unformatDocument(document: string): string {
  return document.replace(/\D/g, "");
}




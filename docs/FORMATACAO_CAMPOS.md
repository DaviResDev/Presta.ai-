# Formatação de Campos - Implementação

Este documento descreve a implementação da formatação automática de campos no formulário de cadastro.

## Resumo das Alterações

Foram implementadas funções de formatação automática para os seguintes campos:
- **CPF**: Formatação automática para 123.456.789-00
- **CNPJ**: Formatação automática para 12.345.678/0001-90
- **Data**: Formatação automática para DD/MM/YYYY
- **Telefone**: Formatação automática para (11) 98765-4321
- **Email**: Validação de formato

## Arquivos Criados/Modificados

### 1. `frontend/src/lib/formatters.ts` (NOVO)

Arquivo criado com funções utilitárias para formatação e validação de dados:

```typescript
// Funções de formatação
- formatCPF(cpf: string): string
- formatCNPJ(cnpj: string): string
- formatPhone(phone: string): string
- formatDate(date: string): string
- formatDocument(document: string): string

// Funções de desformatação
- unformatCPF(cpf: string): string
- unformatCNPJ(cnpj: string): string
- unformatPhone(phone: string): string
- unformatDocument(document: string): string

// Funções de conversão para banco de dados
- formatDateToDB(date: string): string

// Funções de validação
- isValidEmail(email: string): boolean
- isValidCPF(cpf: string): boolean
- isValidCNPJ(cnpj: string): boolean
- isValidPhone(phone: string): boolean
```

### 2. `frontend/src/components/CadastroPage.tsx` (MODIFICADO)

Arquivo modificado para:
1. Importar as funções de formatação
2. Aplicar formatação automática em tempo real durante a digitação
3. Validar os dados antes do envio ao Supabase
4. Remover a formatação antes de salvar no banco de dados

#### Principais mudanças:

**FormCadastroUsuario:**
- CPF: Formatação automática `123.456.789-00`
- Data: Formatação automática `DD/MM/YYYY`
- Email: Validação de formato
- Senha: Validação de mínimo 6 caracteres

**FormCadastroPrestador:**
- Documento (CPF/CNPJ): Formatação automática detecta o tipo
- Email: Validação se fornecido
- Senha: Validação se email fornecido

## Como Funciona

### 1. Formatação em Tempo Real

Quando o usuário digita nos campos, a formatação é aplicada automaticamente:

```typescript
const handleInputChange = (field: string, value: string) => {
  let formattedValue = value;
  
  if (field === "cpf") {
    formattedValue = formatCPF(value);
  } else if (field === "dataNascimento") {
    formattedValue = formatDate(value);
  }
  
  setFormData((prev) => ({ ...prev, [field]: formattedValue }));
};
```

### 2. Validação Antes do Envio

Antes de enviar os dados ao Supabase, as validações são executadas:

```typescript
// Validação de CPF
if (!isValidCPF(formData.cpf)) {
  toast.error("Por favor, insira um CPF válido com 11 dígitos");
  return;
}

// Validação de email
if (!isValidEmail(formData.email)) {
  toast.error("Por favor, insira um email válido");
  return;
}

// Validação de senha
if (formData.senha.length < 6) {
  toast.error("A senha deve ter no mínimo 6 caracteres");
  return;
}
```

### 3. Salvamento no Banco de Dados

Os dados são salvos **SEM** formatação no Supabase:

```typescript
const { error: insertError } = await supabase
  .from("usuarios")
  .insert([
    {
      id: authData.user.id,
      nome_completo: formData.nomeCompleto,
      cpf: unformatCPF(formData.cpf), // Remove formatação: 123.456.789-00 -> 12345678900
      data_nascimento: formatDateToDB(formData.dataNascimento), // Converte: DD/MM/YYYY -> YYYY-MM-DD
      email: formData.email,
    },
  ]);
```

## Tabelas do Supabase

Os dados são salvos nas seguintes tabelas:

### Tabela `usuarios`
- `id`: UUID (vem do auth.users)
- `nome_completo`: string
- `cpf`: string (apenas números)
- `data_nascimento`: date (formato YYYY-MM-DD)
- `email`: string
- `created_at`: timestamp
- `updated_at`: timestamp

### Tabela `prestadores`
- `id`: UUID (opcional, vem do auth.users se email fornecido)
- `nome`: string
- `sobrenome`: string
- `documento`: string (CPF ou CNPJ, apenas números)
- `genero`: string (opcional)
- `rg_url`: string (opcional)
- `email`: string (opcional)
- `created_at`: timestamp
- `updated_at`: timestamp

## Exemplos de Uso

### CPF
```
Usuário digita: 12345678900
Campo exibe: 123.456.789-00
Banco salva: 12345678900
```

### Data
```
Usuário digita: 25031992
Campo exibe: 25/03/1992
Banco salva: 1992-03-25
```

### CNPJ
```
Usuário digita: 12345678000190
Campo exibe: 12.345.678/0001-90
Banco salva: 12345678000190
```

## Correções Realizadas

### Problema: Erro ao Salvar no Supabase
**Erro:** `invalid input syntax for type integer: "uuid"`
**Causa:** Tentativa de inserir UUID do auth.users no campo `id` que espera um integer auto-incrementado

**Solução:** Remoção do campo `id` do insert, deixando o banco gerar automaticamente via `BIGSERIAL`

### Alterações no Código
- ✅ Removido `id: authData.user.id` do insert de usuários
- ✅ Removido `id: authUserId` do insert de prestadores
- ✅ Banco de dados agora gera IDs automaticamente

## Script SQL do Supabase

Foi criado o arquivo `SUPABASE_SETUP.sql` com:
- Schema completo das tabelas `usuarios` e `prestadores`
- Índices para performance
- Row Level Security (RLS) policies
- Triggers para `updated_at`
- Comentários explicativos

**Como usar:**

**Opção 1: Se você já tem tabelas criadas (Recomendado)**
1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em SQL Editor > New Query
4. Cole o conteúdo de `docs/SUPABASE_MIGRATION.sql`
5. Execute

**Opção 2: Se você quer começar do zero (Vai deletar dados!)**
1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em SQL Editor > New Query
4. Cole o conteúdo de `docs/SUPABASE_SETUP_FRESH.sql`
5. Execute

**Opção 3: Se as tabelas não existem**
1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em SQL Editor > New Query
4. Cole o conteúdo de `docs/SUPABASE_SETUP.sql`
5. Execute

## Próximos Passos

1. ✅ Formatação automática implementada
2. ✅ Validações implementadas
3. ✅ Salvamento no Supabase implementado
4. ✅ Erro de tipo corrigido
5. ✅ Script SQL criado
6. 🔲 Executar script SQL no Supabase Dashboard
7. 🔲 Testar com dados reais
8. 🔲 Adicionar mensagens de erro mais específicas se necessário

## Notas Técnicas

- As funções de formatação são "non-destructive", ou seja, aceitam valores já formatados
- A formatação é aplicada apenas durante a digitação
- Os dados são **sempre** salvos sem formatação no banco de dados
- O email é validado no frontend antes do envio
- A senha deve ter no mínimo 6 caracteres (requisito do Supabase Auth)


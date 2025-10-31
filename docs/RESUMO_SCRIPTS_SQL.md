# 📚 Resumo dos Scripts SQL

Este documento lista todos os scripts SQL disponíveis para configurar o banco de dados Supabase.

---

## 🎯 Qual Script Usar?

### 1️⃣ **SUPABASE_MIGRATION.sql** ⭐ RECOMENDADO

**Quando usar:** Se você já tem tabelas criadas mas falta a coluna `documento`

**O que faz:**
- ✅ Verifica se a coluna `documento` existe
- ✅ Se não existe, adiciona a coluna
- ✅ Se a tabela está vazia: cria como NOT NULL UNIQUE
- ✅ Se a tabela tem dados: cria como nullable (seguro!)
- ✅ Cria índices automaticamente
- ✅ **NÃO deleta dados existentes**

**Como executar:**
```sql
-- Cole o conteúdo de SUPABASE_MIGRATION.sql no SQL Editor
-- e clique em Run
```

---

### 2️⃣ **SUPABASE_SETUP_FRESH.sql** ⚠️ CUIDADO

**Quando usar:** Se você quer começar do zero ou recriar tudo

**O que faz:**
- 🗑️ **DELETA** todas as tabelas existentes
- 🗑️ **DELETA** todos os índices
- 🗑️ **DELETA** todas as políticas RLS
- ✅ Recria tudo do zero
- ✅ Configura RLS, índices, triggers

**⚠️ ATENÇÃO:** Vai apagar todos os dados!

**Como executar:**
```sql
-- Cole o conteúdo de SUPABASE_SETUP_FRESH.sql no SQL Editor
-- e clique em Run
```

---

### 3️⃣ **SUPABASE_SETUP.sql**

**Quando usar:** Se as tabelas ainda não existem (primeira vez)

**O que faz:**
- ✅ Cria as tabelas se não existirem
- ✅ Configura RLS, índices, triggers
- ⚠️ **NÃO deleta** tabelas existentes
- ⚠️ Se as tabelas já existem, pode dar erro

**Como executar:**
```sql
-- Cole o conteúdo de SUPABASE_SETUP.sql no SQL Editor
-- e clique em Run
```

---

## 📊 Comparação dos Scripts

| Característica | MIGRATION | SETUP_FRESH | SETUP |
|----------------|-----------|-------------|-------|
| **Adiciona coluna** | ✅ | ✅ | N/A |
| **Deleta dados** | ❌ | ✅ | ❌ |
| **Recria tabelas** | ❌ | ✅ | ❌ |
| **Seguro com dados** | ✅ | ❌ | ✅ |
| **Recomendado** | ⭐ | ⚠️ | ✅ |

---

## 🚀 Passo a Passo Recomendado

### Se você viu o erro "column documento does not exist":

```bash
1. Abra o arquivo: docs/SUPABASE_MIGRATION.sql
2. Copie todo o conteúdo
3. Acesse: https://supabase.com/dashboard
4. Vá em: SQL Editor > New Query
5. Cole o conteúdo
6. Clique em: Run (ou Ctrl+Enter)
7. Verifique a mensagem de sucesso
```

### Se você quer começar do zero:

```bash
1. Abra o arquivo: docs/SUPABASE_SETUP_FRESH.sql
2. Copie todo o conteúdo
3. Acesse: https://supabase.com/dashboard
4. Vá em: SQL Editor > New Query
5. Cole o conteúdo
6. Clique em: Run (ou Ctrl+Enter)
7. ⚠️ Confirme que não há dados importantes!
```

---

## ✅ Verificação

Após executar qualquer script, verifique se funcionou:

```sql
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name IN ('usuarios', 'prestadores')
ORDER BY table_name, ordinal_position;
```

**Resultado esperado:**

### Tabela `usuarios`:
- id (bigint)
- nome_completo (text)
- cpf (text)
- data_nascimento (date)
- email (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

### Tabela `prestadores`:
- id (bigint)
- nome (text)
- sobrenome (text)
- **documento (text)** ← Esta deve aparecer!
- genero (text)
- rg_url (text)
- email (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

---

## 📝 Estrutura Esperada

### Tabela `usuarios`

```sql
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome_completo TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela `prestadores`

```sql
CREATE TABLE prestadores (
    id BIGSERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    sobrenome TEXT NOT NULL,
    documento TEXT NOT NULL UNIQUE,  -- ← Esta coluna estava faltando!
    genero TEXT,
    rg_url TEXT,
    email TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔍 Troubleshooting

### Erro: "column documento does not exist"
**Solução:** Execute `SUPABASE_MIGRATION.sql`

### Erro: "relation already exists"
**Solução:** Execute `SUPABASE_SETUP_FRESH.sql` (vai deletar tudo!) OU `SUPABASE_MIGRATION.sql` (mais seguro)

### Erro: "permission denied"
**Solução:** Verifique se você tem permissões de admin no Supabase

### Erro: "invalid input syntax for type integer"
**Solução:** Já foi corrigido no código! Não precisa fazer nada no SQL.

---

## 📞 Precisa de Ajuda?

Consulte os arquivos:
- `docs/LEIA-ME-SETUP.md` - Guia rápido
- `docs/FORMATACAO_CAMPOS.md` - Documentação completa
- `docs/SUPABASE_CREDENCIAIS.md` - Credenciais do projeto




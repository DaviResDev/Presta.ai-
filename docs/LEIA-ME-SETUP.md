# 🚀 Setup do Banco de Dados Supabase

## ⚠️ Problema: Erro "column documento does not exist"

Se você está vendo este erro, significa que a tabela `prestadores` foi criada sem a coluna `documento`.

## ✅ Solução Rápida

Execute um dos scripts SQL abaixo no Supabase Dashboard:

### 📝 Opção 1: Adicionar coluna (RECOMENDADO)

**Use se:** Você já tem dados nas tabelas e não quer perdê-los

1. Acesse https://supabase.com/dashboard
2. Vá em **SQL Editor** > **New Query**
3. Abra o arquivo `docs/SUPABASE_MIGRATION.sql`
4. Cole todo o conteúdo no editor
5. Clique em **Run** ou pressione `Ctrl+Enter`

✅ Este script **adiciona** a coluna `documento` sem perder dados

---

### 🗑️ Opção 2: Recriar Tabelas (VAI DELETAR DADOS!)

**Use se:** Você não tem dados importantes ou quer começar do zero

1. Acesse https://supabase.com/dashboard
2. Vá em **SQL Editor** > **New Query**
3. Abra o arquivo `docs/SUPABASE_SETUP_FRESH.sql`
4. Cole todo o conteúdo no editor
5. Clique em **Run** ou pressione `Ctrl+Enter`

⚠️ **ATENÇÃO:** Este script **DELETA** todas as tabelas existentes!

---

### 🆕 Opção 3: Criar Tabelas (Primeira Vez)

**Use se:** As tabelas ainda não existem

1. Acesse https://supabase.com/dashboard
2. Vá em **SQL Editor** > **New Query**
3. Abra o arquivo `docs/SUPABASE_SETUP.sql`
4. Cole todo o conteúdo no editor
5. Clique em **Run** ou pressione `Ctrl+Enter`

---

## 📋 Estrutura das Tabelas

### Tabela `usuarios`
```sql
- id (BIGSERIAL PRIMARY KEY)
- nome_completo (TEXT NOT NULL)
- cpf (TEXT NOT NULL UNIQUE)
- data_nascimento (DATE NOT NULL)
- email (TEXT NOT NULL UNIQUE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabela `prestadores`
```sql
- id (BIGSERIAL PRIMARY KEY)
- nome (TEXT NOT NULL)
- sobrenome (TEXT NOT NULL)
- documento (TEXT NOT NULL UNIQUE) ← Esta é a coluna que estava faltando!
- genero (TEXT)
- rg_url (TEXT)
- email (TEXT UNIQUE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## 🧪 Testar

Após executar o script, você pode testar se funcionou:

```sql
-- Ver estrutura das tabelas
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name IN ('usuarios', 'prestadores')
ORDER BY table_name, ordinal_position;
```

Se a coluna `documento` aparecer na lista, está tudo certo! ✅

---

## 🔐 Permissões

Os scripts configuram automaticamente:

✅ **Row Level Security (RLS)** habilitado  
✅ **Policies** para usuários autenticados  
✅ **Índices** para performance  
✅ **Triggers** para atualizar `updated_at`  

---

## ❓ Dúvidas?

Consulte o arquivo `docs/FORMATACAO_CAMPOS.md` para mais detalhes sobre a implementação.




# 🚀 SOLUÇÃO RÁPIDA - Corrigir Erro de Salvamento

## ❌ Problema Atual

Os dados NÃO estão sendo salvos no Supabase porque:
1. **Tabela não existe** ou está **sem RLS configurado corretamente**
2. **Erro 401 Unauthorized** ao tentar inserir
3. **Rate limiting** bloqueando muitas tentativas

---

## ✅ SOLUÇÃO EM 3 PASSOS

### PASSO 1: Execute o Script SQL

1. Abra o arquivo: `docs/SUPABASE_FIX_RAPIDO.sql`
2. **Copie TODO o conteúdo** (Ctrl+A, Ctrl+C)
3. Acesse: https://supabase.com/dashboard
4. Clique em **SQL Editor**
5. Clique em **New Query**
6. **Cole o conteúdo** (Ctrl+V)
7. Clique em **RUN** (ou Ctrl+Enter)

✅ **Resultado esperado:** 
```
Query 1 OK
Query 2 OK
...
Query N OK
✅ Configuração completa! Tabelas e RLS configurados.
```

---

### PASSO 2: Aguarde 30 Segundos

O Supabase tem rate limiting de ~25 segundos entre tentativas de signup.

⏰ **Aguarde pelo menos 30 segundos** desde sua última tentativa.

---

### PASSO 3: Teste Novamente

1. Abra o formulário de cadastro
2. Preencha os dados:
   - Nome: "Teste"
   - CPF: "123.456.789-00"
   - Data: "01/01/2000"
   - Email: "teste@email.com"
   - Senha: "123456"
3. Clique em **Avançar**
4. **Observe o console** (F12 > Console)

✅ **Resultado esperado:**
```
✅ Auth criado com sucesso. User ID: ...
📝 Tentando salvar na tabela usuarios: {...}
✅ Dados salvos com sucesso! ID: {...}
```

❌ **Se ainda falhar**, envie uma captura de tela do console.

---

## 🔍 Debug: O que os Logs Mostram?

Agora temos logs detalhados que mostram:

### ✅ Se funcionou:
```
✅ Auth criado com sucesso. User ID: xxx
📝 Tentando salvar na tabela usuarios: {...}
✅ Dados salvos com sucesso! ID: {...}
```

### ❌ Se falhou:
```
✅ Auth criado com sucesso. User ID: xxx
📝 Tentando salvar na tabela usuarios: {...}
❌ Erro ao salvar dados do usuário:
   Código: 42P01 (Tabela não existe)
   Mensagem: relation "usuarios" does not exist
```

Ou:
```
❌ Erro ao salvar dados do usuário:
   Código: 42501
   Mensagem: new row violates row-level security policy
```

---

## 📋 Explicação do Script

O script `SUPABASE_FIX_RAPIDO.sql` faz:

1. **Remove** tabelas antigas (se existirem)
2. **Cria** tabelas `usuarios` e `prestadores` corretamente
3. **Adiciona** coluna `documento` à tabela `prestadores`
4. **Configura** índices para performance
5. **Habilita** RLS (Row Level Security)
6. **Cria** policies para permitir INSERT/SELECT
7. **Configura** triggers para `updated_at`

### Por que usar `TO anon`?

Durante o cadastro, o usuário ainda não está autenticado. Usamos `anon` (anônimo) para permitir o primeiro INSERT. Depois disso, o usuário pode logar e ter acesso autenticado.

---

## 🆘 Se ainda não funcionar

### Verificação 1: Tabela Existe?

No Supabase Dashboard:
1. **Table Editor** > Verifica se existem `usuarios` e `prestadores`

### Verificação 2: RLS Configurado?

1. **Authentication** > **Policies**
2. Verifica se existem policies para `usuarios` e `prestadores`
3. Deve ter políticas para `anon` (usuário não autenticado)

### Verificação 3: Variáveis de Ambiente?

No arquivo `.env.local`:
```env
VITE_SUPABASE_URL=https://basqmwksnkqmbxijdowj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Verificação 4: Servidor Reiniciado?

Após mudar `.env.local`:
```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente
pnpm dev
```

---

## 📸 Screenshot Esperado

Depois de executar o script, você verá:

**No Supabase Dashboard > SQL Editor:**
```
✅ Configuração completa! Tabelas e RLS configurados.
```

**Na tabela:**
```
table_name  | column_name      | data_type
usuarios    | id               | bigint
usuarios    | nome_completo    | text
usuarios    | cpf              | text
usuarios    | data_nascimento  | date
usuarios    | email            | text
```

---

## 🎯 Próximos Passos Após Sucesso

1. ✅ Teste cadastro de usuário
2. ✅ Teste cadastro de prestador
3. ✅ Verifique se dados aparecem no Table Editor
4. ✅ Configure RLS para produção (se necessário)

---

## 📞 Precisa de Ajuda?

Envie:
1. Captura de tela do console (F12)
2. Captura de tela do erro no formulário
3. Resultado da query de verificação do SQL

Arquivos relacionados:
- `docs/ANALISE_FLUXO_CADASTRO.md` - Análise detalhada
- `docs/CORRECOES_ERROS.md` - Outras correções
- `docs/FORMATACAO_CAMPOS.md` - Documentação completa




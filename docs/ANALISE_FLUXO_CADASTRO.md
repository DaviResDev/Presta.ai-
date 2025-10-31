# 🔍 Análise do Fluxo de Cadastro - Diagnóstico Completo

## 📊 Fluxo Atual de Cadastro

```
1. Usuário preenche formulário
   ↓
2. Validações (CPF, email, senha)
   ↓
3. supabase.auth.signUp() → Cria usuário no Auth
   ↓
4. Se sucesso → tenta inserir na tabela "usuarios"
   ↓
5. Se inserção OK → mostra sucesso
```

## ⚠️ Problemas Identificados

### Problema 1: Rate Limiting (429 Too Many Requests)

**Onde ocorre:** Linha 136 - `supabase.auth.signUp()`

**Causa:** 
- Muitas tentativas em pouco tempo
- Supabase bloqueia por segurança
- Limite: ~1 tentativa a cada 25 segundos

**Sintoma:** Erro 429 na requisição POST para `/auth/v1/signup`

**Tratamento atual:** ✅ Já corrigido
- Mensagem amigável em português
- Não deixa tentar novamente imediatamente

---

### Problema 2: Erro ao Salvar na Tabela (401 Unauthorized)

**Onde ocorre:** Linha 152 - `supabase.from("usuarios").insert()`

**Sintoma:** 
```
Erro ao salvar dados do usuário: Object
Failed to load resource: 401 ()
```

**Possíveis Causas:**

#### A) Row Level Security (RLS) Bloqueando

As tabelas podem ter RLS habilitado mas sem policies adequadas.

**Solução:** Executar script SQL que configura RLS corretamente.

#### B) Tabela Não Existe

A tabela `usuarios` pode não ter sido criada no Supabase.

**Solução:** Executar `SUPABASE_SETUP.sql` ou `SUPABASE_MIGRATION.sql`.

#### C) Permissões Insuficientes

A chave `anon` pode não ter permissão para insert.

**Solução:** Verificar RLS policies.

---

### Problema 3: Fluxo de Tratamento de Erro

**Local:** Linha 163-168

**Problema:** 
```javascript
if (insertError) {
  console.error("Erro ao salvar dados do usuário:", insertError);
  toast.error("Erro ao salvar dados. Tente novamente.");
  setLoading(false);
  return;  // ← Retorna mas ainda está dentro do try!
}
```

O erro não está sendo retornado adequadamente, e o `finally` pode executar antes.

---

## 🎯 Diagnóstico Completo

### Cenário Atual (Baseado nos Logs)

1. ✅ Formulário validado
2. ❌ `signUp()` → **429 Too Many Requests** (primeira tentativa)
3. ⚠️ Usuário tenta novamente
4. ✅ `signUp()` → **200 OK** (segunda tentativa, após aguardar)
5. ✅ `authData.user` → **existe**
6. ❌ `insert()` → **401 Unauthorized** ou **Tabela não existe**
7. ❌ Mensagem: "Erro ao salvar dados. Tente novamente."

### Por que 401?

**Hipótese 1:** RLS Policy bloqueando
- Política existe mas não permite inserts
- Token de sessão não está sendo enviado

**Hipótese 2:** Tabela sem RLS adequado
- RLS habilitado mas sem policies
- Necessita autenticação mas não tem token

**Hipótese 3:** Colunas incorretas
- Tabela existe mas sem colunas esperadas
- Tipo de dado incompatível

---

## ✅ Soluções

### Solução 1: Executar Script SQL (URGENTE)

Execute UM dos scripts seguintes no Supabase Dashboard:

#### Opção A: Se você já tem dados
```sql
-- Execute: SUPABASE_MIGRATION.sql
-- Isso adiciona coluna "documento" sem perder dados
```

#### Opção B: Se você NÃO tem dados (Recomendado)
```sql
-- Execute: SUPABASE_SETUP_FRESH.sql
-- Isso recria TUDO do zero
-- Remove tabelas antigas e cria novas corretamente
```

#### Opção C: Primeira vez
```sql
-- Execute: SUPABASE_SETUP.sql
-- Cria tabelas se não existirem
```

---

### Solução 2: Verificar RLS Policies

No Supabase Dashboard:
1. Vá em **Authentication** > **Policies**
2. Verifique se existem policies para INSERT em `usuarios`
3. Policy deve ser:
   ```sql
   CREATE POLICY "Permitir inserção em usuarios para usuários autenticados"
   ON usuarios FOR INSERT
   TO authenticated
   WITH CHECK (true);
   ```

---

### Solução 3: Adicionar Logs Detalhados (Debug)

Vou adicionar logs mais detalhados para identificar exatamente onde falha.

---

## 📋 Checklist de Verificação

- [ ] ✅ Rate limiting tratado com mensagem amigável
- [ ] ⏳ Aguardou 30+ segundos entre tentativas
- [ ] ❓ Executou script SQL no Supabase?
- [ ] ❓ Verificou se tabela existe no Dashboard?
- [ ] ❓ Verificou RLS Policies?
- [ ] ❓ Testou com dados válidos?

---

## 🚀 Próximos Passos

1. **Execute o script SQL** (`SUPABASE_MIGRATION.sql` ou `SUPABASE_SETUP_FRESH.sql`)
2. **Aguarde 30 segundos**
3. **Teste cadastro novamente**
4. **Se ainda falhar**, vou adicionar logs detalhados




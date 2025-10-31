# 📋 Mapeamento das Tabelas de Área e Serviço Prestado

Este documento mapeia a estrutura das tabelas relacionadas a **Área** e **Serviço Prestado** no banco de dados.

## 📊 Estrutura das Tabelas

### 1. Tabela `areas`
Armazena as áreas de atuação dos prestadores (ex: Residencial, Comercial, Industrial).

```sql
CREATE TABLE areas (
    id BIGSERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos:**
- `id` (BIGSERIAL, PK): Identificador único da área
- `nome` (TEXT, UNIQUE, NOT NULL): Nome da área (ex: "Residencial", "Comercial")
- `created_at` (TIMESTAMP): Data de criação
- `updated_at` (TIMESTAMP): Data da última atualização

---

### 2. Tabela `servicos`
Armazena os serviços que podem ser prestados (ex: Eletricista, Diarista, Encanador).

```sql
CREATE TABLE servicos (
    id BIGSERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos:**
- `id` (BIGSERIAL, PK): Identificador único do serviço
- `nome` (TEXT, UNIQUE, NOT NULL): Nome do serviço (ex: "Eletricista", "Diarista")
- `created_at` (TIMESTAMP): Data de criação
- `updated_at` (TIMESTAMP): Data da última atualização

---

### 3. Tabela `prestador_area` (Relação Muitos-para-Muitos)
Relação entre prestadores e áreas de atuação. Um prestador pode ter várias áreas e uma área pode ter vários prestadores.

```sql
CREATE TABLE prestador_area (
    id BIGSERIAL PRIMARY KEY,
    prestador_id BIGINT NOT NULL REFERENCES prestadores(id) ON DELETE CASCADE,
    area_id BIGINT NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prestador_id, area_id)
);
```

**Campos:**
- `id` (BIGSERIAL, PK): Identificador único da relação
- `prestador_id` (BIGINT, FK): Referência ao prestador (tabela `prestadores`)
- `area_id` (BIGINT, FK): Referência à área (tabela `areas`)
- `created_at` (TIMESTAMP): Data de criação
- **Constraint UNIQUE**: Garante que um prestador não pode ter a mesma área duplicada

**Relacionamentos:**
- `prestador_id` → `prestadores.id` (CASCADE: se prestador for deletado, relações são deletadas)
- `area_id` → `areas.id` (CASCADE: se área for deletada, relações são deletadas)

---

### 4. Tabela `prestador_servico` (Relação Muitos-para-Muitos)
Relação entre prestadores e serviços. Um prestador pode prestar vários serviços e um serviço pode ser prestado por vários prestadores.

```sql
CREATE TABLE prestador_servico (
    id BIGSERIAL PRIMARY KEY,
    prestador_id BIGINT NOT NULL REFERENCES prestadores(id) ON DELETE CASCADE,
    servico_id BIGINT NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prestador_id, servico_id)
);
```

**Campos:**
- `id` (BIGSERIAL, PK): Identificador único da relação
- `prestador_id` (BIGINT, FK): Referência ao prestador (tabela `prestadores`)
- `servico_id` (BIGINT, FK): Referência ao serviço (tabela `servicos`)
- `created_at` (TIMESTAMP): Data de criação
- **Constraint UNIQUE**: Garante que um prestador não pode ter o mesmo serviço duplicado

**Relacionamentos:**
- `prestador_id` → `prestadores.id` (CASCADE: se prestador for deletado, relações são deletadas)
- `servico_id` → `servicos.id` (CASCADE: se serviço for deletado, relações são deletadas)

---

## 🔗 Diagrama de Relacionamentos

```
┌─────────────────┐
│   prestadores   │
│                 │
│  id (PK)        │
│  nome           │
│  sobrenome      │
│  documento      │
└────────┬────────┘
         │
         │ 1:N
         │
    ┌────┴──────────────────────────────┐
    │                                  │
    │                                  │
┌───▼────────────┐          ┌─────────▼─────────┐
│ prestador_area │          │ prestador_servico │
│                │          │                    │
│ id (PK)        │          │ id (PK)            │
│ prestador_id   │          │ prestador_id       │
│ area_id        │          │ servico_id         │
└───┬────────────┘          └─────────┬─────────┘
    │                                  │
    │ N:1                              │ N:1
    │                                  │
┌───▼──────────┐              ┌───────▼─────────┐
│    areas     │              │    servicos    │
│              │              │                 │
│ id (PK)      │              │ id (PK)         │
│ nome         │              │ nome            │
└──────────────┘              └─────────────────┘
```

---

## 📝 Índices Criados

Para melhorar a performance das consultas, foram criados os seguintes índices:

```sql
-- Índices nas tabelas principais
CREATE INDEX idx_areas_nome ON areas(nome);
CREATE INDEX idx_servicos_nome ON servicos(nome);

-- Índices nas tabelas de relacionamento
CREATE INDEX idx_prestador_area_prestador ON prestador_area(prestador_id);
CREATE INDEX idx_prestador_area_area ON prestador_area(area_id);
CREATE INDEX idx_prestador_servico_prestador ON prestador_servico(prestador_id);
CREATE INDEX idx_prestador_servico_servico ON prestador_servico(servico_id);
```

---

## 🔒 Row Level Security (RLS)

Todas as tabelas têm RLS habilitado com políticas que permitem:

- **SELECT**: Qualquer usuário (anon ou authenticated) pode ler
- **INSERT**: Qualquer usuário (anon ou authenticated) pode inserir

Isso permite que o cadastro funcione mesmo sem autenticação inicial.

---

## 💾 Dados Iniciais (Opcional)

O script SQL inclui (comentado) dados iniciais:

**Áreas:**
- Residencial
- Comercial
- Industrial
- Outras

**Serviços:**
- Eletricista
- Diarista
- Encanador
- Pintor
- Vidraceiro
- Pedreiro

Para inserir esses dados, descomente a seção correspondente no arquivo `SUPABASE_TABELAS_AREA_SERVICO.sql`.

---

## 🚀 Como Criar as Tabelas

Execute o script SQL no Supabase Dashboard:

1. Acesse https://supabase.com/dashboard
2. Vá em **SQL Editor** > **New Query**
3. Abra o arquivo `docs/SUPABASE_TABELAS_AREA_SERVICO.sql`
4. Cole todo o conteúdo no editor
5. Clique em **Run** ou pressione `Ctrl+Enter`

---

## 📌 Uso no Código

Essas tabelas são utilizadas em:

1. **`DadosProfissionaisPage.tsx`**: 
   - Carrega áreas e serviços do banco para exibir nos dropdowns
   - Salva relacionamentos `prestador_area` e `prestador_servico`

2. **`HomePage.tsx`**:
   - Permite que prestadores selecionem áreas e serviços
   - Cria relações dinamicamente

---

## ✅ Checklist de Verificação

- [x] Tabela `areas` criada
- [x] Tabela `servicos` criada
- [x] Tabela `prestador_area` criada com Foreign Keys
- [x] Tabela `prestador_servico` criada com Foreign Keys
- [x] Índices criados para performance
- [x] RLS configurado
- [x] Triggers para `updated_at` configurados
- [x] Constraints UNIQUE para evitar duplicatas

---

**Última atualização:** Criado para suportar o cadastro de prestadores com áreas e serviços




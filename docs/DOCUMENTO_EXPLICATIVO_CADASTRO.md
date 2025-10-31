# Documento Explicativo – Cadastro de Usuários e Prestadores de Serviço

## 1. Visão Geral

O sistema possui dois tipos principais de usuários: **prestadores de serviço** e **clientes (usuários comuns)**.

Todos os usuários são registrados na tabela `usuarios`, e prestadores possuem informações adicionais e relações com áreas, serviços e arquivos.

> **Nota:** Incluir aqui a imagem do Figma que mostra o fluxo de cadastro

### Tipos de Usuários

- **Usuários Comuns (Clientes)**: Usuários que contratam serviços
- **Prestadores de Serviço**: Usuários que oferecem serviços através da plataforma

---

## 2. Tabelas e Relacionamentos

### 2.1 Tabela `usuarios`

Armazena dados básicos de todos os usuários: nome, CPF, data de nascimento, email, senha, telefone, endereço, número, CEP e tipo de usuário.

**Estrutura:**
```sql
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome_completo TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    telefone TEXT,
    endereco TEXT,
    numero TEXT,
    cep TEXT,
    tipo_usuario TEXT NOT NULL DEFAULT 'cliente', -- 'cliente' ou 'prestador'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos:**
- `id` (BIGSERIAL, PK): Identificador único do usuário
- `nome_completo` (TEXT, NOT NULL): Nome completo do usuário
- `cpf` (TEXT, UNIQUE, NOT NULL): CPF do usuário
- `data_nascimento` (DATE, NOT NULL): Data de nascimento
- `email` (TEXT, UNIQUE, NOT NULL): Email do usuário
- `senha` (TEXT, NOT NULL): Senha criptografada
- `telefone` (TEXT): Telefone de contato
- `endereco` (TEXT): Endereço completo
- `numero` (TEXT): Número do endereço
- `cep` (TEXT): CEP
- `tipo_usuario` (TEXT, NOT NULL, DEFAULT 'cliente'): Tipo do usuário ('cliente' ou 'prestador')

**Relacionamentos:**
- `prestadores.usuario_id` → `usuarios.id` (1:1)

---

### 2.2 Tabela `prestadores`

Contém dados detalhados do prestador: CNPJ ou CPF, gênero, documentos (RG ou Certidão), tempo de trabalho, nome completo, nickname, bio, redes sociais, disponibilidade e idiomas.

**Estrutura:**
```sql
CREATE TABLE prestadores (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    sobrenome TEXT NOT NULL,
    cpf_cnpj TEXT NOT NULL,
    genero TEXT,
    rg_certidao_url TEXT,
    cartao_cnpj_url TEXT,
    tempo_trabalho TEXT,
    nome_completo TEXT,
    nickname TEXT,
    foto_perfil_url TEXT,
    bio TEXT,
    telefone TEXT,
    email TEXT,
    instagram TEXT,
    linkedin TEXT,
    disponibilidade TEXT,
    idiomas TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos:**
- `id` (BIGSERIAL, PK): Identificador único do prestador
- `usuario_id` (BIGINT, FK, UNIQUE): Referência ao usuário (tabela `usuarios`)
- `nome` (TEXT, NOT NULL): Nome do prestador
- `sobrenome` (TEXT, NOT NULL): Sobrenome do prestador
- `cpf_cnpj` (TEXT, NOT NULL): CPF ou CNPJ do prestador
- `genero` (TEXT): Gênero
- `rg_certidao_url` (TEXT): URL do documento RG ou Certidão (Supabase Storage)
- `cartao_cnpj_url` (TEXT): URL do cartão CNPJ (Supabase Storage)
- `tempo_trabalho` (TEXT): Tempo de experiência (ex: "5 anos")
- `nome_completo` (TEXT): Nome completo do prestador
- `nickname` (TEXT): Apelido/Nickname
- `foto_perfil_url` (TEXT): URL da foto de perfil (Supabase Storage)
- `bio` (TEXT): Biografia/descrição do prestador
- `telefone` (TEXT): Telefone de contato
- `email` (TEXT): Email do prestador
- `instagram` (TEXT): Perfil do Instagram
- `linkedin` (TEXT): Perfil do LinkedIn
- `disponibilidade` (TEXT): Horários de disponibilidade (ex: "Seg-Sex 09:00-18:00")
- `idiomas` (TEXT[]): Array de idiomas falados

**Relacionamentos:**
- `prestador_areas.prestador_id` → `prestadores.id` (1:N)
- `prestador_servicos.prestador_id` → `prestadores.id` (1:N)
- `arquivos_prestador.prestador_id` → `prestadores.id` (1:N)

---

### 2.3 Tabela `areas_profissionais` e `servicos_prestados`

**Tabela `areas_profissionais`:**

Contém os tipos de atuação (Design, Marketing, TI, etc.).

```sql
CREATE TABLE areas_profissionais (
    id BIGSERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Tabela `servicos_prestados`:**

Contém os serviços disponíveis para cada área.

```sql
CREATE TABLE servicos_prestados (
    id BIGSERIAL PRIMARY KEY,
    area_id BIGINT NOT NULL REFERENCES areas_profissionais(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(area_id, nome)
);
```

**Campos `servicos_prestados`:**
- `id` (BIGSERIAL, PK): Identificador único do serviço
- `area_id` (BIGINT, FK): Referência à área profissional
- `nome` (TEXT, NOT NULL): Nome do serviço
- **Constraint UNIQUE**: Garante que não haja serviços duplicados na mesma área

**Relacionamentos:**
- `prestador_areas.area_id` → `areas_profissionais.id` (N:1)
- `prestador_servicos.servico_id` → `servicos_prestados.id` (N:1)
- `servicos_prestados.area_id` → `areas_profissionais.id` (N:1)

---

### 2.4 Tabelas de Relacionamento

#### Tabela `prestador_areas`

Define quais áreas o prestador atua.

```sql
CREATE TABLE prestador_areas (
    id BIGSERIAL PRIMARY KEY,
    prestador_id BIGINT NOT NULL REFERENCES prestadores(id) ON DELETE CASCADE,
    area_id BIGINT NOT NULL REFERENCES areas_profissionais(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prestador_id, area_id)
);
```

**Relacionamento Muitos-para-Muitos:**
- Um prestador pode ter várias áreas
- Uma área pode ter vários prestadores

---

#### Tabela `prestador_servicos`

Define quais serviços o prestador oferece.

```sql
CREATE TABLE prestador_servicos (
    id BIGSERIAL PRIMARY KEY,
    prestador_id BIGINT NOT NULL REFERENCES prestadores(id) ON DELETE CASCADE,
    servico_id BIGINT NOT NULL REFERENCES servicos_prestados(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prestador_id, servico_id)
);
```

**Relacionamento Muitos-para-Muitos:**
- Um prestador pode oferecer vários serviços
- Um serviço pode ser oferecido por vários prestadores
- **Regra de Negócio:** Serviços só podem ser escolhidos dentro das áreas selecionadas

---

#### Tabela `arquivos_prestador`

Armazena arquivos anexos como RG, Certidão, Cartão CNPJ ou Galeria de projetos.

```sql
CREATE TABLE arquivos_prestador (
    id BIGSERIAL PRIMARY KEY,
    prestador_id BIGINT NOT NULL REFERENCES prestadores(id) ON DELETE CASCADE,
    tipo_arquivo TEXT NOT NULL, -- 'RG', 'Certidão', 'Cartão CNPJ', 'Galeria', etc.
    url TEXT NOT NULL, -- URL no Supabase Storage
    nome_arquivo TEXT,
    tamanho BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos:**
- `id` (BIGSERIAL, PK): Identificador único do arquivo
- `prestador_id` (BIGINT, FK): Referência ao prestador
- `tipo_arquivo` (TEXT, NOT NULL): Tipo do arquivo ('RG', 'Certidão', 'Cartão CNPJ', 'Galeria')
- `url` (TEXT, NOT NULL): URL do arquivo no Supabase Storage
- `nome_arquivo` (TEXT): Nome original do arquivo
- `tamanho` (BIGINT): Tamanho do arquivo em bytes

**Relacionamento:**
- `arquivos_prestador.prestador_id` → `prestadores.id` (N:1)

---

## 3. Fluxo de Cadastro

### 3.1 Cadastro de Usuário Comum (Cliente)

**Passo 1:** Usuário preenche dados básicos
- Nome completo
- CPF
- Data de nascimento
- Email
- Senha

**Passo 2:** Criação do registro
```sql
INSERT INTO usuarios (nome_completo, cpf, data_nascimento, email, senha, tipo_usuario)
VALUES ('Ana Pereira', '123.456.789-00', '1990-05-15', 'ana@email.com', 'senha123', 'cliente');
```

**Passo 3:** Opcional - Completar perfil
- Telefone
- Endereço
- Número
- CEP

---

### 3.2 Cadastro de Prestador de Serviço

#### Etapa 1: Dados Pessoais

**Passo 1:** Criar usuário base
```sql
INSERT INTO usuarios (nome_completo, cpf, data_nascimento, email, senha, tipo_usuario)
VALUES ('João Silva', '987.654.321-00', '1985-10-10', 'joao@email.com', 'senha123', 'prestador');
```

**Passo 2:** Criar registro do prestador
```sql
INSERT INTO prestadores (
    usuario_id, nome, sobrenome, cpf_cnpj, genero, rg_certidao_url
)
VALUES (
    1, -- ID do usuário criado acima
    'João',
    'Silva',
    '12.345.678/0001-99',
    'Masculino',
    'https://exemplo.com/rg.jpg'
);
```

#### Etapa 2: Dados Profissionais

**Passo 3:** Selecionar áreas de atuação
```sql
-- Criar/buscar áreas
INSERT INTO areas_profissionais (nome) VALUES ('Design Gráfico'), ('Marketing Digital')
ON CONFLICT (nome) DO NOTHING;

-- Vincular áreas ao prestador
INSERT INTO prestador_areas (prestador_id, area_id) VALUES 
(1, 1), -- Design Gráfico
(1, 2); -- Marketing Digital
```

**Passo 4:** Selecionar serviços prestados
```sql
-- Criar serviços (vinculados às áreas)
INSERT INTO servicos_prestados (area_id, nome) VALUES
(1, 'Criação de Logotipos'),    -- Área: Design Gráfico
(1, 'Identidade Visual'),        -- Área: Design Gráfico
(2, 'Gestão de Redes Sociais'),  -- Área: Marketing Digital
(2, 'Tráfego Pago');             -- Área: Marketing Digital

-- Vincular serviços ao prestador
INSERT INTO prestador_servicos (prestador_id, servico_id) VALUES 
(1, 1), -- Criação de Logotipos
(1, 2), -- Identidade Visual
(1, 3); -- Gestão de Redes Sociais
```

**Regra:** Serviços só podem ser escolhidos dentro das áreas selecionadas.

**Passo 5:** Upload de arquivos
```sql
INSERT INTO arquivos_prestador (prestador_id, tipo_arquivo, url, nome_arquivo) VALUES
(1, 'RG', 'https://storage.supabase.co/objects/rg.jpg', 'rg.jpg'),
(1, 'Cartão CNPJ', 'https://storage.supabase.co/objects/cnpj.jpg', 'cnpj.jpg'),
(1, 'Galeria', 'https://storage.supabase.co/objects/projeto1.jpg', 'projeto1.jpg');
```

#### Etapa 3: Completar Perfil (Opcional)

**Passo 6:** Adicionar informações complementares
```sql
UPDATE prestadores SET
    tempo_trabalho = '5 anos',
    nome_completo = 'João Silva',
    nickname = 'joaodesigner',
    foto_perfil_url = 'https://storage.supabase.co/objects/perfil.jpg',
    bio = 'Designer gráfico especializado em identidades visuais.',
    telefone = '(41)99999-1111',
    instagram = '@joaodesigner',
    linkedin = 'linkedin.com/in/joaosilva',
    disponibilidade = 'Seg-Sex 09:00-18:00',
    idiomas = ARRAY['Português', 'Inglês']
WHERE id = 1;
```

---

### 3.3 Visualização de Dados

#### Consultar Perfil Completo de Prestador

```sql
SELECT 
    u.nome_completo AS usuario_nome,
    u.cpf AS usuario_cpf,
    u.data_nascimento,
    u.email AS usuario_email,
    p.nome_completo AS prestador_nome_completo,
    p.nickname AS prestador_nickname,
    p.bio,
    p.foto_perfil_url,
    p.tempo_trabalho,
    p.disponibilidade,
    p.idiomas,
    ARRAY_AGG(DISTINCT a.nome) AS areas_profissionais,
    ARRAY_AGG(DISTINCT s.nome) AS servicos_prestados,
    ARRAY_AGG(DISTINCT jsonb_build_object(
        'tipo', f.tipo_arquivo,
        'url', f.url,
        'nome', f.nome_arquivo
    )) AS arquivos
FROM prestadores p
LEFT JOIN usuarios u ON u.id = p.usuario_id
LEFT JOIN prestador_areas pa ON pa.prestador_id = p.id
LEFT JOIN areas_profissionais a ON a.id = pa.area_id
LEFT JOIN prestador_servicos ps ON ps.prestador_id = p.id
LEFT JOIN servicos_prestados s ON s.id = ps.servico_id
LEFT JOIN arquivos_prestador f ON f.prestador_id = p.id
WHERE p.id = 1
GROUP BY p.id, u.id;
```

#### Consultar Usuário que não é Prestador

```sql
SELECT 
    u.nome_completo,
    u.cpf,
    u.data_nascimento,
    u.email,
    u.telefone,
    u.endereco,
    u.numero,
    u.cep
FROM usuarios u
WHERE u.tipo_usuario = 'cliente'
  AND u.id = 2; -- ID específico ou remover para listar todos
```

#### Listar Todos os Prestadores com Áreas e Serviços

```sql
SELECT 
    p.id,
    u.nome_completo,
    p.nickname,
    ARRAY_AGG(DISTINCT a.nome) AS areas,
    ARRAY_AGG(DISTINCT s.nome) AS servicos
FROM prestadores p
INNER JOIN usuarios u ON u.id = p.usuario_id
LEFT JOIN prestador_areas pa ON pa.prestador_id = p.id
LEFT JOIN areas_profissionais a ON a.id = pa.area_id
LEFT JOIN prestador_servicos ps ON ps.prestador_id = p.id
LEFT JOIN servicos_prestados s ON s.id = ps.servico_id
GROUP BY p.id, u.id
ORDER BY u.nome_completo;
```

---

## 4. Exemplos de Inserção de Dados

### 4.1 Criar Usuários

```sql
-- Usuário Prestador
INSERT INTO usuarios (nome_completo, cpf, data_nascimento, email, senha, tipo_usuario)
VALUES 
('João Silva', '987.654.321-00', '1985-10-10', 'joao@email.com', 'senha123', 'prestador');

-- Usuário Cliente
INSERT INTO usuarios (nome_completo, cpf, data_nascimento, email, senha, tipo_usuario)
VALUES 
('Ana Pereira', '123.456.789-00', '1990-05-15', 'ana@email.com', 'senha123', 'cliente');
```

### 4.2 Criar Prestador

```sql
INSERT INTO prestadores (
    usuario_id, nome, sobrenome, cpf_cnpj, genero, 
    rg_certidao_url, cartao_cnpj_url, tempo_trabalho, 
    nome_completo, nickname, foto_perfil_url, bio, 
    telefone, email, instagram, linkedin, disponibilidade, idiomas
)
VALUES 
(
    1, -- ID do usuário criado acima
    'João',
    'Silva',
    '12.345.678/0001-99',
    'Masculino',
    'https://storage.supabase.co/objects/rg.jpg',
    'https://storage.supabase.co/objects/cnpj.jpg',
    '5 anos',
    'João Silva',
    'joaodesigner',
    'https://storage.supabase.co/objects/perfil.jpg',
    'Designer gráfico especializado em identidades visuais.',
    '(41)99999-1111',
    'joao@email.com',
    '@joaodesigner',
    'linkedin.com/in/joaosilva',
    'Seg-Sex 09:00-18:00',
    ARRAY['Português', 'Inglês']
);
```

### 4.3 Criar Áreas e Serviços

```sql
-- Criar Áreas Profissionais
INSERT INTO areas_profissionais (nome) VALUES 
('Design Gráfico'), 
('Marketing Digital')
ON CONFLICT (nome) DO NOTHING;

-- Criar Serviços (vinculados às áreas)
INSERT INTO servicos_prestados (area_id, nome) VALUES
(1, 'Criação de Logotipos'),      -- Área: Design Gráfico
(1, 'Identidade Visual'),          -- Área: Design Gráfico
(2, 'Gestão de Redes Sociais'),    -- Área: Marketing Digital
(2, 'Tráfego Pago');               -- Área: Marketing Digital
```

### 4.4 Vincular Prestador a Áreas e Serviços

```sql
-- Vincular Áreas ao Prestador
INSERT INTO prestador_areas (prestador_id, area_id) VALUES 
(1, 1), -- Design Gráfico
(1, 2); -- Marketing Digital

-- Vincular Serviços ao Prestador
INSERT INTO prestador_servicos (prestador_id, servico_id) VALUES 
(1, 1), -- Criação de Logotipos
(1, 2), -- Identidade Visual
(1, 3); -- Gestão de Redes Sociais
```

### 4.5 Upload de Arquivos do Prestador

```sql
INSERT INTO arquivos_prestador (prestador_id, tipo_arquivo, url, nome_arquivo) VALUES
(1, 'RG', 'https://storage.supabase.co/objects/rg.jpg', 'rg.jpg'),
(1, 'Cartão CNPJ', 'https://storage.supabase.co/objects/cnpj.jpg', 'cnpj.jpg'),
(1, 'Galeria', 'https://storage.supabase.co/objects/projeto1.jpg', 'projeto1.jpg'),
(1, 'Galeria', 'https://storage.supabase.co/objects/projeto2.jpg', 'projeto2.jpg');
```

---

## 5. Exemplos de SELECT

### 5.1 Prestador de Serviço Completo

```sql
SELECT 
    u.nome_completo AS usuario_nome,
    u.cpf AS usuario_cpf,
    p.nome_completo AS prestador_nome_completo,
    p.nickname AS prestador_nickname,
    p.bio,
    p.tempo_trabalho,
    p.disponibilidade,
    p.idiomas,
    ARRAY_AGG(DISTINCT a.nome) AS areas_profissionais,
    ARRAY_AGG(DISTINCT s.nome) AS servicos_prestados,
    ARRAY_AGG(DISTINCT f.url) AS arquivos
FROM prestadores p
LEFT JOIN usuarios u ON u.id = p.usuario_id
LEFT JOIN prestador_areas pa ON pa.prestador_id = p.id
LEFT JOIN areas_profissionais a ON a.id = pa.area_id
LEFT JOIN prestador_servicos ps ON ps.prestador_id = p.id
LEFT JOIN servicos_prestados s ON s.id = ps.servico_id
LEFT JOIN arquivos_prestador f ON f.prestador_id = p.id
WHERE p.id = 1
GROUP BY p.id, u.id;
```

### 5.2 Usuário que não é Prestador

```sql
SELECT 
    u.nome_completo,
    u.cpf,
    u.data_nascimento,
    u.email,
    u.telefone,
    u.endereco,
    u.numero,
    u.cep
FROM usuarios u
WHERE u.tipo_usuario = 'cliente';
```

### 5.3 Buscar Prestadores por Área

```sql
SELECT 
    p.id,
    u.nome_completo,
    p.nickname,
    p.foto_perfil_url,
    p.bio,
    ARRAY_AGG(DISTINCT s.nome) AS servicos_oferecidos
FROM prestadores p
INNER JOIN usuarios u ON u.id = p.usuario_id
INNER JOIN prestador_areas pa ON pa.prestador_id = p.id
INNER JOIN areas_profissionais a ON a.id = pa.area_id
LEFT JOIN prestador_servicos ps ON ps.prestador_id = p.id
LEFT JOIN servicos_prestados s ON s.id = ps.servico_id
WHERE a.nome = 'Design Gráfico'
GROUP BY p.id, u.id
ORDER BY u.nome_completo;
```

### 5.4 Buscar Prestadores por Serviço

```sql
SELECT 
    p.id,
    u.nome_completo,
    p.nickname,
    p.foto_perfil_url,
    p.bio,
    a.nome AS area_profissional
FROM prestadores p
INNER JOIN usuarios u ON u.id = p.usuario_id
INNER JOIN prestador_servicos ps ON ps.prestador_id = p.id
INNER JOIN servicos_prestados s ON s.id = ps.servico_id
INNER JOIN areas_profissionais a ON a.id = s.area_id
WHERE s.nome = 'Criação de Logotipos'
GROUP BY p.id, u.id, a.nome
ORDER BY u.nome_completo;
```

---

## 6. Diagrama de Relacionamentos

```
┌─────────────────┐
│    usuarios     │
│                 │
│  id (PK)        │
│  nome_completo  │
│  cpf            │
│  email          │
│  senha          │
│  tipo_usuario   │
│  ...            │
└────────┬────────┘
         │
         │ 1:1
         │
┌────────▼────────┐
│   prestadores   │
│                 │
│  id (PK)        │
│  usuario_id (FK)│
│  nome           │
│  sobrenome      │
│  cpf_cnpj       │
│  ...            │
└────┬────────────┘
     │
     │ 1:N
     │
     ├──────────────┬──────────────────┬──────────────────┐
     │              │                  │                  │
┌────▼────────┐ ┌──▼──────────┐ ┌────▼──────────┐ ┌───▼─────────────┐
│ prestador_  │ │ prestador_   │ │ arquivos_     │ │                 │
│   areas     │ │  servicos    │ │ prestador     │ │                 │
│             │ │              │ │               │ │                 │
│ id (PK)     │ │ id (PK)      │ │ id (PK)       │ │                 │
│ prestador_  │ │ prestador_   │ │ prestador_id  │ │                 │
│   id (FK)   │ │   id (FK)    │ │ tipo_arquivo  │ │                 │
│ area_id (FK)│ │ servico_id   │ │ url           │ │                 │
│             │ │   (FK)       │ │               │ │                 │
└────┬────────┘ └──┬───────────┘ └────────────────┘ └─────────────────┘
     │             │
     │ N:1         │ N:1
     │             │
┌────▼──────────┐ │ ┌───────────────────┐
│ areas_        │ │ │ servicos_prestados │
│ profissionais│ │ │                    │
│              │ │ │ id (PK)            │
│ id (PK)      │ │ │ area_id (FK)       │
│ nome         │ │ │ nome               │
└──────────────┘ │ └────────────────────┘
                 │
                 │ N:1
                 │
                 └────► (servicos_prestados.area_id → areas_profissionais.id)
```

---

## ✅ Resumo dos Relacionamentos

### Hierarquia de Tabelas

1. **`usuarios`** → Base para todos os usuários do sistema
   - Distingue entre 'cliente' e 'prestador' via `tipo_usuario`

2. **`prestadores`** → Informações adicionais de prestadores
   - Relacionado 1:1 com `usuarios` via `usuario_id`

3. **`areas_profissionais`** → Tipos de áreas de atuação
   - Exemplos: Design Gráfico, Marketing Digital, TI

4. **`servicos_prestados`** → Serviços específicos dentro de cada área
   - Relacionado N:1 com `areas_profissionais` via `area_id`

5. **`prestador_areas`** → Relação M:N entre prestadores e áreas
   - Um prestador pode ter várias áreas
   - Uma área pode ter vários prestadores

6. **`prestador_servicos`** → Relação M:N entre prestadores e serviços
   - Um prestador pode oferecer vários serviços
   - Um serviço pode ser oferecido por vários prestadores
   - **Regra:** Serviços só podem ser escolhidos dentro das áreas selecionadas

7. **`arquivos_prestador`** → Arquivos anexos do prestador
   - RG, Certidão, Cartão CNPJ, Galeria de projetos
   - URLs armazenadas no Supabase Storage

### Fluxo de Cadastro Completo

1. **Criar usuário** na tabela `usuarios` com `tipo_usuario = 'prestador'`
2. **Criar registro em prestadores** vinculado ao usuário via `usuario_id`
3. **Selecionar áreas** → Inserir em `prestador_areas`
4. **Selecionar serviços** (dentro das áreas escolhidas) → Inserir em `prestador_servicos`
5. **Anexar arquivos** → Inserir em `arquivos_prestador`
6. **Completar perfil** (opcional) → Atualizar campos em `prestadores`

---

**Última atualização:** Documento criado com base na estrutura do banco de dados e fluxo de cadastro




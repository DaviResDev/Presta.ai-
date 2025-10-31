-- ============================================
-- Script para Atualizar Tabela prestadores com Campos do Perfil
-- ============================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- Este script adiciona os campos necessários para o formulário de perfil do prestador

-- ============================================
-- Adicionar colunas se não existirem
-- ============================================

-- Nickname (único, sem espaços)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'prestadores' AND column_name = 'nickname') THEN
        ALTER TABLE prestadores ADD COLUMN nickname TEXT UNIQUE;
        CREATE INDEX IF NOT EXISTS idx_prestadores_nickname ON prestadores(nickname);
        RAISE NOTICE 'Coluna nickname adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna nickname já existe';
    END IF;
END $$;

-- Foto de perfil
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'prestadores' AND column_name = 'foto_perfil_url') THEN
        ALTER TABLE prestadores ADD COLUMN foto_perfil_url TEXT;
        RAISE NOTICE 'Coluna foto_perfil_url adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna foto_perfil_url já existe';
    END IF;
END $$;

-- Bio/Descrição
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'prestadores' AND column_name = 'bio') THEN
        ALTER TABLE prestadores ADD COLUMN bio TEXT;
        RAISE NOTICE 'Coluna bio adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna bio já existe';
    END IF;
END $$;

-- Redes Sociais / Instagram
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'prestadores' AND column_name = 'rede_social') THEN
        ALTER TABLE prestadores ADD COLUMN rede_social TEXT;
        RAISE NOTICE 'Coluna rede_social adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna rede_social já existe';
    END IF;
END $$;

-- Verificar se instagram existe, se não, criar rede_social
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'prestadores' AND column_name = 'instagram') THEN
        -- Se instagram existe, usar ele para rede_social se rede_social não existir
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'prestadores' AND column_name = 'rede_social') THEN
            ALTER TABLE prestadores ADD COLUMN rede_social TEXT;
            -- Copiar dados do instagram para rede_social
            UPDATE prestadores SET rede_social = instagram WHERE instagram IS NOT NULL;
        END IF;
        RAISE NOTICE 'Coluna instagram existe, rede_social configurada';
    END IF;
END $$;

-- LinkedIn
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'prestadores' AND column_name = 'linkedin') THEN
        ALTER TABLE prestadores ADD COLUMN linkedin TEXT;
        RAISE NOTICE 'Coluna linkedin adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna linkedin já existe';
    END IF;
END $$;

-- Disponibilidade (pode ser múltipla escolha, armazenado como array ou texto separado)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'prestadores' AND column_name = 'disponibilidade') THEN
        ALTER TABLE prestadores ADD COLUMN disponibilidade TEXT[];
        RAISE NOTICE 'Coluna disponibilidade adicionada com sucesso como array';
    ELSE
        -- Se já existir como TEXT, pode ser convertido para array se necessário
        RAISE NOTICE 'Coluna disponibilidade já existe';
    END IF;
END $$;

-- Idiomas (já pode existir como array)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'prestadores' AND column_name = 'idiomas') THEN
        ALTER TABLE prestadores ADD COLUMN idiomas TEXT[];
        RAISE NOTICE 'Coluna idiomas adicionada com sucesso como array';
    ELSE
        RAISE NOTICE 'Coluna idiomas já existe';
    END IF;
END $$;

-- Telefone (já pode existir)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'prestadores' AND column_name = 'telefone') THEN
        ALTER TABLE prestadores ADD COLUMN telefone TEXT;
        CREATE INDEX IF NOT EXISTS idx_prestadores_telefone ON prestadores(telefone);
        RAISE NOTICE 'Coluna telefone adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna telefone já existe';
    END IF;
END $$;

-- Email Profissional (já pode existir como email)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'prestadores' AND column_name = 'email_profissional') THEN
        -- Se já existe 'email', podemos usar ele ou criar um novo campo
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'prestadores' AND column_name = 'email') THEN
            -- Email já existe, usar ele como email_profissional
            RAISE NOTICE 'Coluna email já existe, será usado como email_profissional';
        ELSE
            ALTER TABLE prestadores ADD COLUMN email_profissional TEXT;
            CREATE INDEX IF NOT EXISTS idx_prestadores_email_profissional ON prestadores(email_profissional);
            RAISE NOTICE 'Coluna email_profissional adicionada com sucesso';
        END IF;
    ELSE
        RAISE NOTICE 'Coluna email_profissional já existe';
    END IF;
END $$;

-- ============================================
-- Criar índices para melhor performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_prestadores_nickname ON prestadores(nickname) WHERE nickname IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_prestadores_email ON prestadores(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_prestadores_telefone ON prestadores(telefone) WHERE telefone IS NOT NULL;

-- ============================================
-- Adicionar constraints UNIQUE se necessário
-- ============================================

-- Garantir que nickname seja único (se ainda não tiver constraint)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'prestadores_nickname_key' 
        AND conrelid = 'prestadores'::regclass
    ) THEN
        -- Tentar adicionar constraint UNIQUE apenas se não houver duplicatas
        BEGIN
            ALTER TABLE prestadores ADD CONSTRAINT prestadores_nickname_key UNIQUE (nickname);
            RAISE NOTICE 'Constraint UNIQUE adicionada para nickname';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Não foi possível adicionar constraint UNIQUE para nickname: %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'Constraint UNIQUE para nickname já existe';
    END IF;
END $$;

-- ============================================
-- Verificar estrutura final
-- ============================================
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'prestadores'
AND column_name IN (
    'nickname', 
    'foto_perfil_url', 
    'bio', 
    'rede_social', 
    'instagram',
    'linkedin', 
    'disponibilidade', 
    'idiomas', 
    'telefone', 
    'email',
    'email_profissional'
)
ORDER BY column_name;


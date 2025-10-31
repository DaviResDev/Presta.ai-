-- ============================================
-- FIX RÁPIDO - Configuração Completa
-- ============================================
-- Execute este script para configurar TUDO rapidamente
-- Copie e cole no SQL Editor do Supabase Dashboard

-- ============================================
-- ETAPA 1: Limpar Tudo (CUIDADO!)
-- ============================================
DROP TABLE IF EXISTS prestadores CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- ============================================
-- ETAPA 2: Criar Tabelas
-- ============================================

-- Tabela usuarios
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome_completo TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela prestadores
CREATE TABLE prestadores (
    id BIGSERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    sobrenome TEXT NOT NULL,
    documento TEXT NOT NULL UNIQUE,
    genero TEXT,
    rg_url TEXT,
    email TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ETAPA 3: Índices
-- ============================================
CREATE INDEX idx_usuarios_cpf ON usuarios(cpf);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_prestadores_documento ON prestadores(documento);
CREATE INDEX idx_prestadores_email ON prestadores(email);

-- ============================================
-- ETAPA 4: RLS - Row Level Security
-- ============================================

-- Habilita RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestadores ENABLE ROW LEVEL SECURITY;

-- IMPORTANTE: Permitir INSERT para usuários NÃO AUTENTICADOS durante cadastro
CREATE POLICY "Permitir INSERT anon usuarios"
ON usuarios FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Permitir SELECT anon usuarios"
ON usuarios FOR SELECT
TO anon
USING (true);

CREATE POLICY "Permitir INSERT anon prestadores"
ON prestadores FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Permitir SELECT anon prestadores"
ON prestadores FOR SELECT
TO anon
USING (true);

-- ============================================
-- ETAPA 5: Função e Trigger para updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prestadores_updated_at 
    BEFORE UPDATE ON prestadores 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ETAPA 6: Verificação
-- ============================================

-- Ver estrutura das tabelas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name IN ('usuarios', 'prestadores')
ORDER BY table_name, ordinal_position;

-- Ver policies RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename IN ('usuarios', 'prestadores');

-- Mensagem de sucesso
SELECT '✅ Configuração completa! Tabelas e RLS configurados.' AS status;




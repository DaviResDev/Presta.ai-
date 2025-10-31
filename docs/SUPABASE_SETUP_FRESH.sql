-- ============================================
-- Script de Setup FRESCO do Banco de Dados Supabase
-- ============================================
-- ATENÇÃO: Este script IRÁ DELETAR todas as tabelas existentes!
-- Use apenas se quiser começar do zero.
-- Execute este script no SQL Editor do Supabase Dashboard
-- Acesse: https://supabase.com/dashboard > SQL Editor > New Query

-- ============================================
-- ETAPA 1: REMOVER TABELAS EXISTENTES (SE EXISTIREM)
-- ============================================
-- Remove triggers primeiro
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
DROP TRIGGER IF EXISTS update_prestadores_updated_at ON prestadores;

-- Remove políticas RLS
DROP POLICY IF EXISTS "Permitir inserção em usuarios para usuários autenticados" ON usuarios;
DROP POLICY IF EXISTS "Permitir leitura em usuarios para usuários autenticados" ON usuarios;
DROP POLICY IF EXISTS "Permitir inserção em prestadores para usuários autenticados" ON prestadores;
DROP POLICY IF EXISTS "Permitir leitura em prestadores para usuários autenticados" ON prestadores;

-- Remove tabelas
DROP TABLE IF EXISTS prestadores CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Remove função se existir
DROP FUNCTION IF EXISTS update_updated_at_column();

-- ============================================
-- ETAPA 2: CRIAR TABELAS NOVAS
-- ============================================

-- Tabela: usuarios
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome_completo TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: prestadores
CREATE TABLE prestadores (
    id BIGSERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    sobrenome TEXT NOT NULL,
    documento TEXT NOT NULL UNIQUE, -- CPF ou CNPJ
    genero TEXT,
    rg_url TEXT,
    email TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ETAPA 3: CRIAR ÍNDICES
-- ============================================

-- Índices para usuarios
CREATE INDEX idx_usuarios_cpf ON usuarios(cpf);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_data_nascimento ON usuarios(data_nascimento);

-- Índices para prestadores
CREATE INDEX idx_prestadores_documento ON prestadores(documento);
CREATE INDEX idx_prestadores_email ON prestadores(email);

-- ============================================
-- ETAPA 4: CONFIGURAR ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilita RLS nas tabelas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestadores ENABLE ROW LEVEL SECURITY;

-- Política para INSERT: qualquer usuário autenticado pode inserir em usuarios
CREATE POLICY "Permitir inserção em usuarios para usuários autenticados"
ON usuarios FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política para SELECT: qualquer usuário autenticado pode ler usuarios
CREATE POLICY "Permitir leitura em usuarios para usuários autenticados"
ON usuarios FOR SELECT
TO authenticated
USING (true);

-- Política para INSERT: qualquer usuário autenticado pode inserir em prestadores
CREATE POLICY "Permitir inserção em prestadores para usuários autenticados"
ON prestadores FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política para SELECT: qualquer usuário autenticado pode ler prestadores
CREATE POLICY "Permitir leitura em prestadores para usuários autenticados"
ON prestadores FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- ETAPA 5: CRIAR FUNÇÕES E TRIGGERS
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prestadores_updated_at 
    BEFORE UPDATE ON prestadores 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ETAPA 6: VERIFICAÇÃO
-- ============================================

-- Mostra a estrutura das tabelas criadas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name IN ('usuarios', 'prestadores')
ORDER BY table_name, ordinal_position;

-- Confirmação
SELECT 'Tabelas criadas com sucesso!' AS status;




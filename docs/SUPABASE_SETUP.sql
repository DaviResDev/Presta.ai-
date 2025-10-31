-- ============================================
-- Script de Setup do Banco de Dados Supabase
-- ============================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- Acesse: https://supabase.com/dashboard > SQL Editor > New Query

-- ============================================
-- Tabela: usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome_completo TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Tabela: prestadores
-- ============================================
CREATE TABLE IF NOT EXISTS prestadores (
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
-- Índices para melhor performance
-- ============================================

-- Índices para usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_cpf ON usuarios(cpf);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_data_nascimento ON usuarios(data_nascimento);

-- Índices para prestadores
CREATE INDEX IF NOT EXISTS idx_prestadores_documento ON prestadores(documento);
CREATE INDEX IF NOT EXISTS idx_prestadores_email ON prestadores(email);

-- ============================================
-- Row Level Security (RLS)
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

-- Se você quiser permitir acesso anônimo (não autenticado), use:
-- TO anon
-- ATENÇÃO: Isso é menos seguro, use apenas para desenvolvimento

-- ============================================
-- Função para atualizar updated_at automaticamente
-- ============================================
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
-- Exemplo de dados de teste (OPCIONAL)
-- ============================================
-- Descomente para inserir dados de teste

/*
INSERT INTO usuarios (nome_completo, cpf, data_nascimento, email)
VALUES 
    ('João Silva', '12345678900', '1990-01-15', 'joao.silva@email.com'),
    ('Maria Santos', '98765432100', '1985-05-20', 'maria.santos@email.com');

INSERT INTO prestadores (nome, sobrenome, documento, genero, email)
VALUES 
    ('Carlos', 'Oliveira', '12345678000190', 'masculino', 'carlos.oliveira@email.com'),
    ('Ana', 'Costa', '98765432100', 'feminino', 'ana.costa@email.com');
*/

-- ============================================
-- Verificação das tabelas criadas
-- ============================================
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name IN ('usuarios', 'prestadores')
ORDER BY table_name, ordinal_position;




-- ============================================
-- Script para Criar Tabelas de Área e Serviço
-- ============================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- Acesse: https://supabase.com/dashboard > SQL Editor > New Query
--
-- Este script cria as tabelas necessárias para:
-- - Áreas (ex: Residencial, Comercial, Industrial)
-- - Serviços (ex: Eletricista, Diarista, Encanador)
-- - Relacionamentos: prestador_area e prestador_servico

-- ============================================
-- Tabela: areas
-- ============================================
CREATE TABLE IF NOT EXISTS areas (
    id BIGSERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Tabela: servicos
-- ============================================
CREATE TABLE IF NOT EXISTS servicos (
    id BIGSERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Tabela: prestador_area (relação muitos-para-muitos)
-- ============================================
CREATE TABLE IF NOT EXISTS prestador_area (
    id BIGSERIAL PRIMARY KEY,
    prestador_id BIGINT NOT NULL REFERENCES prestadores(id) ON DELETE CASCADE,
    area_id BIGINT NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prestador_id, area_id)
);

-- ============================================
-- Tabela: prestador_servico (relação muitos-para-muitos)
-- ============================================
CREATE TABLE IF NOT EXISTS prestador_servico (
    id BIGSERIAL PRIMARY KEY,
    prestador_id BIGINT NOT NULL REFERENCES prestadores(id) ON DELETE CASCADE,
    servico_id BIGINT NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prestador_id, servico_id)
);

-- ============================================
-- Índices para melhor performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_areas_nome ON areas(nome);
CREATE INDEX IF NOT EXISTS idx_servicos_nome ON servicos(nome);
CREATE INDEX IF NOT EXISTS idx_prestador_area_prestador ON prestador_area(prestador_id);
CREATE INDEX IF NOT EXISTS idx_prestador_area_area ON prestador_area(area_id);
CREATE INDEX IF NOT EXISTS idx_prestador_servico_prestador ON prestador_servico(prestador_id);
CREATE INDEX IF NOT EXISTS idx_prestador_servico_servico ON prestador_servico(servico_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestador_area ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestador_servico ENABLE ROW LEVEL SECURITY;

-- Políticas para áreas
CREATE POLICY "Permitir leitura em areas para todos"
ON areas FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Permitir inserção em areas para todos"
ON areas FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Políticas para serviços
CREATE POLICY "Permitir leitura em servicos para todos"
ON servicos FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Permitir inserção em servicos para todos"
ON servicos FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Políticas para prestador_area
CREATE POLICY "Permitir leitura em prestador_area para todos"
ON prestador_area FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Permitir inserção em prestador_area para todos"
ON prestador_area FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Políticas para prestador_servico
CREATE POLICY "Permitir leitura em prestador_servico para todos"
ON prestador_servico FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Permitir inserção em prestador_servico para todos"
ON prestador_servico FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ============================================
-- Triggers para atualizar updated_at
-- ============================================
CREATE TRIGGER update_areas_updated_at 
    BEFORE UPDATE ON areas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_servicos_updated_at 
    BEFORE UPDATE ON servicos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Dados iniciais (OPCIONAL)
-- ============================================
-- Descomente para inserir dados iniciais

/*
-- Inserir áreas iniciais
INSERT INTO areas (nome) VALUES
    ('Residencial'),
    ('Comercial'),
    ('Industrial'),
    ('Outras')
ON CONFLICT (nome) DO NOTHING;

-- Inserir serviços iniciais
INSERT INTO servicos (nome) VALUES
    ('Eletricista'),
    ('Diarista'),
    ('Encanador'),
    ('Pintor'),
    ('Vidraceiro'),
    ('Pedreiro')
ON CONFLICT (nome) DO NOTHING;
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
WHERE table_name IN ('areas', 'servicos', 'prestador_area', 'prestador_servico')
ORDER BY table_name, ordinal_position;

-- Confirmação
SELECT '✅ Tabelas de Área e Serviço criadas com sucesso!' AS status;




-- ============================================
-- Script para Configurar RLS nas Tabelas de Área e Serviço
-- ============================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- Este script configura Row Level Security para permitir acesso às tabelas

-- ============================================
-- Configurar RLS para areas_profissionais
-- ============================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Permitir leitura em areas_profissionais para todos" ON areas_profissionais;
DROP POLICY IF EXISTS "Permitir inserção em areas_profissionais para todos" ON areas_profissionais;
DROP POLICY IF EXISTS "Permitir leitura em areas para todos" ON areas_profissionais;
DROP POLICY IF EXISTS "Permitir inserção em areas para todos" ON areas_profissionais;

-- Garantir que RLS está habilitado
ALTER TABLE areas_profissionais ENABLE ROW LEVEL SECURITY;

-- Política para SELECT: qualquer um pode ler (anon e authenticated)
CREATE POLICY "Permitir leitura em areas_profissionais para todos"
ON areas_profissionais FOR SELECT
TO anon, authenticated
USING (true);

-- Política para INSERT: qualquer um pode inserir (anon e authenticated)
CREATE POLICY "Permitir inserção em areas_profissionais para todos"
ON areas_profissionais FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ============================================
-- Configurar RLS para servicos_prestados
-- ============================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Permitir leitura em servicos_prestados para todos" ON servicos_prestados;
DROP POLICY IF EXISTS "Permitir inserção em servicos_prestados para todos" ON servicos_prestados;
DROP POLICY IF EXISTS "Permitir leitura em servicos para todos" ON servicos_prestados;
DROP POLICY IF EXISTS "Permitir inserção em servicos para todos" ON servicos_prestados;

-- Garantir que RLS está habilitado
ALTER TABLE servicos_prestados ENABLE ROW LEVEL SECURITY;

-- Política para SELECT: qualquer um pode ler (anon e authenticated)
CREATE POLICY "Permitir leitura em servicos_prestados para todos"
ON servicos_prestados FOR SELECT
TO anon, authenticated
USING (true);

-- Política para INSERT: qualquer um pode inserir (anon e authenticated)
CREATE POLICY "Permitir inserção em servicos_prestados para todos"
ON servicos_prestados FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ============================================
-- Configurar RLS para prestador_areas
-- ============================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Permitir leitura em prestador_areas para todos" ON prestador_areas;
DROP POLICY IF EXISTS "Permitir inserção em prestador_areas para todos" ON prestador_areas;
DROP POLICY IF EXISTS "Permitir leitura em prestador_area para todos" ON prestador_areas;
DROP POLICY IF EXISTS "Permitir inserção em prestador_area para todos" ON prestador_areas;

-- Garantir que RLS está habilitado (se a tabela existir)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'prestador_areas') THEN
        ALTER TABLE prestador_areas ENABLE ROW LEVEL SECURITY;
        
        -- Política para SELECT: qualquer um pode ler (anon e authenticated)
        CREATE POLICY "Permitir leitura em prestador_areas para todos"
        ON prestador_areas FOR SELECT
        TO anon, authenticated
        USING (true);

        -- Política para INSERT: qualquer um pode inserir (anon e authenticated)
        CREATE POLICY "Permitir inserção em prestador_areas para todos"
        ON prestador_areas FOR INSERT
        TO anon, authenticated
        WITH CHECK (true);
    END IF;
END $$;

-- ============================================
-- Configurar RLS para prestador_servicos
-- ============================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Permitir leitura em prestador_servicos para todos" ON prestador_servicos;
DROP POLICY IF EXISTS "Permitir inserção em prestador_servicos para todos" ON prestador_servicos;
DROP POLICY IF EXISTS "Permitir leitura em prestador_servico para todos" ON prestador_servicos;
DROP POLICY IF EXISTS "Permitir inserção em prestador_servico para todos" ON prestador_servicos;

-- Garantir que RLS está habilitado (se a tabela existir)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'prestador_servicos') THEN
        ALTER TABLE prestador_servicos ENABLE ROW LEVEL SECURITY;
        
        -- Política para SELECT: qualquer um pode ler (anon e authenticated)
        CREATE POLICY "Permitir leitura em prestador_servicos para todos"
        ON prestador_servicos FOR SELECT
        TO anon, authenticated
        USING (true);

        -- Política para INSERT: qualquer um pode inserir (anon e authenticated)
        CREATE POLICY "Permitir inserção em prestador_servicos para todos"
        ON prestador_servicos FOR INSERT
        TO anon, authenticated
        WITH CHECK (true);
    END IF;
END $$;

-- ============================================
-- Verificar políticas criadas
-- ============================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename IN ('areas_profissionais', 'servicos_prestados', 'prestador_areas', 'prestador_servicos')
ORDER BY tablename, policyname;

-- Testar se consegue ler os dados
SELECT COUNT(*) AS total_areas FROM areas_profissionais;
SELECT COUNT(*) AS total_servicos FROM servicos_prestados;

-- Mensagem de sucesso
SELECT '✅ RLS configurado com sucesso!' AS status;

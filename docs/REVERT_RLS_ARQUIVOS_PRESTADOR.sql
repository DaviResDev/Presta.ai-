-- ============================================
-- Script para Reverter RLS na Tabela arquivos_prestador
-- ============================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- Este script remove todas as políticas RLS e desabilita o RLS da tabela arquivos_prestador

-- ============================================
-- Remover todas as políticas RLS
-- ============================================

-- Remover política de SELECT
DROP POLICY IF EXISTS "Permitir leitura em arquivos_prestador para todos" ON arquivos_prestador;

-- Remover política de INSERT
DROP POLICY IF EXISTS "Permitir inserção em arquivos_prestador para todos" ON arquivos_prestador;

-- Remover política de UPDATE
DROP POLICY IF EXISTS "Permitir atualização em arquivos_prestador para todos" ON arquivos_prestador;

-- Remover política de DELETE
DROP POLICY IF EXISTS "Permitir deleção em arquivos_prestador para todos" ON arquivos_prestador;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Permitir leitura em arquivos_prestador para anon e authenticated" ON arquivos_prestador;
DROP POLICY IF EXISTS "Permitir inserção em arquivos_prestador para anon e authenticated" ON arquivos_prestador;

-- ============================================
-- Desabilitar RLS (opcional - comente se preferir manter RLS desabilitado sem políticas)
-- ============================================

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'arquivos_prestador') THEN
        ALTER TABLE arquivos_prestador DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'RLS desabilitado para arquivos_prestador';
    ELSE
        RAISE NOTICE 'Tabela arquivos_prestador não existe';
    END IF;
END $$;

-- ============================================
-- Verificar políticas restantes
-- ============================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'arquivos_prestador'
ORDER BY policyname;

-- Mensagem de sucesso
SELECT '✅ RLS revertido com sucesso para arquivos_prestador!' AS status;


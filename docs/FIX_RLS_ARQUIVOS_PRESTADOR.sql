-- ============================================
-- Script para Configurar RLS na Tabela arquivos_prestador
-- ============================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- Este script configura Row Level Security para permitir acesso à tabela arquivos_prestador

-- ============================================
-- Configurar RLS para arquivos_prestador
-- ============================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Permitir leitura em arquivos_prestador para todos" ON arquivos_prestador;
DROP POLICY IF EXISTS "Permitir inserção em arquivos_prestador para todos" ON arquivos_prestador;
DROP POLICY IF EXISTS "Permitir leitura em arquivos_prestador para anon e authenticated" ON arquivos_prestador;
DROP POLICY IF EXISTS "Permitir inserção em arquivos_prestador para anon e authenticated" ON arquivos_prestador;

-- Garantir que RLS está habilitado
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'arquivos_prestador') THEN
        ALTER TABLE arquivos_prestador ENABLE ROW LEVEL SECURITY;
        
        -- Política para SELECT: qualquer um pode ler (anon e authenticated)
        CREATE POLICY "Permitir leitura em arquivos_prestador para todos"
        ON arquivos_prestador FOR SELECT
        TO anon, authenticated
        USING (true);

        -- Política para INSERT: qualquer um pode inserir (anon e authenticated)
        CREATE POLICY "Permitir inserção em arquivos_prestador para todos"
        ON arquivos_prestador FOR INSERT
        TO anon, authenticated
        WITH CHECK (true);

        -- Política para UPDATE: qualquer um pode atualizar (anon e authenticated)
        CREATE POLICY "Permitir atualização em arquivos_prestador para todos"
        ON arquivos_prestador FOR UPDATE
        TO anon, authenticated
        USING (true)
        WITH CHECK (true);

        -- Política para DELETE: qualquer um pode deletar (anon e authenticated)
        CREATE POLICY "Permitir deleção em arquivos_prestador para todos"
        ON arquivos_prestador FOR DELETE
        TO anon, authenticated
        USING (true);
    ELSE
        RAISE NOTICE 'Tabela arquivos_prestador não existe. Criando estrutura básica...';
        
        -- Criar tabela se não existir
        CREATE TABLE IF NOT EXISTS arquivos_prestador (
            id BIGSERIAL PRIMARY KEY,
            prestador_id BIGINT NOT NULL,
            tipo_arquivo TEXT NOT NULL,
            url TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        ALTER TABLE arquivos_prestador ENABLE ROW LEVEL SECURITY;

        -- Política para SELECT: qualquer um pode ler (anon e authenticated)
        CREATE POLICY "Permitir leitura em arquivos_prestador para todos"
        ON arquivos_prestador FOR SELECT
        TO anon, authenticated
        USING (true);

        -- Política para INSERT: qualquer um pode inserir (anon e authenticated)
        CREATE POLICY "Permitir inserção em arquivos_prestador para todos"
        ON arquivos_prestador FOR INSERT
        TO anon, authenticated
        WITH CHECK (true);

        -- Política para UPDATE: qualquer um pode atualizar (anon e authenticated)
        CREATE POLICY "Permitir atualização em arquivos_prestador para todos"
        ON arquivos_prestador FOR UPDATE
        TO anon, authenticated
        USING (true)
        WITH CHECK (true);

        -- Política para DELETE: qualquer um pode deletar (anon e authenticated)
        CREATE POLICY "Permitir deleção em arquivos_prestador para todos"
        ON arquivos_prestador FOR DELETE
        TO anon, authenticated
        USING (true);
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
WHERE tablename = 'arquivos_prestador'
ORDER BY policyname;

-- Mensagem de sucesso
SELECT '✅ RLS configurado com sucesso para arquivos_prestador!' AS status;




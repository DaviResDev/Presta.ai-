-- ============================================
-- Script de MIGRAÇÃO para Adicionar Coluna 'documento'
-- ============================================
-- Este script adiciona a coluna 'documento' à tabela prestadores
-- sem perder dados existentes.
-- Execute no SQL Editor do Supabase Dashboard

-- Verifica se a coluna documento já existe e adiciona se não existir
DO $$
DECLARE
    prestadores_count INTEGER;
BEGIN
    -- Verifica quantos registros existem na tabela prestadores
    SELECT COUNT(*) INTO prestadores_count FROM prestadores;
    
    -- Verifica se a coluna documento existe na tabela prestadores
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'prestadores' 
        AND column_name = 'documento'
    ) THEN
        IF prestadores_count = 0 THEN
            -- Se não há dados, pode criar como NOT NULL direto
            ALTER TABLE prestadores 
            ADD COLUMN documento TEXT NOT NULL UNIQUE;
            
            -- Cria índice
            CREATE INDEX idx_prestadores_documento 
            ON prestadores(documento);
            
            RAISE NOTICE 'Coluna "documento" adicionada com sucesso (NOT NULL)!';
        ELSE
            -- Se há dados existentes, precisa de abordagem diferente
            RAISE NOTICE 'Atenção: Tabela prestadores possui % registros existentes.', prestadores_count;
            RAISE NOTICE 'Adicionando coluna como nullable para não afetar registros existentes.';
            
            -- Adiciona como nullable
            ALTER TABLE prestadores 
            ADD COLUMN documento TEXT;
            
            -- Cria índice parcial (apenas para valores não nulos)
            CREATE INDEX idx_prestadores_documento 
            ON prestadores(documento) 
            WHERE documento IS NOT NULL;
            
            -- Adiciona constraint UNIQUE parcial (apenas para valores não nulos)
            CREATE UNIQUE INDEX prestadores_documento_unique 
            ON prestadores(documento) 
            WHERE documento IS NOT NULL;
            
            RAISE NOTICE 'Coluna "documento" adicionada com sucesso!';
            RAISE NOTICE 'Certifique-se de preencher o campo "documento" nos registros existentes.';
        END IF;
    ELSE
        RAISE NOTICE 'Coluna "documento" já existe na tabela prestadores.';
    END IF;
END $$;

-- Verifica a estrutura final
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'prestadores'
ORDER BY ordinal_position;

-- Confirmação
SELECT 'Migração concluída com sucesso!' AS status;


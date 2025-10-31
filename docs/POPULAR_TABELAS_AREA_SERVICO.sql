-- ============================================
-- Script para Popular Tabelas de Área e Serviço
-- ============================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- Este script insere dados iniciais nas tabelas areas_profissionais e servicos_prestados
-- Usa NOT EXISTS para evitar conflitos (não requer constraints UNIQUE)

-- ============================================
-- Inserir Áreas Profissionais
-- ============================================
INSERT INTO areas_profissionais (nome)
SELECT * FROM (VALUES
    ('Design Gráfico'),
    ('Marketing Digital'),
    ('Desenvolvimento Web'),
    ('Desenvolvimento Mobile'),
    ('Fotografia'),
    ('Vídeo e Edição'),
    ('Design de Interfaces (UI/UX)'),
    ('Redação e Conteúdo'),
    ('E-commerce'),
    ('Tecnologia da Informação (TI)')
) AS v(nome)
WHERE NOT EXISTS (SELECT 1 FROM areas_profissionais WHERE areas_profissionais.nome = v.nome);

-- ============================================
-- Inserir Serviços Prestados
-- ============================================
-- Serviços para Design Gráfico
INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Criação de Logotipos' 
FROM areas_profissionais a 
WHERE a.nome = 'Design Gráfico'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Criação de Logotipos'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Identidade Visual' 
FROM areas_profissionais a 
WHERE a.nome = 'Design Gráfico'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Identidade Visual'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Design de Embalagens' 
FROM areas_profissionais a 
WHERE a.nome = 'Design Gráfico'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Design de Embalagens'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Design Editorial' 
FROM areas_profissionais a 
WHERE a.nome = 'Design Gráfico'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Design Editorial'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Design de Apresentações' 
FROM areas_profissionais a 
WHERE a.nome = 'Design Gráfico'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Design de Apresentações'
);

-- Serviços para Marketing Digital
INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Gestão de Redes Sociais' 
FROM areas_profissionais a 
WHERE a.nome = 'Marketing Digital'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Gestão de Redes Sociais'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Tráfego Pago' 
FROM areas_profissionais a 
WHERE a.nome = 'Marketing Digital'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Tráfego Pago'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Email Marketing' 
FROM areas_profissionais a 
WHERE a.nome = 'Marketing Digital'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Email Marketing'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'SEO (Otimização para Buscadores)' 
FROM areas_profissionais a 
WHERE a.nome = 'Marketing Digital'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'SEO (Otimização para Buscadores)'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Influencer Marketing' 
FROM areas_profissionais a 
WHERE a.nome = 'Marketing Digital'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Influencer Marketing'
);

-- Serviços para Desenvolvimento Web
INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Desenvolvimento Frontend' 
FROM areas_profissionais a 
WHERE a.nome = 'Desenvolvimento Web'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Desenvolvimento Frontend'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Desenvolvimento Backend' 
FROM areas_profissionais a 
WHERE a.nome = 'Desenvolvimento Web'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Desenvolvimento Backend'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Desenvolvimento Full Stack' 
FROM areas_profissionais a 
WHERE a.nome = 'Desenvolvimento Web'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Desenvolvimento Full Stack'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'WordPress' 
FROM areas_profissionais a 
WHERE a.nome = 'Desenvolvimento Web'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'WordPress'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Manutenção de Sites' 
FROM areas_profissionais a 
WHERE a.nome = 'Desenvolvimento Web'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Manutenção de Sites'
);

-- Serviços para Desenvolvimento Mobile
INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Desenvolvimento Android' 
FROM areas_profissionais a 
WHERE a.nome = 'Desenvolvimento Mobile'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Desenvolvimento Android'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Desenvolvimento iOS' 
FROM areas_profissionais a 
WHERE a.nome = 'Desenvolvimento Mobile'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Desenvolvimento iOS'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Desenvolvimento React Native' 
FROM areas_profissionais a 
WHERE a.nome = 'Desenvolvimento Mobile'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Desenvolvimento React Native'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Desenvolvimento Flutter' 
FROM areas_profissionais a 
WHERE a.nome = 'Desenvolvimento Mobile'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Desenvolvimento Flutter'
);

-- Serviços para Fotografia
INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Fotografia de Produtos' 
FROM areas_profissionais a 
WHERE a.nome = 'Fotografia'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Fotografia de Produtos'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Fotografia de Eventos' 
FROM areas_profissionais a 
WHERE a.nome = 'Fotografia'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Fotografia de Eventos'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Fotografia de Casamentos' 
FROM areas_profissionais a 
WHERE a.nome = 'Fotografia'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Fotografia de Casamentos'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Fotografia Corporativa' 
FROM areas_profissionais a 
WHERE a.nome = 'Fotografia'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Fotografia Corporativa'
);

-- Serviços para Vídeo e Edição
INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Edição de Vídeos' 
FROM areas_profissionais a 
WHERE a.nome = 'Vídeo e Edição'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Edição de Vídeos'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Motion Graphics' 
FROM areas_profissionais a 
WHERE a.nome = 'Vídeo e Edição'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Motion Graphics'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Videografias de Eventos' 
FROM areas_profissionais a 
WHERE a.nome = 'Vídeo e Edição'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Videografias de Eventos'
);

-- Serviços para Design de Interfaces (UI/UX)
INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Design de Interfaces Web' 
FROM areas_profissionais a 
WHERE a.nome = 'Design de Interfaces (UI/UX)'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Design de Interfaces Web'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Design de Interfaces Mobile' 
FROM areas_profissionais a 
WHERE a.nome = 'Design de Interfaces (UI/UX)'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Design de Interfaces Mobile'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Wireframes e Protótipos' 
FROM areas_profissionais a 
WHERE a.nome = 'Design de Interfaces (UI/UX)'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Wireframes e Protótipos'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Pesquisa de Usuário (UX Research)' 
FROM areas_profissionais a 
WHERE a.nome = 'Design de Interfaces (UI/UX)'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Pesquisa de Usuário (UX Research)'
);

-- Serviços para Redação e Conteúdo
INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Redação de Textos' 
FROM areas_profissionais a 
WHERE a.nome = 'Redação e Conteúdo'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Redação de Textos'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Produção de Conteúdo para Blog' 
FROM areas_profissionais a 
WHERE a.nome = 'Redação e Conteúdo'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Produção de Conteúdo para Blog'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Copywriting' 
FROM areas_profissionais a 
WHERE a.nome = 'Redação e Conteúdo'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Copywriting'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Revisão e Edição de Textos' 
FROM areas_profissionais a 
WHERE a.nome = 'Redação e Conteúdo'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Revisão e Edição de Textos'
);

-- Serviços para E-commerce
INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Configuração de Loja Virtual' 
FROM areas_profissionais a 
WHERE a.nome = 'E-commerce'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Configuração de Loja Virtual'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Gestão de Loja Virtual' 
FROM areas_profissionais a 
WHERE a.nome = 'E-commerce'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Gestão de Loja Virtual'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Otimização para Vendas' 
FROM areas_profissionais a 
WHERE a.nome = 'E-commerce'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Otimização para Vendas'
);

-- Serviços para Tecnologia da Informação (TI)
INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Suporte Técnico' 
FROM areas_profissionais a 
WHERE a.nome = 'Tecnologia da Informação (TI)'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Suporte Técnico'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Consultoria em TI' 
FROM areas_profissionais a 
WHERE a.nome = 'Tecnologia da Informação (TI)'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Consultoria em TI'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Infraestrutura de TI' 
FROM areas_profissionais a 
WHERE a.nome = 'Tecnologia da Informação (TI)'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Infraestrutura de TI'
);

INSERT INTO servicos_prestados (area_id, nome)
SELECT a.id, 'Segurança da Informação' 
FROM areas_profissionais a 
WHERE a.nome = 'Tecnologia da Informação (TI)'
AND NOT EXISTS (
    SELECT 1 FROM servicos_prestados s 
    WHERE s.area_id = a.id AND s.nome = 'Segurança da Informação'
);

-- ============================================
-- Verificar dados inseridos
-- ============================================
SELECT 
    a.nome AS area,
    COUNT(s.id) AS total_servicos
FROM areas_profissionais a
LEFT JOIN servicos_prestados s ON s.area_id = a.id
GROUP BY a.id, a.nome
ORDER BY a.nome;

-- Listar todos os serviços por área
SELECT 
    a.nome AS area,
    s.nome AS servico
FROM areas_profissionais a
INNER JOIN servicos_prestados s ON s.area_id = a.id
ORDER BY a.nome, s.nome;

-- Contagem total
SELECT 
    (SELECT COUNT(*) FROM areas_profissionais) AS total_areas,
    (SELECT COUNT(*) FROM servicos_prestados) AS total_servicos;

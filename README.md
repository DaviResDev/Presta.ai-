
 # Presta.ai

 Plataforma web para conectar clientes a prestadores de serviço, com autenticação e dados hospedados no Supabase. Este repositório contém o front-end (Vite + React + TypeScript + Tailwind) e toda a documentação de banco (scripts SQL) usada para provisionar o backend no Supabase.

 - Repositório GitHub (remoto): `https://github.com/DaviResDev/Presta.ai-`
 - Documentação detalhada: veja a pasta `docs/` (scripts SQL e guias Supabase)

 ---

 ## Sumário

 - Visão geral
 - Tecnologias
 - Estrutura do projeto
 - Como rodar o front-end (várias formas)
 - Variáveis de ambiente (Supabase)
 - Scripts úteis
 - Build e deploy estático
 - Dicas de desenvolvimento
 - Documentação e Banco de Dados (Supabase)

 ---

 ## Visão geral

 O Presta.ai é um SPA (Single Page Application) que oferece:
 - Landing e fluxo de cadastro/login
 - Coleta de dados de perfil e profissionais para prestadores
 - Integração com Supabase (auth e banco PostgreSQL)

 O backend é provisionado no Supabase via scripts em `docs/*.sql`. Não há código de backend próprio neste repositório além dos scripts e instruções.

 ---

 ## Tecnologias

 - Front-end: React 18, TypeScript, Vite
 - Estilo/UX: TailwindCSS, componentes UI (Shadcn/UI)
 - Estado/UX: React Hooks
 - Backend (BaaS): Supabase (Auth + Postgres + RLS)
 - Build: Vite
 - Gerenciadores de pacote: pnpm (recomendado) ou npm

 ---

 ## Estrutura do projeto

 - `src/` – código principal do front-end
   - `components/` – páginas e componentes (ex.: `CadastroPage.tsx`, `HomePage.tsx`)
   - `components/ui/` – biblioteca de componentes base (Shadcn/UI adaptados)
   - `lib/` – integrações (ex.: `supabase.ts` quando aplicável)
   - `styles/` – estilos globais
 - `frontend/` – cópia/variante do front-end; use a raiz do projeto (`src/`) como principal
 - `docs/` – documentação e scripts SQL do Supabase (criação de tabelas, RLS, migrações)
 - `vite.config.ts`, `package.json` – configuração do build/dev server

 ---

 ## Como rodar o front-end

 Você pode abrir o sistema de múltiplas formas. A recomendada (e a que usamos) é com o Vite em modo dev.

 1) Vite (desenvolvimento)
 - Pré-requisitos: Node 18+ e pnpm (ou npm)
 - Instale dependências:
   - `pnpm install`  (ou `npm install`)
 - Copie `.env.example` para `.env` e configure as chaves do Supabase (veja abaixo)
 - Rode o servidor de desenvolvimento:
   - `pnpm dev`  (ou `npm run dev`)
 - Acesse: `http://localhost:5173`

 2) Vite (build + preview)
 - Build de produção: `pnpm build`  (ou `npm run build`)
 - Servir o build: `pnpm preview`  (ou `npm run preview`)
 - Acesse: `http://localhost:4173`

 3) Servir o build estático com um servidor simples
 - Faça o build: `pnpm build`
 - Sirva a pasta `dist/` com qualquer servidor HTTP (ex.: `npx serve dist`)

 4) Extensão Live Server (VS Code)
 - Abra o projeto no VS Code
 - Instale a extensão "Live Server"
 - Clique com o botão direito no `index.html` da raiz e escolha "Open with Live Server"
 - Nota: para recursos que dependem de import/esbuild (módulos TS/JS), prefira o Vite

 ---

 ## Variáveis de ambiente (Supabase)

 Crie um arquivo `.env` na raiz com:

 ```bash
 VITE_SUPABASE_URL= https://SEU-PROJETO.supabase.co
 VITE_SUPABASE_ANON_KEY= sua_anon_key
 ```

 - As chaves são obtidas no dashboard do Supabase (Project Settings → API)
 - Em desenvolvimento, o Vite expõe `import.meta.env.VITE_*`

 ---

 ## Scripts úteis

 - `dev`: inicia o Vite em modo desenvolvimento
 - `build`: gera a pasta `dist/` para produção
 - `preview`: serve o build localmente

 Consulte `package.json` para a lista completa.

 ---

 ## Build e deploy estático

 - Execute `pnpm build` (ou `npm run build`)
 - Publique o conteúdo de `dist/` em:
   - GitHub Pages
   - Netlify / Vercel (arrastar soltar ou via CLI)
   - Qualquer hosting estático

 Para GitHub Pages via GitHub Actions, você pode adicionar um workflow que:
 - Instala dependências
 - Roda `pnpm build`
 - Publica `dist/` em `gh-pages`

 ---

 ## Dicas de desenvolvimento

 - Use Node 18+ e pnpm para instalações mais rápidas
 - Mantenha `.env` fora do controle de versão
 - Padronize importações e componentes reutilizáveis em `components/ui`

 ---

 ## Documentação e Banco de Dados (Supabase)

 Toda a documentação de modelagem/tabelas, permissões RLS e migrações está em `docs/`:
 - Scripts de criação e políticas: `SUPABASE_SETUP.sql`, `SUPABASE_TABELAS_AREA_SERVICO.sql`, etc.
 - Correções e RLS: `FIX_RLS_*.sql`, `REVERT_RLS_*.sql`
 - Guias explicativos: `DOCUMENTACAO_COMPLETA_PROJETO.md`, `LEIA-ME-SETUP.md`, `SOLUCAO_RAPIDA.md`

 Fluxo resumido para provisionar o Supabase:
 1. Crie um projeto no Supabase
 2. Execute os scripts em `docs/` na ordem indicada em `LEIA-ME-SETUP.md`
 3. Configure as variáveis de ambiente no front-end
 4. Teste o login/cadastro e as policies (RLS)

 ---

 ## Licença

 Este projeto é disponibilizado nos termos definidos pelo autor. Caso necessário, ajuste este bloco para a licença desejada.
  
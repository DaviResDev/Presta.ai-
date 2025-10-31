# Supabase – Credenciais e Configuração

Abaixo estão as chaves enviadas para integração com a Supabase, além de orientações de configuração de variáveis de ambiente para frontend (Vite/React) e backend (Node/Express). Mantenha as chaves sensíveis apenas no backend.

## Credenciais fornecidas

- SUPABASE API (anon/public):
  - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc3Ftd2tzbmtxbWJ4aWpkb3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MjQ3MjksImV4cCI6MjA3NjIwMDcyOX0.BqFd87oufT2V3-Cg_YJVLVrGPcOZKiCBXvKtKkVZji4

- SERVICE_ROLES (service_role – apenas backend):
  - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc3Ftd2tzbmtxbWJ4aWpkb3dqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyNDcyOSwiZXhwIjoyMDc2MjAwNzI5fQ.MUpWrg79u-E89agTu7ht-qZ2z7NbJUnbPttETq4fgvA

- Publishable key (pública):
  - sb_publishable_uN6fxGbqTZu5olzcjJmhbg_p7Tg_rwc

- Secret keys (apenas backend):
  - sb_secret_Q95uim-eB6Z64PMjyzPuFQ_rY1Jjp0W

Observação: o Project Ref (ref) está embutido nos tokens acima. O URL do projeto Supabase geralmente segue o padrão:

 - https://basqmwksnkqmbxijdowj.supabase.co

Caso tenha o URL exato do seu projeto, substitua no lugar do placeholder abaixo.

---

## Variáveis de ambiente – Frontend (Vite/React)

O frontend (Vite) só deve usar chaves públicas. Defina em `.env.local`:

```
VITE_SUPABASE_URL=https://basqmwksnkqmbxijdowj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc3Ftd2tzbmtxbWJ4aWpkb3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MjQ3MjksImV4cCI6MjA3NjIwMDcyOX0.BqFd87oufT2V3-Cg_YJVLVrGPcOZKiCBXvKtKkVZji4
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_uN6fxGbqTZu5olzcjJmhbg_p7Tg_rwc
```

Notas:
- Após editar `.env.local`, reinicie o servidor de desenvolvimento do Vite para carregar as novas variáveis.
- Nunca exponha chaves `service_role` ou `secret` no frontend.

## Variáveis de ambiente – Backend (Node/Express)

O backend deve armazenar chaves sensíveis:

```
SUPABASE_URL=https://basqmwksnkqmbxijdowj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc3Ftd2tzbmtxbWJ4aWpkb3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MjQ3MjksImV4cCI6MjA3NjIwMDcyOX0.BqFd87oufT2V3-Cg_YJVLVrGPcOZKiCBXvKtKkVZji4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc3Ftd2tzbmtxbWJ4aWpkb3dqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyNDcyOSwiZXhwIjoyMDc2MjAwNzI5fQ.MUpWrg79u-E89agTu7ht-qZ2z7NbJUnbPttETq4fgvA
SUPABASE_PUBLISHABLE_KEY=sb_publishable_uN6fxGbqTZu5olzcjJmhbg_p7Tg_rwc
SUPABASE_SECRET_KEY=sb_secret_Q95uim-eB6Z64PMjyzPuFQ_rY1Jjp0W
```

Boas práticas:
- Utilize o `service_role` apenas em rotas seguras do servidor (nunca no navegador).
- Restrinja RLS/Policies no Supabase para garantir acesso mínimo necessário.

---

## Próximos passos

1. Confirmar o URL do projeto Supabase (`https://<PROJECT_REF>.supabase.co`).
2. Definir `.env.local` no frontend (Vite) com as variáveis `VITE_*`.
3. Definir `.env` no backend com as chaves sensíveis.
4. Implementar as páginas do frontend conforme os layouts e conectar aos endpoints do backend que consumirão o Supabase.

Se preferir, posso criar automaticamente os arquivos `.env.example` para frontend e backend com estes placeholders.

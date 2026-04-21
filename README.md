# Sinapses dos Ventos

Plataforma de diálogo filosófico.

## Setup

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

## Deploy

1. Criar PostgreSQL no Railway
2. Configurar DATABASE_URL em .env
3. Fazer push do schema:
   ```bash
   npx prisma db push
   ```
4. Deploy no Netlify
# Registro do Estado da Aplicação

**Data:** 21 de Abril de 2026
**Versão:** 1.0.0

---

## Estrutura do Projeto

```
sinapses-dos-ventos/
├── public/
│   ├── index.html      (681 bytes)  - Entry point HTML
│   ├── css/styles.css (12.5 KB)   - Todos os estilos
│   └── js/app.js     (20 KB)    - Frontend vanilla JS
├── src/api/
│   ├── server.js    (5.5 KB)  - Express + Socket.io API
│   └── db.js       (71 bytes)  - Prisma client
├── prisma/
│   └── schema.prisma (3.2 KB)   - Schema PostgreSQL
├── netlify.toml    (179 bytes) - Configuração Netlify
├── package.json   (495 bytes) - Dependências Node
├── .env.example (115 bytes) - Template variáveis ambiente
├── .gitignore   (147 bytes)
└── README.md    (302 bytes)
```

---

## Stack Tecnológico

| Componente | Tecnologia |
|------------|------------|
| Frontend | Vanilla JS (sem framework) |
| Backend | Node.js + Express |
| Realtime | Socket.io |
| Database | PostgreSQL (Railway) |
| ORM | Prisma |
| Deploy | Netlify |
| Fonts | Google Fonts (Archivo, Inter, JetBrains Mono) |

---

## Funcionalidades Implementadas

### Frontend
- [x] Layout desktop com sinapse central
- [x] Layout mobile responsivo
- [x] Exibição de mensagens filosóficas
- [x] Sistema de reações (ressonar, ecoar, citar)
- [x] Painel de comentários
- [x] Formulário para novos comentários
- [x] Cards de autores (Angélica Sátiro, Paulo Volker)
- [x] Design visual original (paleta, tipografia, sinapses SVG)

### Backend (API)
- [x] GET/POST /api/sessions
- [x] GET /api/sessions/:id
- [x] GET/POST /api/messages/:sessionId
- [x] GET/POST /api/comments/:sessionId
- [x] POST /api/reactions
- [x] WebSocket para tempo real

### Banco de Dados
- [x] Model: User (id, name, email, password, initials, bio, location, role)
- [x] Model: Session (id, title, number, date, runtime, isLive)
- [x] Model: SessionAuthor (sessionId, userId, side, order)
- [x] Model: Message (id, sessionId, userId, side, body, quote, time, likes, echoes)
- [x] Model: Comment (id, sessionId, userId, body, ref, refId)
- [x] Model: Reaction (messageId, userId, type: LIKED|ECHOED)

---

## Funcionalidades Pendentes

- [ ] Autenticação de usuários
- [ ] Upload de fotos/autores
- [ ] Integração com streaming de vídeo/áudio
- [ ] Backup do banco
- [ ] Painel admin

---

## Variáveis de Ambiente Necessárias

```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
PORT=3000
NODE_ENV=development
```

---

## Comandos de Setup

```bash
# 1. Instalar dependências
npm install

# 2. Configurar .env
cp .env.example .env

# 3. Aplicar schema ao banco
npx prisma db push

# 4. Gerar Prisma client
npx prisma generate

# 5. Executar localmente
npm run dev
```

---

## Infraestrutura

### Railway
- **Projeto:** Sinapses dos Ventos
- **URL:** https://railway.com/project/95bc72c3-d566-4051-a6d3-62e130890437
- **PostgreSQL:** shinkansen.proxy.rlwy.net:58973/railway
- **Usuário:** postgres

### Dados no Banco
- 2 autores (Angélica Sátiro, Paulo Volker)
- 1 sessão ("Sobre o silêncio que pensa")
- 7 mensagens filosóficas

---

## Deploy Netlify

1. Criar repositório no GitHub
2. Conectar ao Netlify
3. Configurar variáveis:
   - DATABASE_URL (do Railway)
4. Deploy automático no push

---

## Observações

- Frontend 100% estático no Netlify
- Backend separado (Node.js) ou Netlify Functions para API
- Dados reais vindos do banco Railway
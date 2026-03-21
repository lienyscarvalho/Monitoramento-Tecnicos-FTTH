# 🚀 Guia Completo de Deploy
## FTTH Monitor - GitHub + Vercel

---

## 📋 ÍNDICE

1. [Preparar Arquivos](#1-preparar-arquivos)
2. [Subir para GitHub](#2-subir-para-github)
3. [Deploy no Vercel](#3-deploy-no-vercel)
4. [Configurações Finais](#4-configurações-finais)
5. [Testes](#5-testes)
6. [Manutenção](#6-manutenção)

---

## 1. PREPARAR ARQUIVOS

### 1.1 Estrutura do Projeto

O projeto precisa estar organizado assim:

```
ftth-monitor/
├── api/                    # Backend (Vercel Serverless)
│   ├── auth/
│   │   └── login.js
│   ├── technicians/
│   │   └── index.js
│   ├── service-orders/
│   │   └── index.js
│   └── dashboard/
│       └── stats.js
├── public/                 # Frontend
│   ├── index.html
│   ├── login.html
│   └── dashboard.html
├── package.json
├── vercel.json
├── .gitignore
└── README.md
```

### 1.2 Criar Arquivo vercel.json

Crie este arquivo na raiz:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 1.3 Atualizar package.json

```json
{
  "name": "ftth-monitor",
  "version": "1.0.0",
  "description": "Sistema de Monitoramento de Técnicos FTTH",
  "main": "api/index.js",
  "scripts": {
    "dev": "vercel dev",
    "build": "echo 'Build complete'",
    "start": "vercel dev"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "pg": "^8.11.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 1.4 Criar .gitignore

```
node_modules/
.env
.env.local
.vercel
*.log
.DS_Store
*.db
dist/
build/
```

---

## 2. SUBIR PARA GITHUB

### 2.1 Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - Repository name: `ftth-monitor`
   - Description: `Sistema de Monitoramento de Técnicos FTTH`
   - Visibilidade: ☑ Public (ou Private)
   - ☐ NÃO marque "Add README"
3. Clique em **"Create repository"**

### 2.2 Configurar Git Local

Abra o terminal na pasta do projeto:

```bash
# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Primeiro commit
git commit -m "feat: Initial commit - FTTH Monitor System"

# Configurar branch principal
git branch -M main

# Adicionar remote (SUBSTITUA 'lienyscarvalho' pelo SEU usuário)
git remote add origin https://github.com/lienyscarvalho/ftth-monitor.git

# Enviar para GitHub
git push -u origin main
```

### 2.3 Verificar Upload

1. Vá para: https://github.com/lienyscarvalho/ftth-monitor
2. Atualize a página (F5)
3. Deve ver todos os arquivos!

---

## 3. DEPLOY NO VERCEL

### 3.1 Criar Conta no Vercel

1. Acesse: https://vercel.com/signup
2. Clique em **"Continue with GitHub"**
3. Autorize o Vercel a acessar seu GitHub
4. Confirme seu email

### 3.2 Importar Projeto

1. No dashboard do Vercel, clique em **"Add New..."**
2. Selecione **"Project"**
3. Na lista, encontre: **"ftth-monitor"**
4. Clique em **"Import"**

### 3.3 Configurar Deploy

Na tela de configuração:

```
Project Name: ftth-monitor

Framework Preset: Other

Root Directory: ./

Build Command: (deixe vazio)

Output Directory: public

Install Command: npm install
```

### 3.4 Variáveis de Ambiente

Clique em **"Environment Variables"** e adicione:

```
JWT_SECRET = seu_secret_super_seguro_aqui_mude_isso_123456789
NODE_ENV = production
DATABASE_URL = (se usar PostgreSQL)
```

### 3.5 Deploy!

1. Clique em **"Deploy"**
2. Aguarde 1-2 minutos
3. Quando aparecer **"Congratulations!"**, está pronto!

### 3.6 Acessar seu App

URL será algo como:
```
https://ftth-monitor-username.vercel.app
```

---

## 4. CONFIGURAÇÕES FINAIS

### 4.1 Configurar Domínio Próprio (Opcional)

1. No Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio
3. Configure DNS:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

### 4.2 Configurar Banco de Dados

#### Opção A: Vercel Postgres (Recomendado)

1. No projeto, clique em **Storage**
2. Clique em **"Create Database"**
3. Selecione **"Postgres"**
4. Escolha região mais próxima
5. Copie a `DATABASE_URL`
6. Adicione nas variáveis de ambiente

#### Opção B: Supabase (Grátis)

1. Acesse: https://supabase.com
2. Crie novo projeto
3. Copie a connection string
4. Adicione como `DATABASE_URL`

### 4.3 Atualizar URLs no Frontend

Nos arquivos HTML, mude:

```javascript
// DE:
const API_URL = 'http://localhost:3000/api';

// PARA:
const API_URL = '/api';  // Vercel cuida do resto!
```

### 4.4 Fazer Novo Deploy

```bash
git add .
git commit -m "fix: Update API URLs for production"
git push
```

O Vercel detecta automaticamente e redesploya!

---

## 5. TESTES

### 5.1 Testar API

Teste cada endpoint:

```bash
# Health check
curl https://ftth-monitor-username.vercel.app/api/health

# Login (deve retornar token)
curl -X POST https://ftth-monitor-username.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Listar técnicos (com token)
curl https://ftth-monitor-username.vercel.app/api/technicians \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 5.2 Testar Frontend

1. Acesse: `https://ftth-monitor-username.vercel.app`
2. Faça login: admin / admin123
3. Teste:
   - ✅ Dashboard carrega
   - ✅ Lista de técnicos aparece
   - ✅ Criar nova OS funciona
   - ✅ Filtros funcionam

### 5.3 Testar em Dispositivos

- Desktop (Chrome, Firefox, Safari)
- Tablet (iPad, Android)
- Mobile (iPhone, Android)

---

## 6. MANUTENÇÃO

### 6.1 Atualizar o Sistema

```bash
# 1. Fazer mudanças nos arquivos
# 2. Testar localmente
npm run dev

# 3. Commit e push
git add .
git commit -m "feat: Add new feature"
git push

# Vercel redesploya automaticamente!
```

### 6.2 Ver Logs

1. Acesse Vercel Dashboard
2. Clique no projeto
3. Vá em **"Deployments"**
4. Clique no deployment
5. Veja **"Logs"**

### 6.3 Rollback (Voltar Versão)

1. Vá em **"Deployments"**
2. Encontre a versão anterior
3. Clique nos 3 pontinhos
4. **"Promote to Production"**

### 6.4 Monitoramento

Vercel mostra automaticamente:
- Uptime
- Requests por segundo
- Tempo de resposta
- Erros

### 6.5 Custos

**Plano Hobby (Grátis):**
- 100 GB de bandwidth/mês
- Deployments ilimitados
- Serverless functions
- SSL automático
- Suficiente para começar!

**Quando Escalar:**
- Se passar de 1000 usuários/dia
- Se precisar de analytics avançado
- Se precisar de suporte prioritário
- Upgrade para Pro: $20/mês

---

## 7. TROUBLESHOOTING

### Erro: "Build Failed"

**Causa:** Erro no código ou dependências

**Solução:**
1. Veja os logs no Vercel
2. Teste localmente: `npm run dev`
3. Corrija o erro
4. Push novamente

### Erro: "Function Timeout"

**Causa:** Função demora mais de 10s (limite Vercel)

**Solução:**
1. Otimize queries do banco
2. Adicione índices
3. Use cache
4. Upgrade para Pro (60s timeout)

### Erro: "API não responde"

**Causa:** Rota não configurada corretamente

**Solução:**
1. Verifique `vercel.json`
2. Certifique-se que rotas estão corretas
3. Redesploy

### Erro: "CORS"

**Causa:** Frontend e API em domínios diferentes

**Solução:**
```javascript
// No backend, configurar CORS:
app.use(cors({
  origin: [
    'https://ftth-monitor-username.vercel.app',
    'http://localhost:3000'  // Para dev
  ],
  credentials: true
}));
```

---

## 8. CHECKLIST DE DEPLOY

- [ ] Código no GitHub
- [ ] Projeto importado no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Primeiro deploy concluído
- [ ] API testada (todos os endpoints)
- [ ] Frontend testado (todas as telas)
- [ ] Banco de dados configurado
- [ ] URLs atualizadas para produção
- [ ] Testado em mobile
- [ ] Domínio configurado (opcional)
- [ ] Monitoramento ativo

---

## 9. RECURSOS ÚTEIS

### Documentação:
- Vercel: https://vercel.com/docs
- GitHub: https://docs.github.com/
- Vercel CLI: https://vercel.com/docs/cli

### Comunidade:
- Vercel Discord: https://vercel.com/discord
- GitHub Community: https://github.com/community

### Suporte:
- Vercel Support: support@vercel.com
- GitHub Support: https://support.github.com/

---

## 10. PRÓXIMOS PASSOS

Depois do deploy:

1. **Analytics:** Adicione Google Analytics
2. **Monitoring:** Configure Sentry para errors
3. **SEO:** Adicione meta tags
4. **Performance:** Otimize imagens e assets
5. **Segurança:** Adicione rate limiting
6. **Backup:** Configure backup automático do banco
7. **CI/CD:** Configure testes automatizados

---

## ✅ RESUMO RÁPIDO

```bash
# 1. Subir para GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/lienyscarvalho/ftth-monitor.git
git push -u origin main

# 2. Deploy no Vercel
# - Acesse vercel.com
# - Importe repositório
# - Configure variáveis
# - Deploy!

# 3. Acessar
https://ftth-monitor-username.vercel.app
```

**Pronto! Sistema online e funcionando!** 🎉

---

**Autor:** FTTH Development Team  
**Versão:** 1.0  
**Data:** Fevereiro 2026

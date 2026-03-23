# 🎬 Tutorial Passo a Passo: Deploy no Render (5 Minutos)

## ⏱️ Tempo estimado: 5-10 minutos

---

## 📋 Pré-requisitos

Você vai precisar de:
1. ✅ Conta no GitHub (grátis) - https://github.com/signup
2. ✅ Conta no Render (grátis) - https://render.com
3. ✅ Git instalado no seu computador

**Não tem Git?** Baixe em: https://git-scm.com/downloads

---

## 🎯 PARTE 1: Preparar Código (2 minutos)

### Passo 1.1: Extrair o ZIP
```
1. Extrair o arquivo: ftth-complete-system.zip
2. Você terá uma pasta com todos os arquivos
```

### Passo 1.2: Abrir Terminal/Prompt
```
Windows:
- Abra a pasta ftth-backend
- Shift + Click direito → "Abrir janela do PowerShell aqui"
- OU digite "cmd" na barra de endereço

Mac/Linux:
- Abra o Terminal
- Use 'cd' para navegar até a pasta ftth-backend
```

### Passo 1.3: Verificar Git
```bash
# Digite no terminal:
git --version

# Deve mostrar algo como: git version 2.x.x
# Se der erro, instale o Git primeiro
```

---

## 🐙 PARTE 2: Enviar para GitHub (3 minutos)

### Passo 2.1: Criar Repositório no GitHub

```
1. Acesse: https://github.com
2. Faça login (ou crie conta se não tiver)
3. Clique no botão "+" no canto superior direito
4. Clique em "New repository"
5. Preencha:
   ┌─────────────────────────────────────┐
   │ Repository name: ftth-monitoring    │
   │ Description: Sistema FTTH           │
   │ ● Public  ○ Private                 │
   │ ☐ Add README                        │
   │ ☐ Add .gitignore                    │
   │                                     │
   │      [Create repository]            │
   └─────────────────────────────────────┘
6. Clique em "Create repository"
```

### Passo 2.2: Copiar URL do Repositório

Você verá uma página com comandos. **NÃO FECHE ESTA PÁGINA!**

Copie a URL que aparece (será algo como):
```
https://github.com/SEU_USUARIO/ftth-monitoring.git
```

### Passo 2.3: Configurar Git (Primeira Vez)

**SE for a primeira vez usando Git no computador**, configure:

```bash
# Substitua pelos seus dados
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### Passo 2.4: Enviar Código para GitHub

No terminal, dentro da pasta `ftth-backend`, digite um comando de cada vez:

```bash
# 1. Inicializar Git
git init

# Você verá: Initialized empty Git repository...
# ✓ Sucesso!

# 2. Adicionar todos os arquivos
git add .

# Não mostra nada, é normal
# ✓ Sucesso!

# 3. Fazer primeiro commit
git commit -m "Deploy inicial - Sistema FTTH"

# Você verá lista de arquivos adicionados
# ✓ Sucesso!

# 4. Renomear branch para main
git branch -M main

# Não mostra nada, é normal
# ✓ Sucesso!

# 5. Conectar ao GitHub (cole a URL que você copiou)
git remote add origin https://github.com/SEU_USUARIO/ftth-monitoring.git

# Substitua SEU_USUARIO pelo seu nome de usuário do GitHub
# Não mostra nada, é normal
# ✓ Sucesso!

# 6. Enviar para GitHub
git push -u origin main

# Você verá barras de progresso
# Pode pedir usuário e senha do GitHub
# ✓ Sucesso! Código no GitHub!
```

**Dica:** Se pedir senha e não aceitar, use um **Personal Access Token** ao invés de senha:
```
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Marque: repo
4. Generate token
5. Copie o token
6. Use como senha
```

### Passo 2.5: Verificar

```
1. Volte para a página do GitHub
2. Atualize (F5)
3. Você deve ver todos os arquivos!
```

✅ **PRONTO! Código no GitHub!**

---

## 🚀 PARTE 3: Deploy no Render (2 minutos)

### Passo 3.1: Criar Conta no Render

```
1. Acesse: https://render.com
2. Clique em "Get Started for Free"
3. Clique em "GitHub" para fazer login
4. Autorize o Render a acessar seu GitHub
5. Você será redirecionado para o Dashboard do Render
```

### Passo 3.2: Criar Web Service (Backend)

```
1. No Dashboard do Render, clique em "New +"
2. Selecione "Web Service"
3. Você verá lista dos seus repositórios do GitHub
4. Clique em "Connect" ao lado de "ftth-monitoring"

   Se não aparecer:
   - Clique em "Configure account"
   - Dê permissão ao repositório
```

### Passo 3.3: Configurar Deploy

Preencha o formulário:

```
┌────────────────────────────────────────────┐
│ Name: ftth-monitoring                      │
│ Region: Ohio (US East) ← Mais próximo      │
│ Branch: main                               │
│ Root Directory: ftth-backend               │ ← IMPORTANTE!
│ Runtime: Node                              │
│ Build Command: npm install                 │
│ Start Command: npm start                   │
│                                            │
│ Instance Type:                             │
│ ● Free  ○ Starter ($7/mo)                 │
│                                            │
│ Advanced ▼                                 │
│ Environment Variables:                     │
│ [Add Environment Variable]                 │
│                                            │
│ KEY: PORT                                  │
│ VALUE: 3000                                │
│                                            │
│ KEY: JWT_SECRET                            │
│ VALUE: ftth_super_secret_2024_change_me    │
│                                            │
│ KEY: NODE_ENV                              │
│ VALUE: production                          │
│                                            │
│          [Create Web Service]              │
└────────────────────────────────────────────┘
```

**ATENÇÃO ao "Root Directory":** 
- Coloque: `ftth-backend`
- Isso é MUITO importante!

### Passo 3.4: Aguardar Deploy

```
1. Clique em "Create Web Service"
2. Você verá logs do deploy em tempo real:
   
   ┌─────────────────────────────────────┐
   │ ==> Building...                     │
   │ ==> Installing dependencies...      │
   │ ==> Starting server...              │
   │ ==> Deploy successful!              │
   └─────────────────────────────────────┘

3. Aguarde 2-3 minutos
4. Quando aparecer "Live", está pronto! 🎉
```

### Passo 3.5: Copiar URL da API

```
No topo da página, você verá algo como:

┌──────────────────────────────────────────────┐
│ ftth-monitoring                              │
│ https://ftth-monitoring-xxxx.onrender.com    │
│ ● Live                                       │
└──────────────────────────────────────────────┘

COPIE esta URL! Você vai precisar dela!
```

### Passo 3.6: Testar API

```
1. Clique na URL OU
2. Abra nova aba e cole: 
   https://SEU_APP.onrender.com/api/health

3. Você deve ver:
   {
     "status": "OK",
     "message": "FTTH Monitoring API está funcionando"
   }

✅ Backend funcionando!
```

---

## 🎨 PARTE 4: Deploy do Frontend (2 minutos)

### Passo 4.1: Criar Static Site

```
1. No Render, clique em "New +" novamente
2. Selecione "Static Site"
3. Conecte o mesmo repositório "ftth-monitoring"
```

### Passo 4.2: Configurar

```
┌────────────────────────────────────────────┐
│ Name: ftth-monitoring-web                  │
│ Branch: main                               │
│ Root Directory: (deixe vazio)              │ ← Vazio mesmo!
│ Build Command: (deixe vazio)               │ ← Vazio!
│ Publish Directory: .                       │ ← Apenas um ponto
│                                            │
│          [Create Static Site]              │
└────────────────────────────────────────────┘
```

### Passo 4.3: Aguardar

```
Aguarde 1-2 minutos até aparecer "Published"
```

### Passo 4.4: Copiar URL do Frontend

```
URL será algo como:
https://ftth-monitoring-web.onrender.com
```

---

## 🔧 PARTE 5: Conectar Frontend ao Backend (1 minuto)

### Passo 5.1: Atualizar URLs

Você precisa editar 2 arquivos:

**Arquivo 1: login.html**
```javascript
// Procure esta linha (linha ~23):
const API_URL = 'http://localhost:3000/api';

// Troque por (use a URL do SEU backend):
const API_URL = 'https://ftth-monitoring-xxxx.onrender.com/api';
```

**Arquivo 2: ftth-monitoring-integrated.html**
```javascript
// Procure esta linha (linha ~25):
const API_URL = 'http://localhost:3000/api';

// Troque por:
const API_URL = 'https://ftth-monitoring-xxxx.onrender.com/api';
```

### Passo 5.2: Atualizar no GitHub

```bash
# No terminal, na pasta do projeto:
git add .
git commit -m "Atualizar URLs da API"
git push
```

### Passo 5.3: Aguardar Redeploy

```
1. Volte para o Render (Static Site)
2. Você verá que detectou as mudanças
3. Aguarde ~1 minuto para redesployar
4. Pronto!
```

---

## 🎉 PRONTO! SEU APP ESTÁ NO AR!

### URLs Finais:

**Backend (API):**
```
https://ftth-monitoring-xxxx.onrender.com
```

**Frontend (Aplicação):**
```
https://ftth-monitoring-web.onrender.com
```

---

## 🧪 TESTAR O APP

### 1. Abrir Login

```
Acesse: https://ftth-monitoring-web.onrender.com/login.html
```

### 2. Fazer Login

```
Usuário: admin
Senha: admin123
```

### 3. Explorar!

```
✓ Ver técnicos
✓ Ver ordens de serviço
✓ Ver estatísticas
✓ Tudo funciona!
```

---

## 📱 COMPARTILHAR O APP

Agora você pode compartilhar com qualquer pessoa:

```
Envie o link:
https://ftth-monitoring-web.onrender.com/login.html

Todos podem acessar de:
- Computador
- Celular
- Tablet
- Qualquer lugar do mundo!
```

---

## ⚠️ IMPORTANTE - Plano Grátis do Render

O plano grátis tem estas limitações:

```
✓ 750 horas/mês (mais que suficiente)
✓ 100 GB de tráfego/mês
⚠ App "dorme" após 15 minutos sem uso
⚠ Primeiro acesso após "dormir" demora 30-60 segundos
```

**Para evitar o "sleep":**
- Upgrade para plano Starter ($7/mês)
- OU use um serviço como UptimeRobot (grátis) para "pingar" o app

---

## 🐛 PROBLEMAS COMUNS

### ❌ Erro: "Application failed to respond"
```
Solução:
1. Verifique os logs no Render
2. Certifique-se que Root Directory está correto: ftth-backend
3. Verifique se PORT está configurado como 3000
```

### ❌ Frontend não conecta ao backend
```
Solução:
1. Verifique se atualizou as URLs nos arquivos HTML
2. Teste a API diretamente: https://SEU_APP.onrender.com/api/health
3. Veja console do navegador (F12) para erros
```

### ❌ CORS Error
```
Solução:
Já está configurado! Mas se persistir:
1. Edite ftth-backend/server.js
2. Adicione URL do frontend no CORS:
   app.use(cors({
     origin: ['https://seu-frontend.onrender.com']
   }));
```

### ❌ Git pede senha e não aceita
```
Solução:
Use Personal Access Token:
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. Marque: repo
5. Use o token como senha
```

---

## 🎓 PRÓXIMOS PASSOS

Agora que seu app está no ar:

1. ✅ **Comprar domínio próprio** (opcional)
   - Exemplo: www.seuapp.com.br
   - Custo: R$ 40/ano
   - Configure no Render: Custom Domain

2. ✅ **Adicionar Analytics**
   - Google Analytics
   - Ver quantas pessoas usam

3. ✅ **Configurar backup**
   - Exportar banco de dados
   - Salvar no GitHub

4. ✅ **Monitorar uptime**
   - UptimeRobot.com (grátis)
   - Recebe email se cair

5. ✅ **Migrar para PostgreSQL**
   - SQLite não é ideal para produção
   - Render oferece PostgreSQL grátis

---

## 💰 CUSTOS

### Opção 1: 100% Grátis
```
Backend: Render Free
Frontend: Render Free
Total: R$ 0/mês
Limitação: Sleep após 15min
```

### Opção 2: Profissional
```
Backend: Render Starter ($7/mês)
Frontend: Render Free
Total: R$ 35/mês
Sem sleep!
```

### Opção 3: Com Domínio
```
Backend: Render Starter ($7/mês)
Frontend: Render Free
Domínio: R$ 40/ano
Total: R$ 35/mês + R$ 40/ano
```

---

## 🆘 PRECISA DE AJUDA?

Se algo não funcionar:

1. Veja os logs no Render
2. Veja console do navegador (F12)
3. Teste API: /api/health
4. Verifique variáveis de ambiente

---

## ✅ CHECKLIST FINAL

Deploy completo quando:

- [ ] Código no GitHub
- [ ] Backend no Render (Live)
- [ ] Frontend no Render (Published)
- [ ] URLs atualizadas nos arquivos
- [ ] Login funciona
- [ ] Consegue criar OS
- [ ] API retorna dados
- [ ] Pode acessar de qualquer lugar

---

## 🎉 PARABÉNS!

Seu app está **online e funcionando!**

Você agora tem:
- ✅ Sistema profissional
- ✅ Acessível de qualquer lugar
- ✅ Backend + Frontend
- ✅ Banco de dados
- ✅ Autenticação
- ✅ HTTPS automático
- ✅ Tudo funcionando!

**Compartilhe com sua equipe e comece a usar!** 🚀

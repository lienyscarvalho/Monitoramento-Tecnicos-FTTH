# ☁️ Guia Completo: Colocar App FTTH na Nuvem

## 🎯 3 Maneiras Mais Fáceis (Escolha Uma)

---

## 🚀 OPÇÃO 1: RENDER (GRÁTIS - RECOMENDADO)

### **Por que Render:**
- ✅ 100% GRÁTIS para sempre
- ✅ Deploy em 5 minutos
- ✅ SSL/HTTPS automático
- ✅ Não precisa cartão de crédito
- ✅ Ideal para seu app

### **Passo a Passo:**

#### **1. Criar Conta no GitHub**
```
1. Acesse: https://github.com/signup
2. Crie uma conta grátis
3. Confirme seu email
```

#### **2. Subir Código no GitHub**

No terminal, dentro da pasta `ftth-backend`:

```bash
# Inicializar Git
git init

# Adicionar arquivos
git add .

# Fazer commit
git commit -m "Primeiro commit - App FTTH"

# Criar repositório no GitHub
# Vá em: https://github.com/new
# Nome: ftth-monitoring
# Público ou Privado (tanto faz)
# Clique em "Create repository"

# Conectar e enviar
git remote add origin https://github.com/SEU_USUARIO/ftth-monitoring.git
git branch -M main
git push -u origin main
```

#### **3. Deploy no Render**

```
1. Acesse: https://render.com
2. Clique em "Get Started for Free"
3. Faça login com GitHub
4. Clique em "New +" → "Web Service"
5. Conecte seu repositório "ftth-monitoring"
6. Configure:
   - Name: ftth-monitoring
   - Environment: Node
   - Build Command: npm install
   - Start Command: npm start
   - Free tier
7. Clique em "Create Web Service"
```

**Pronto! Em 2-3 minutos seu app estará no ar!**

URL exemplo: `https://ftth-monitoring.onrender.com`

#### **4. Deploy do Frontend**

```
1. No Render, clique "New +" → "Static Site"
2. Selecione o mesmo repositório
3. Configure:
   - Name: ftth-monitoring-web
   - Publish directory: .
4. Clique em "Create Static Site"
```

**Frontend estará em:** `https://ftth-monitoring-web.onrender.com`

#### **5. Atualizar URLs no Frontend**

Edite os arquivos HTML e troque:
```javascript
// DE:
const API_URL = 'http://localhost:3000/api';

// PARA:
const API_URL = 'https://ftth-monitoring.onrender.com/api';
```

---

## 🎨 OPÇÃO 2: RAILWAY (GRÁTIS - MUITO FÁCIL)

### **Por que Railway:**
- ✅ Grátis (500h/mês)
- ✅ Deploy em 3 minutos
- ✅ Muito simples
- ✅ Banco de dados PostgreSQL grátis

### **Passo a Passo:**

```
1. Acesse: https://railway.app
2. Clique em "Start a New Project"
3. Login com GitHub
4. Selecione "Deploy from GitHub repo"
5. Escolha seu repositório
6. Railway detecta automaticamente
7. Clique em "Deploy"
```

**Pronto! URL gerada automaticamente!**

#### **Adicionar Variáveis de Ambiente:**

```
1. No Railway, vá em seu projeto
2. Clique em "Variables"
3. Adicione:
   - PORT: 3000
   - JWT_SECRET: seu_secret_super_seguro
   - NODE_ENV: production
4. Salve
```

---

## ⚡ OPÇÃO 3: VERCEL (GRÁTIS - PARA FRONTEND)

### **Melhor para hospedar apenas o FRONTEND**

### **Passo a Passo:**

```
1. Acesse: https://vercel.com
2. Clique em "Sign Up"
3. Login com GitHub
4. Clique em "Add New..." → "Project"
5. Selecione seu repositório
6. Configure:
   - Framework Preset: Other
   - Root Directory: ./
7. Clique em "Deploy"
```

**Frontend online em:** `https://seu-app.vercel.app`

**Para o backend, use Render ou Railway!**

---

## 💰 OPÇÃO 4: HEROKU (PAGO - $7/mês)

### **Se você quer mais estabilidade:**

#### **1. Instalar Heroku CLI**

**Windows:**
```bash
# Baixe de: https://devcenter.heroku.com/articles/heroku-cli
```

**Linux/Mac:**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

#### **2. Deploy**

```bash
# Login
heroku login

# Criar app
heroku create ftth-monitoring

# Fazer deploy
git push heroku main

# Abrir app
heroku open
```

**Custo: $7/mês por dyno**

---

## 🏢 OPÇÃO 5: VPS (DigitalOcean, Linode, etc)

### **Para quem quer controle total:**

#### **1. Criar Droplet (DigitalOcean)**

```
1. Acesse: https://digitalocean.com
2. Crie conta (ganhe $200 de crédito grátis)
3. Crie um Droplet:
   - Ubuntu 22.04
   - Basic Plan ($6/mês)
   - Escolha região mais próxima
```

#### **2. Conectar via SSH**

```bash
ssh root@SEU_IP
```

#### **3. Instalar Node.js**

```bash
# Atualizar sistema
apt update && apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Instalar PM2 (gerenciador de processos)
npm install -g pm2

# Instalar Nginx
apt install nginx -y
```

#### **4. Clonar e Configurar**

```bash
# Criar pasta
mkdir /var/www
cd /var/www

# Clonar repositório
git clone https://github.com/SEU_USUARIO/ftth-monitoring.git
cd ftth-monitoring/ftth-backend

# Instalar dependências
npm install

# Configurar variáveis
nano .env
# Adicione suas variáveis e salve (Ctrl+X, Y, Enter)

# Iniciar com PM2
pm2 start server.js --name ftth-backend
pm2 startup
pm2 save
```

#### **5. Configurar Nginx**

```bash
nano /etc/nginx/sites-available/ftth
```

Cole:
```nginx
server {
    listen 80;
    server_name SEU_DOMINIO.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar site
ln -s /etc/nginx/sites-available/ftth /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### **6. SSL Grátis (Let's Encrypt)**

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d SEU_DOMINIO.com
```

**Custo: $6-12/mês**

---

## 🆓 OPÇÃO GRÁTIS 100%: Combinação Perfeita

### **Backend: Render** (Grátis)
### **Frontend: Vercel** (Grátis)
### **Banco: Render PostgreSQL** (Grátis)

**Total: R$ 0/mês!**

---

## 📊 Comparação de Custos

| Plataforma | Custo/Mês | Limitações |
|------------|-----------|------------|
| **Render (Free)** | R$ 0 | Sleep após 15min inativo |
| **Railway (Free)** | R$ 0 | 500h/mês (suficiente) |
| **Vercel (Free)** | R$ 0 | Apenas frontend |
| **Heroku** | R$ 35 ($7) | Sem sleep, mais estável |
| **DigitalOcean** | R$ 30 ($6) | VPS completo |
| **AWS/GCP** | R$ 50-500+ | Pague pelo uso |

---

## 🎯 Minha Recomendação Para Você

### **Para Começar (GRÁTIS):**
```
Backend: Render
Frontend: Render (Static Site)
Banco: SQLite (ou PostgreSQL no Render)
```

### **Para Produção (PAGO):**
```
Backend: Railway ou Heroku ($7-12/mês)
Frontend: Vercel (grátis)
Banco: PostgreSQL no Railway
```

### **Para Empresa (ESCALÁVEL):**
```
Backend: AWS/GCP
Frontend: Vercel ou Cloudflare Pages
Banco: AWS RDS ou Google Cloud SQL
```

---

## 🚀 Deploy Rápido - Render (5 Minutos)

### **Comandos Completos:**

```bash
# 1. Inicializar Git (na pasta ftth-backend)
git init
git add .
git commit -m "Deploy inicial"

# 2. Criar repo no GitHub
# Vá em: https://github.com/new
# Nome: ftth-monitoring

# 3. Enviar para GitHub
git remote add origin https://github.com/SEU_USUARIO/ftth-monitoring.git
git branch -M main
git push -u origin main

# 4. Deploy no Render
# Acesse: https://render.com
# New + → Web Service
# Conecte GitHub → Selecione repositório
# Deploy!

# PRONTO! URL gerada automaticamente!
```

---

## 📱 Acessar App na Nuvem

Depois do deploy, você terá URLs tipo:

**Backend:**
```
https://ftth-monitoring.onrender.com
```

**Frontend:**
```
https://ftth-monitoring-web.onrender.com
```

**Teste a API:**
```bash
curl https://ftth-monitoring.onrender.com/api/health
```

---

## 🔒 Configurar Variáveis de Ambiente

No Render/Railway, adicione:

```
PORT=3000
JWT_SECRET=super_secret_key_production_123
NODE_ENV=production
```

---

## 🐛 Problemas Comuns

### **1. App não inicia**
```bash
# Ver logs no Render/Railway
# Clique em "Logs" no painel
```

### **2. CORS Error**
```javascript
// Atualizar CORS no server.js
app.use(cors({
  origin: ['https://seu-frontend.vercel.app'],
  credentials: true
}));
```

### **3. Banco de dados não funciona**
```bash
# Usar PostgreSQL ao invés de SQLite em produção
# No Render: Add PostgreSQL database
```

### **4. Frontend não conecta ao backend**
```javascript
// Atualizar URL da API nos arquivos HTML
const API_URL = 'https://seu-backend.onrender.com/api';
```

---

## ✅ Checklist Final

- [ ] Código no GitHub
- [ ] Backend no Render/Railway
- [ ] Frontend no Vercel/Render
- [ ] Variáveis de ambiente configuradas
- [ ] URLs atualizadas no frontend
- [ ] Testar login
- [ ] Testar criação de OS
- [ ] Testar API endpoints

---

## 🎉 Pronto!

Seu app estará **online e acessível de qualquer lugar do mundo!**

**Próximos passos:**
1. Comprar domínio (R$ 40/ano) - opcional
2. Configurar email profissional
3. Adicionar Google Analytics
4. Implementar backup automático

---

**Quer ajuda para fazer o deploy agora?** 
Me avise qual opção você escolheu! 🚀

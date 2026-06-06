# 💰 Gestão Financeira

Aplicativo mobile de gestão financeira pessoal desenvolvido com **React Native (Expo)** no frontend e **Node.js + Express + Prisma + MySQL** no backend.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js LTS](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [MySQL Server 8.0](https://dev.mysql.com/downloads/)
- [Expo Go](https://expo.dev/client) no celular (iOS ou Android)
- [Postman](https://www.postman.com/) para testar a API

---

## 🗂️ Estrutura do Projeto

```
praticas/
├── gestao-financeira/        # Frontend (React Native + Expo)
└── gestao-financeira-api/    # Backend (Node.js + Express + Prisma)
```

---

## 🚀 Como Rodar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO/praticas
```

---

### 2. Configurar o Banco de Dados (MySQL)

Abra o MySQL Workbench ou terminal e execute:

```sql
CREATE DATABASE gestao_financeira CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### 3. Configurar e rodar o Backend

```bash
# Entrar na pasta da API
cd gestao-financeira-api

# Instalar dependências
npm install

# Instalar versões fixas do Prisma
npm install prisma@5.22.0 @prisma/client@5.22.0

# Copiar o arquivo de variáveis de ambiente
cp .env.example .env
```

Edite o `.env` com suas credenciais do MySQL:

```env
DATABASE_URL="mysql://root:SUA_SENHA@localhost:3306/gestao_financeira"
PORT=3000
JWT_SECRET=gestao_financeira_secret_2026
```

```bash
# Gerar o Prisma Client
npx prisma generate

# Rodar as migrations (cria as tabelas)
npx prisma migrate dev --name init

# Popular o banco com categorias padrão
npm run prisma:seed

# Iniciar o servidor
npm run dev
```

✅ API rodando em: `http://localhost:3000`

---

### 4. Configurar e rodar o Frontend

```bash
# Em outro terminal, entrar na pasta do app
cd gestao-financeira

# Instalar dependências
npm install

# Copiar o arquivo de variáveis de ambiente
cp .env.example .env
```

Edite o `.env` com o IP da sua máquina:

```env
# Emulador Android:
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000

# Device físico (descubra seu IP com `ipconfig`):
EXPO_PUBLIC_API_URL=http://192.168.X.X:3000

# iOS Simulator:
EXPO_PUBLIC_API_URL=http://localhost:3000
```

```bash
# Iniciar o app
npx expo start
```

📱 Escaneie o QR Code com o **Expo Go** no celular.

---

### 5. Testar a API no Postman

1. Abra o Postman
2. Importe a collection: `gestao-financeira-api/postman/collection.json`
3. Configure o environment com `baseUrl = http://localhost:3000`
4. Rode o **Health-Check** para confirmar que a API está funcionando

---

## 📱 Funcionalidades do App

- **Login e Cadastro** com autenticação JWT
- **Transações** — adicionar, listar, excluir com toque longo
- **Categorias** — 5 padrão + criação de categorias customizadas com emoji
- **Resumo** — gráfico de pizza + saldo por categoria
- **Filtro** de mês/ano nas telas de transações e resumo
- **Boas-vindas** com nome do usuário autenticado

---

## 🔌 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Health-check |
| POST | `/auth/register` | Cadastrar usuário |
| POST | `/auth/login` | Login e obter token JWT |
| GET | `/categories` | Listar categorias |
| POST | `/categories` | Criar categoria |
| PUT | `/categories/:id` | Atualizar categoria |
| DELETE | `/categories/:id` | Excluir categoria |
| GET | `/transactions` | Listar transações |
| POST | `/transactions` | Criar transação |
| PUT | `/transactions/:id` | Atualizar transação |
| DELETE | `/transactions/:id` | Excluir transação |

> ⚠️ Rotas de transações exigem `Authorization: Bearer TOKEN` no header.

---

## 🛠️ Tecnologias Utilizadas

**Frontend:**
- React Native + Expo
- Expo Router (navegação)
- React Context API (estado global)
- react-native-svg (gráficos)

**Backend:**
- Node.js + Express
- Prisma ORM
- MySQL
- JWT (jsonwebtoken)
- bcryptjs
- Zod (validação)

---

## ⚠️ Observações Importantes

- O IP da máquina pode mudar. Sempre verifique com `ipconfig` e atualize o `.env` do frontend.
- O MySQL deve estar rodando antes de iniciar a API.
- Após alterar o `.env`, reinicie o Expo com `npx expo start --clear`.
- Categorias padrão não podem ser excluídas.
- Para excluir uma categoria customizada, exclua primeiro as transações vinculadas a ela.
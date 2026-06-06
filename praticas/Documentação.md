# 📄 Documentação Técnica — Gestão Financeira

## 1. Visão Geral

Sistema de gestão financeira pessoal composto por:
- **Backend:** API REST em Node.js com Express, Prisma ORM e MySQL
- **Frontend:** App mobile em React Native com Expo

### Arquitetura

```
[ App React Native ]  --HTTP-->  [ API Express ]  --Prisma-->  [ MySQL ]
   gestao-financeira/             gestao-financeira-api/         localhost:3306
```

---

## 2. Backend

### 2.1 Modelos do Banco de Dados

#### User
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | Identificador único |
| name | String | Nome do usuário |
| email | String (unique) | E-mail do usuário |
| password | String | Senha criptografada (bcrypt) |
| createdAt | DateTime | Data de criação |

#### Category
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | Identificador único |
| name | String (unique) | Chave técnica (ex: food) |
| displayName | String | Nome exibido (ex: Alimentação) |
| icon | String | Nome do ícone Material ou emoji |
| background | String | Cor hex de fundo |
| isIncome | Boolean | Se é categoria de receita |
| isDefault | Boolean | Se é categoria padrão (não excluível) |
| createdAt | DateTime | Data de criação |

#### Transaction
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | Identificador único |
| description | String | Descrição da transação |
| value | Decimal(12,2) | Valor monetário |
| date | DateTime | Data da transação |
| categoryId | String | FK para Category |
| userId | String | FK para User |
| createdAt | DateTime | Data de criação |
| updatedAt | DateTime | Data de atualização |

---

### 2.2 Autenticação

A API usa **JWT (JSON Web Token)** para autenticação.

**Fluxo:**
1. Usuário se cadastra via `POST /auth/register`
2. Usuário faz login via `POST /auth/login`
3. API retorna um token JWT válido por 7 dias
4. App envia o token no header: `Authorization: Bearer TOKEN`
5. Rotas protegidas validam o token via middleware

**Rotas protegidas:** todas as rotas de `/transactions`
**Rotas públicas:** `/auth/*` e `/categories`

---

### 2.3 Validação

Todas as entradas são validadas com **Zod**:

- `createCategorySchema`: name (min 2), displayName (min 2), icon, background (hex), isIncome
- `createTransactionSchema`: description (min 1), value (positive), date, categoryId

Erros de validação retornam **400** com detalhes dos campos inválidos.

---

### 2.4 Categorias Padrão (Seed)

O banco é populado com 5 categorias padrão via `npm run prisma:seed`:

| name | displayName | isIncome |
|------|-------------|----------|
| income | Renda | true |
| food | Alimentação | false |
| house | Casa | false |
| education | Educação | false |
| travel | Viagens | false |

> Categorias com `isDefault: true` não podem ser excluídas.

---

## 3. Frontend

### 3.1 Telas

| Tela | Arquivo | Descrição |
|------|---------|-----------|
| Login/Cadastro | `app/login.jsx` | Autenticação com JWT |
| Transações | `app/(tabs)/index.jsx` | Lista com filtro mês/ano e exclusão |
| Adicionar | `app/(tabs)/add-transactions.jsx` | Formulário de nova transação |
| Categorias | `app/(tabs)/categories.jsx` | Gerenciar categorias |
| Resumo | `app/(tabs)/summary.jsx` | Gráfico pizza + saldo |

### 3.2 Estado Global

O `GlobalState` (Context API) centraliza:
- Lista de categorias (carrega sem autenticação)
- Lista de transações (carrega após login)
- Estado de loading e erro
- Ações: addTransaction, removeTransaction, addCategory, removeCategory, refresh

### 3.3 Serviço de API

O `services/api.js` centraliza todas as chamadas HTTP:
- Token JWT armazenado em memória via `setAuthToken()`
- Todas as requisições autenticadas enviam `Authorization: Bearer TOKEN`
- Tratamento de erros padronizado

---

## 4. Postman Collection

A collection está em `gestao-financeira-api/postman/collection.json` e contém:

1. Health-check
2. Auth Register
3. Auth Login
4. Categorias - Listar
5. Categorias - Criar
6. Categorias - Atualizar
7. Categorias - Excluir
8. Transações - Criar
9. Transações - Listar
10. Transações - Atualizar
11. Transações - Excluir
12. Validação de erros
13. Credenciais inválidas

**Variável de ambiente:** `baseUrl = http://localhost:3000`

---

## 5. Decisões Técnicas

- **Prisma v5.22.0** (versão fixa) para compatibilidade com o projeto
- **cuid()** para IDs únicos (substitui o frágil `length + 1`)
- **Decimal(12,2)** para valores monetários (evita erros de ponto flutuante)
- **bcryptjs** para hash de senhas (salt rounds: 10)
- **JWT** com expiração de 7 dias
- **Zod** para validação server-side
- Categorias customizadas usam **emojis** como ícone
- Categorias padrão usam **Material Icons**
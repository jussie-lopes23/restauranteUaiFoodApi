# 🍔 UaiFood - Sistema de Gestão para Restaurante

O **UaiFood** é uma aplicação **Full-Stack** para gestão de pedidos de um restaurante.  
O sistema permite que clientes façam pedidos online e que administradores gerenciem o cardápio, usuários e o status dos pedidos.

---

## 📄 Documentação e Arquitetura

Para detalhes profundos sobre a arquitetura do projeto, decisões técnicas, segurança e design system, consulte:

👉 **Leia a Documentação de Arquitetura (ARCHITECTURE.md)**

---

## 🚀 Tecnologias Utilizadas

### **Back-end**
- Node.js  
- Express  
- TypeScript  
- Prisma ORM  
- PostgreSQL  
- Zod  
- JWT  

### **Front-end**
- React  
- Vite  
- TypeScript  
- Tailwind CSS  
- Context API  

### **Infraestrutura**
- Docker (para o banco de dados)

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js (v18 ou superior)**
- **Git**
- **Docker Desktop** (Recomendado para o banco de dados)

---

## 🛠️ Como Rodar o Projeto (Passo a Passo)

Siga estas instruções na ordem para configurar o ambiente completo.

---

## ✅ Passo 1: Configurar o Banco de Dados (PostgreSQL)

A forma mais fácil de rodar o banco é usando Docker.

Execute no terminal:

```bash
docker run -d --name restaurante-db \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=restaurante \
  -p 5432:5432 postgres
```

## ✅ Passo 2: Configurar e Rodar o Back-end (restaurante-api)

Entre na pasta do back-end:
```
cd restauranteUaiFoodApi
```

Instale as partes:
```
npm install
```

Crie o arquivo .env na raiz com o conteúdo:
```
# Conexão com o Banco (Docker)
DATABASE_URL="postgresql://postgres:senha@localhost:5432/nomeDoBanco?schema=public"

# Chave Secreta para JWT (Gere uma aleatória segura)
JWT_SECRET="sua_chave_secreta_super_segura_aqui"
```

Crie as tabelas no banco (migrações):
```
npx prisma migrate dev
```

Inicie o servidor:
```
npm run dev
```

Servidor rodando em:
👉 http://localhost:3001
---
Swagger:
👉 http://localhost:3001/api-docs
---

## ✅ Passo 3: Configurar e Rodar o Front-end (restaurante-web)

Em outro terminal, acesse:

```
cd restauranteUaiFoodWeb
```


Instale as partes:

```
npm install
```

Inicie a aplica:

```
npm run dev
```


A aplicação rodará em:
👉 http://localhost:5173

---

📚 Rotas da API (Resumo)

Todas as rotas podem ser testadas no Swagger: /api-docs
| Método   | Rota           | Descrição                                            |
|----------|----------------|------------------------------------------------------|
| **POST** | `/users`       | Cadastro de Cliente                                  |
| **POST** | `/users/login` | Login (Retorna Token JWT)                            |
| **GET**  | `/items`       | Listar Cardápio (Público)                            |
| **POST** | `/orders`      | Criar Pedido (Autenticado)                           |
| **GET**  | `/orders`      | Listar Pedidos (Cliente vê os seus / Admin vê todos) |

# 📘 Visão Geral do Projeto

O **UaiFood** é uma solução Full-Stack completa para gestão de pedidos em restaurantes.  
O sistema permite que clientes:

- Criem contas
- Naveguem pelo cardápio
- Montem carrinhos
- Realizem pedidos

Ao mesmo tempo, oferece um **Painel Administrativo** seguro para:

- Gerenciar produtos e categorias  
- Administrar usuários  
- Acompanhar o status dos pedidos em tempo real  

O projeto foi desenvolvido com foco em **segurança**, **escalabilidade** e **experiência do usuário**, utilizando tecnologias modernas do ecossistema **JavaScript/TypeScript**.

---

# 🚀 2. Stack Tecnológica

### **Linguagem Principal**
- TypeScript (Front-end e Back-end)

### **Back-end**
- Node.js + Express
- Prisma ORM
- PostgreSQL (via Docker)
- Zod (validação)
- JWT (autenticação)
- BCrypt (hash de senhas)

### **Front-end**
- React.js (via Vite)
- Tailwind CSS
- React Router
- Context API

### **Documentação**
- Swagger (OpenAPI 3.0)

---

# 🏛️ 3. Arquitetura de Software

## **3.1. Arquitetura do Back-end (`restauranteUaiFoodApi`)**

A API segue o padrão **Arquitetura em Camadas (Layered Architecture)** para garantir separação de responsabilidades, testabilidade e organização.

### **📌 Estrutura das Camadas**

#### **1. Entry Point (`server.ts`)**
- Inicializa o servidor Express.
- Configura CORS, JSON parser e rotas.

#### **2. Camada de Rotas (`src/routes/`)**
- Define os endpoints HTTP.
- Aplica middlewares de autenticação/autorização.
- Não contém lógica de negócio.

#### **3. Camada de Controladores (`src/controllers/`)**
- Recebe `req`, prepara `res`.
- Validação com **Zod**.
- Retorna status HTTP adequados.

#### **4. Camada de Serviços (`src/services/`)**
- Contém **toda a lógica de negócio**.
- Calcula totais, verifica itens, criptografa senhas, etc.
- Única camada que acessa o banco.

#### **5. Camada de Dados (Prisma ORM)**
- Representa abstração do PostgreSQL.
- Gerencia relacionamentos (1:N, N:N).
- Usa `schema.prisma` como fonte de verdade.

---

## **3.2. Arquitetura do Front-end (`restaurante-web`)**

Aplicação **SPA (Single Page Application)** construída com React e componentes funcionais.

### **📌 Gestão de Estado Global (Context API)**

#### **AuthContext**
- Armazena token JWT
- Mantém dados do usuário logado
- Persiste sessão via `localStorage`

#### **CartContext**
- Adiciona/remover itens ao carrinho
- Manipula quantidades
- Calcula totais

### **📌 Roteamento e Segurança (React Router)**

#### Implementações:
- `PrivateRoute` — Acesso restrito a usuários logados
- `GuestRoute` — Impede acesso de usuários autenticados às páginas de login
- `AdminRoute` — Somente ADMIN acessa o painel administrativo

### **📌 Comunicação com API (Service Layer)**
- Implementada em `src/services/api.ts`
- Axios com:
  - `baseURL`
  - interceptadores de erros
  - envio automático do token

---

# 🎨 4. Design System

Optei por um **Design System customizado**, sem uso de bibliotecas prontas (como Material UI), garantindo leveza e identidade visual própria.

### **Pilares do Design System**

#### **🎯 Utility-First com Tailwind**
- Estilização via classes utilitárias
- CSS final extremamente leve

#### **🎨 Consistência Visual**
- Cores do Tailwind (blue-600, red-500, gray-100)
- Espaçamentos padronizados (ex: `p-4`, `m-2`)
- Tipografia sans-serif

#### **📱 Mobile-First**
Exemplo:
- `grid-cols-1` para mobiles
- `md:grid-cols-3` para desktops

#### **🔔 Feedback ao Usuário**
- Utilização de `react-hot-toast` para feedbacks de sucesso/erro

---

# 🔐 5. Segurança e Privacidade

A segurança foi implementada de forma robusta, cobrindo autenticação, autorização, validação e proteção de dados.

## **5.1. Autenticação e Autorização**

### **✔ JWT**
- Sistema stateless
- Token enviado no header:  
  `Authorization: Bearer <token>`

### **✔ Hash de Senhas**
- Utilização do **bcrypt**
- Senhas nunca são salvas em texto plano

### **✔ Middlewares**
- `authMiddleware` → Verifica token JWT
- `adminMiddleware` → Permite apenas ADMIN executar ações sensíveis

---

## **5.2. Validação e Integridade de Dados**

### **✔ Zod**
- Criação de schemas rigorosos
- Validação ocorre antes de qualquer processamento

### **✔ CORS**
- Aceita apenas origens autorizadas

---

## **5.3. Privacidade e Consentimento (LGPD)**

### Implementações:
- Checkbox obrigatório para aceitar termos
- Botão de cadastro desabilitado sem o aceite
- Validação redundante no Back-end pelo Zod

---

# 📄 6. Documentação da API (Swagger)

A API é totalmente documentada utilizando **Swagger / OpenAPI 3.0**.

### **Acesso**
- `http://localhost:3001/api-docs`

### **Funcionalidades**
- Visualização de endpoints
- Testes interativos via navegador
- Envio de token JWT no teste das rotas
- Exemplos completos de Request e Response

---


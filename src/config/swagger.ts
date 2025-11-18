// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import type { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurante UaiFood API',
      version: '1.0.0',
      description:
        'API completa para o sistema de pedidos de um restaurante, com autenticação JWT e gestão de pedidos.',
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Servidor de Desenvolvimento Local',
      },
    ],
    
    // --- DEFINIÇÕES GLOBAIS DE TAGS ---
    tags: [
      {
        name: 'Users',
        description: 'Gestão de usuários e autenticação',
      },
      {
        name: 'Categories',
        description: 'Gestão das categorias do cardápio',
      },
      {
        name: 'Items',
        description: 'Gestão dos itens (produtos) do cardápio',
      },
      {
        name: 'Addresses',
        description: 'Gestão de endereços do usuário logado',
      },
      {
        name: 'Orders',
        description: 'Gestão de pedidos',
      },
    ],

    // --- DEFINIÇÕES GLOBAIS DE COMPONENTES ---
    components: {
      // --- Definição de Segurança (Bearer Token) ---
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT: Bearer {token}',
        },
      },
      
      // --- Definições de Schemas (Modelos) ---
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'O ID do usuário (CUID)' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            phone: { type: 'string' },
            type: { type: 'string', enum: ['CLIENT', 'ADMIN'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            description: { type: 'string' },
          },
          example: {
            id: 'clx123...',
            description: 'Bebidas',
          },
        },
        Item: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            description: { type: 'string' },
            unitPrice: { type: 'number', format: 'decimal' },
            categoryId: { type: 'string' },
            category: { $ref: '#/components/schemas/Category' },
          },
          example: {
            id: 'clx456...',
            description: 'Coca-Cola 2L',
            unitPrice: 10.5,
            categoryId: 'clx123...',
          },
        },
        Address: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            street: { type: 'string' },
            number: { type: 'string' },
            district: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string', example: 'MG' },
            zipCode: { type: 'string', example: '38000000' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            paymentMethod: { type: 'string', enum: ['CASH', 'DEBIT', 'CREDIT', 'PIX'] },
            status: { type: 'string' },
            clientId: { type: 'string' },
            addressId: { type: 'string' },
            orderItems: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  quantity: { type: 'integer' },
                  unitPrice: { type: 'number' },
                  item: { $ref: '#/components/schemas/Item' },
                },
              },
            },
          },
        },
        OrderItemInput: {
          type: 'object',
          required: ['itemId', 'quantity'],
          properties: {
            itemId: { type: 'string', description: 'ID do item (produto)' },
            quantity: { type: 'integer', minimum: 1 },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // O caminho continua o mesmo
};


const swaggerSpec = swaggerJsdoc(options);



export default swaggerSpec;
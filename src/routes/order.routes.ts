import { Router } from 'express';
import * as OrderController from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const orderRoutes = Router();

// --- Rotas Protegidas (Clientes e Admins) ---

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: 'Cria um novo pedido.'
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMethod
 *               - addressId
 *               - items
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum:
 *                   - CASH
 *                   - DEBIT
 *                   - CREDIT
 *                   - PIX
 *               addressId:
 *                 type: string
 *                 description: 'ID de um endereço do usuário logado'
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItemInput'
 *     responses:
 *       '201':
 *         description: 'Pedido criado com sucesso.'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       '400':
 *         description: 'Erro de validação.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Um ou mais itens não foram encontrados.'
 *       '401':
 *         description: 'Não autorizado.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Token inválido.'
 */
orderRoutes.post('/', authMiddleware, OrderController.createOrderController);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: 'Lista pedidos (CLIENTE vê os seus, ADMIN vê todos).'
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: 'Lista de pedidos.'
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       '401':
 *         description: 'Não autorizado.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Token inválido.'
 */
orderRoutes.get('/', authMiddleware, OrderController.listOrdersController);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: 'Busca um pedido por ID (CLIENTE só pode ver o seu).'
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: 'Dados do pedido.'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       '401':
 *         description: 'Não autorizado.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Token inválido.'
 *       '403':
 *         description: 'Acesso negado.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Acesso não autorizado a este pedido.'
 *       '404':
 *         description: 'Pedido não encontrado.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Pedido não encontrado.'
 */
orderRoutes.get('/:id', authMiddleware, OrderController.getOrderByIdController);

// --- Rota Exclusiva de Admin ---

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: '(Admin) Atualiza o status de um pedido.'
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: 'PREPARING'
 *     responses:
 *       '200':
 *         description: 'Status atualizado.'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       '400':
 *         description: 'Erro de validação.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Erro de validação'
 *       '401':
 *         description: 'Não autorizado.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Token inválido.'
 *       '403':
 *         description: 'Acesso negado.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Requer privilégios de administrador.'
 *       '404':
 *         description: 'Pedido não encontrado.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Pedido não encontrado.'
 */
orderRoutes.patch(
  '/:id/status',
  authMiddleware,
  adminMiddleware,
  OrderController.updateOrderStatusController
);

export default orderRoutes;

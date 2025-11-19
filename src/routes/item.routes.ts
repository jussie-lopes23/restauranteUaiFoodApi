import { Router } from 'express';
import * as ItemController from '../controllers/item.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const itemRoutes = Router();

//Rotas Públicas

/**
 * @swagger
 * /items:
 *   get:
 *     summary: 'Lista todos os itens do cardápio.'
 *     tags:
 *       - Items
 *     responses:
 *       '200':
 *         description: 'Lista de itens com suas categorias.'
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
itemRoutes.get('/', ItemController.listItemsController);

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: 'Busca um item por ID.'
 *     tags:
 *       - Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: 'Dados do item.'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       '404':
 *         description: 'Item não encontrado.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Item não encontrado.'
 */
itemRoutes.get('/:id', ItemController.getItemByIdController);

//Rotas de Admin

/**
 * @swagger
 * /items:
 *   post:
 *     summary: '(Admin) Cria um novo item.'
 *     tags:
 *       - Items
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - unitPrice
 *               - categoryId
 *             properties:
 *               description:
 *                 type: string
 *                 example: 'Pizza de Calabresa'
 *               unitPrice:
 *                 type: number
 *                 example: 45.50
 *               categoryId:
 *                 type: string
 *                 example: 'clx123...'
 *     responses:
 *       '201':
 *         description: 'Item criado.'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       '400':
 *         description: 'Erro de validação ou Categoria não encontrada.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Categoria não encontrada.'
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
 *                   example: 'Acesso negado.'
 */
itemRoutes.post(
  '/',
  authMiddleware,
  adminMiddleware,
  ItemController.createItemController
);

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: '(Admin) Atualiza um item.'
 *     tags:
 *       - Items
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               unitPrice:
 *                 type: number
 *               categoryId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: 'Item atualizado.'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
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
 *                   example: 'Acesso negado.'
 *       '404':
 *         description: 'Item não encontrado.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Item não encontrado.'
 */
itemRoutes.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  ItemController.updateItemController
);

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: '(Admin) Deleta um item.'
 *     tags:
 *       - Items
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: 'Item deletado.'
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
 *                   example: 'Acesso negado.'
 *       '404':
 *         description: 'Item não encontrado.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Item não encontrado.'
 */
itemRoutes.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  ItemController.deleteItemController
);

export default itemRoutes;

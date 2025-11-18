import { Router } from 'express';
import * as CategoryController from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const categoryRoutes = Router();

// --- Rotas Públicas ---

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lista todas as categorias.
 *     tags: [Categories]
 *     responses:
 *       '200':
 *         description: Lista de categorias.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
categoryRoutes.get('/', CategoryController.listCategoriesController);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Busca uma categoria por ID.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Dados da categoria.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       '404':
 *         description: Categoria não encontrada.
 */
categoryRoutes.get('/:id', CategoryController.getCategoryByIdController);

// --- Rotas de Admin (Protegidas) ---

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: (Admin) Cria uma nova categoria.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [description]
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Sobremesas"
 *     responses:
 *       '201':
 *         description: Categoria criada.
 *       '400':
 *         description: Erro de validação.
 *       '401':
 *         description: Não autorizado.
 *       '403':
 *         description: Acesso negado.
 *       '409':
 *         description: Categoria já existe.
 */
categoryRoutes.post(
  '/',
  authMiddleware,
  adminMiddleware,
  CategoryController.createCategoryController
);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: (Admin) Atualiza uma categoria.
 *     tags: [Categories]
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
 *                 example: "Bebidas Geladas"
 *     responses:
 *       '200':
 *         description: Categoria atualizada.
 *       '400':
 *         description: Erro de validação.
 *       '401':
 *         description: Não autorizado.
 *       '403':
 *         description: Acesso negado.
 *       '404':
 *         description: Categoria não encontrada.
 */
categoryRoutes.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  CategoryController.updateCategoryController
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: (Admin) Deleta uma categoria.
 *     tags: [Categories]
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
 *         description: Categoria deletada.
 *       '401':
 *         description: Não autorizado.
 *       '403':
 *         description: Acesso negado.
 *       '404':
 *         description: Categoria não encontrada.
 */
categoryRoutes.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  CategoryController.deleteCategoryController
);

export default categoryRoutes;

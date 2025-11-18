import { Router } from 'express';
import {
  createUserController,
  loginUserController,
  getMeController,
  updateMeController,
  changePasswordController,
  deleteMeController,
  listUsersController,
  getUserByIdController,
  updateUserByIdController,
  deleteUserByIdController,
} from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const userRoutes = Router();

// --- Rotas Públicas ---

/**
 * @swagger
 * /users:
 *   post:
 *     summary: "Cria um novo usuário (Cadastro)."
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *               - acceptsTerms
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               acceptsTerms:
 *                 type: boolean
 *                 description: "Usuário deve aceitar os termos (literal: true)"
 *     responses:
 *       '201':
 *         description: "Usuário criado com sucesso."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: "Erro de validação."
 *       '409':
 *         description: "Conflito (e-mail já em uso)."
 */
userRoutes.post('/', createUserController);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: "Autentica um usuário e retorna um token JWT."
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@email.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "senha123"
 *     responses:
 *       '200':
 *         description: "Login bem-sucedido."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       '401':
 *         description: "E-mail ou senha inválidos."
 */
userRoutes.post('/login', loginUserController);

// --- Rotas Protegidas (Gerenciamento do Próprio Usuário) ---

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: "Retorna os dados do usuário logado."
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: "Dados do usuário."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: "Não autorizado (token inválido ou ausente)."
 */
userRoutes.get('/me', authMiddleware, getMeController);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: "Atualiza o nome ou telefone do usuário logado."
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       '200':
 *         description: "Perfil atualizado."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: "Erro de validação."
 *       '401':
 *         description: "Não autorizado."
 */
userRoutes.put('/me', authMiddleware, updateMeController);

/**
 * @swagger
 * /users/me/password:
 *   put:
 *     summary: "Altera a senha do usuário logado."
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       '204':
 *         description: "Senha alterada com sucesso."
 *       '400':
 *         description: "Erro de validação (ex: senha nova muito curta)."
 *       '401':
 *         description: "Não autorizado (ex: senha antiga incorreta)."
 */
userRoutes.put('/me/password', authMiddleware, changePasswordController);

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: "Deleta a conta do usuário logado."
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '204':
 *         description: "Conta deletada com sucesso."
 *       '401':
 *         description: "Não autorizado."
 *       '409':
 *         description: "Conflito (ex: usuário possui pedidos)."
 */
userRoutes.delete('/me', authMiddleware, deleteMeController);

// --- Rotas de ADMIN (Gerenciamento de TODOS os Usuários) ---

/**
 * @swagger
 * /users:
 *   get:
 *     summary: "(Admin) Lista todos os usuários do sistema."
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: "Lista de usuários."
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '401':
 *         description: "Não autorizado."
 *       '403':
 *         description: "Acesso negado (não é admin)."
 */
userRoutes.get('/', authMiddleware, adminMiddleware, listUsersController);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: "(Admin) Busca um usuário específico por ID."
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "O ID do usuário (CUID)"
 *     responses:
 *       '200':
 *         description: "Dados do usuário."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: "Não autorizado."
 *       '403':
 *         description: "Acesso negado."
 *       '404':
 *         description: "Usuário não encontrado."
 */
userRoutes.get('/:id', authMiddleware, adminMiddleware, getUserByIdController);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: "(Admin) Atualiza nome, telefone ou tipo de um usuário."
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "O ID do usuário (CUID)"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [CLIENT, ADMIN]
 *     responses:
 *       '200':
 *         description: "Usuário atualizado."
 *       '400':
 *         description: "Erro de validação."
 *       '401':
 *         description: "Não autorizado."
 *       '403':
 *         description: "Acesso negado."
 *       '404':
 *         description: "Usuário não encontrado."
 */
userRoutes.put('/:id', authMiddleware, adminMiddleware, updateUserByIdController);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: "(Admin) Deleta um usuário por ID."
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "O ID do usuário (CUID)"
 *     responses:
 *       '204':
 *         description: "Usuário deletado."
 *       '401':
 *         description: "Não autorizado."
 *       '403':
 *         description: "Acesso negado."
 *       '404':
 *         description: "Usuário não encontrado."
 *       '409':
 *         description: "Conflito (ex: usuário possui pedidos)."
 */
userRoutes.delete('/:id', authMiddleware, adminMiddleware, deleteUserByIdController);

export default userRoutes;

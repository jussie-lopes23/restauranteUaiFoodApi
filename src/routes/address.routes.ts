import { Router } from 'express';
import * as AddressController from '../controllers/address.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const addressRoutes = Router();

// Todas as rotas de endereço exigem autenticação
addressRoutes.use(authMiddleware);

/**
 * @swagger
 * /addresses:
 *   post:
 *     summary: 'Cria um novo endereço para o usuário logado.'
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - street
 *               - number
 *               - district
 *               - city
 *               - state
 *               - zipCode
 *             properties:
 *               street:
 *                 type: string
 *               number:
 *                 type: string
 *               district:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipCode:
 *                 type: string
 *     responses:
 *       '201':
 *         description: 'Endereço criado.'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
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
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
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
addressRoutes.post('/', AddressController.createAddressController);

/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: 'Lista todos os endereços do usuário logado.'
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: 'Lista de endereços.'
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
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
addressRoutes.get('/', AddressController.listAddressesController);

/**
 * @swagger
 * /addresses/{id}:
 *   get:
 *     summary: 'Busca um endereço do usuário logado por ID.'
 *     tags:
 *       - Addresses
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
 *         description: 'Dados do endereço.'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
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
 *       '404':
 *         description: 'Endereço não encontrado.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Endereço não encontrado ou não pertence ao usuário.'
 */
addressRoutes.get('/:id', AddressController.getAddressByIdController);

/**
 * @swagger
 * /addresses/{id}:
 *   put:
 *     summary: 'Atualiza um endereço do usuário logado.'
 *     tags:
 *       - Addresses
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
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       '200':
 *         description: 'Endereço atualizado.'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
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
 *       '404':
 *         description: 'Endereço não encontrado.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Endereço não encontrado ou não pertence ao usuário.'
 */
addressRoutes.put('/:id', AddressController.updateAddressController);

/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     summary: 'Deleta (desassocia) um endereço do usuário logado.'
 *     tags:
 *       - Addresses
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
 *         description: 'Endereço deletado/desassociado.'
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
 *       '404':
 *         description: 'Endereço não encontrado.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Endereço não encontrado ou não pertence ao usuário.'
 */
addressRoutes.delete('/:id', AddressController.deleteAddressController);

export default addressRoutes;

import { Router } from 'express';
import * as AddressController from '../controllers/address.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const addressRoutes = Router();

// Todas as rotas exigem autenticação
addressRoutes.use(authMiddleware);

/**
 * @swagger
 * /addresses:
 *   post:
 *     summary: Cria um novo endereço para o usuário logado.
 *     tags: [Addresses]
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
 *                 example: "Rua das Flores"
 *               number:
 *                 type: string
 *                 example: "123"
 *               district:
 *                 type: string
 *                 example: "Centro"
 *               city:
 *                 type: string
 *                 example: "Uberlândia"
 *               state:
 *                 type: string
 *                 example: "MG"
 *               zipCode:
 *                 type: string
 *                 example: "38400-000"
 *     responses:
 *       201:
 *         description: Endereço criado.
 *       400:
 *         description: Erro de validação.
 *       401:
 *         description: Não autorizado.
 */
addressRoutes.post('/', AddressController.createAddressController);

/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: Lista todos os endereços do usuário logado.
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de endereços.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *       401:
 *         description: Não autorizado.
 */
addressRoutes.get('/', AddressController.listAddressesController);

/**
 * @swagger
 * /addresses/{id}:
 *   get:
 *     summary: Busca um endereço do usuário logado por ID.
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do endereço.
 *       401:
 *         description: Não autorizado.
 *       404:
 *         description: Endereço não encontrado ou não pertence ao usuário.
 */
addressRoutes.get('/:id', AddressController.getAddressByIdController);

/**
 * @swagger
 * /addresses/{id}:
 *   put:
 *     summary: Atualiza um endereço do usuário logado.
 *     tags: [Addresses]
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
 *       200:
 *         description: Endereço atualizado.
 *       400:
 *         description: Erro de validação.
 *       401:
 *         description: Não autorizado.
 *       404:
 *         description: Endereço não encontrado ou não pertence ao usuário.
 */
addressRoutes.put('/:id', AddressController.updateAddressController);

/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     summary: Deleta um endereço do usuário logado.
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Endereço deletado/desassociado.
 *       401:
 *         description: Não autorizado.
 *       404:
 *         description: Endereço não encontrado ou não pertence ao usuário.
 */
addressRoutes.delete('/:id', AddressController.deleteAddressController);

export default addressRoutes;

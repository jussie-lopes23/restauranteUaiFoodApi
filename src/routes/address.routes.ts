import { Router } from 'express';
import * as AddressController from '../controllers/address.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const addressRoutes = Router();

// Todas as rotas de endereço exigem autenticação
addressRoutes.use(authMiddleware);

// Criar um novo endereço (para o usuário logado)
addressRoutes.post('/', AddressController.createAddressController);

// Listar todos os endereços (do usuário logado)
addressRoutes.get('/', AddressController.listAddressesController);

// Buscar, Atualizar e Deletar um endereço específico (do usuário logado)
addressRoutes.get('/:id', AddressController.getAddressByIdController);
addressRoutes.put('/:id', AddressController.updateAddressController);
addressRoutes.delete('/:id', AddressController.deleteAddressController);

export default addressRoutes;
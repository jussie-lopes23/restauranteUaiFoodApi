import { Router } from 'express';
import * as ItemController from '../controllers/item.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const itemRoutes = Router();

// --- Rotas Públicas ---
// Listar todos os itens
itemRoutes.get('/', ItemController.listItemsController);
// Buscar um item por ID
itemRoutes.get('/:id', ItemController.getItemByIdController);

// --- Rotas de Admin (Protegidas) ---
// Criar item
itemRoutes.post(
  '/',
  authMiddleware,
  adminMiddleware,
  ItemController.createItemController
);

// Atualizar item
itemRoutes.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  ItemController.updateItemController
);

// Deletar item
itemRoutes.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  ItemController.deleteItemController
);

export default itemRoutes;
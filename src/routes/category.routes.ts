import { Router } from 'express';
import * as CategoryController from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const categoryRoutes = Router();

// --- Rotas Públicas ---
// Listar todas as categorias
categoryRoutes.get('/', CategoryController.listCategoriesController);
// Buscar uma categoria por ID
categoryRoutes.get('/:id', CategoryController.getCategoryByIdController);


// --- Rotas de Admin (Protegidas) ---
// Criar categoria
categoryRoutes.post(
  '/',
  authMiddleware,      // 1º: Está logado?
  adminMiddleware,     // 2º: É admin?
  CategoryController.createCategoryController
);

// Atualizar categoria
categoryRoutes.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  CategoryController.updateCategoryController
);

// Deletar categoria
categoryRoutes.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  CategoryController.deleteCategoryController
);

export default categoryRoutes;
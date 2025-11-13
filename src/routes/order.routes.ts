import { Router } from 'express';
import * as OrderController from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const orderRoutes = Router();

// --- Rotas Protegidas (Clientes e Admins) ---

// Criar Pedido (CLIENTE ou ADMIN)
orderRoutes.post(
  '/',
  authMiddleware,
  OrderController.createOrderController
);

// Listar Pedidos (CLIENTE vê os seus, ADMIN vê todos)
orderRoutes.get(
  '/',
  authMiddleware,
  OrderController.listOrdersController
);

// Buscar Pedido por ID (CLIENTE vê o seu, ADMIN vê todos)
orderRoutes.get(
  '/:id',
  authMiddleware,
  OrderController.getOrderByIdController
);


// --- Rota Exclusiva de Admin ---

// Atualizar Status do Pedido
orderRoutes.patch( // Usamos PATCH pois é uma atualização parcial (só o status)
  '/:id/status',
  authMiddleware,
  adminMiddleware,
  OrderController.updateOrderStatusController
);

export default orderRoutes;
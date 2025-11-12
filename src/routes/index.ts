import { Router } from 'express';
import userRoutes from './user.routes';
import categoryRoutes from './category.routes';
// Importaremos os outros roteadores aqui
// import itemRoutes from './item.routes';
// import orderRoutes from './order.routes';

const routes = Router();

// Quando uma requisição chegar em /users, ela será
// redirecionada para o 'userRoutes'
routes.use('/users', userRoutes);
routes.use('/categories', categoryRoutes);

// routes.use('/items', itemRoutes);
// routes.use('/orders', orderRoutes);

export default routes;
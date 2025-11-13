import { Router } from 'express';
import userRoutes from './user.routes';
import categoryRoutes from './category.routes';
import itemRoutes from './item.routes';
import orderRoutes from './order.routes'
import addressRoutes from './address.routes'


const routes = Router();

routes.use('/users', userRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/items', itemRoutes);
routes.use('/orders', orderRoutes);
routes.use('/addresses', addressRoutes);


export default routes;
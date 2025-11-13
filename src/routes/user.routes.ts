import { Router } from 'express';
import { createUserController, loginUserController, getMeController, updateMeController, changePasswordController, deleteMeController, listUsersController, getUserByIdController, updateUserByIdController, deleteUserByIdController, } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

// Cria o roteador específico para usuários
const userRoutes = Router();

// --- Rotas Públicas ---
userRoutes.post('/', createUserController);
userRoutes.post('/login', loginUserController);

// --- Rotas Protegidas do usuário client (precisam de token) ---
userRoutes.get('/me', authMiddleware, getMeController);
userRoutes.put('/me', authMiddleware, updateMeController);
userRoutes.put('/me/password', authMiddleware, changePasswordController);
userRoutes.delete('/me', authMiddleware, deleteMeController);

// --- Rotas Protegidas do Admin (precisam de token e ser admin) ---
userRoutes.get('/', authMiddleware, adminMiddleware, listUsersController);
userRoutes.get('/:id', authMiddleware, adminMiddleware, getUserByIdController);
userRoutes.put('/:id', authMiddleware, adminMiddleware, updateUserByIdController);
userRoutes.delete('/:id', authMiddleware, adminMiddleware, deleteUserByIdController);


export default userRoutes;
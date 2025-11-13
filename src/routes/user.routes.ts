import { Router } from 'express';
import { createUserController, loginUserController, getMeController, updateMeController, } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
// Importaremos o controller de login aqui no futuro

// Cria o roteador específico para usuários
const userRoutes = Router();

// --- Rotas Públicas ---
userRoutes.post('/', createUserController);
userRoutes.post('/login', loginUserController);

// --- Rotas Protegidas (precisam de token) ---
userRoutes.get('/me', authMiddleware, getMeController);

//Rota usuário update
userRoutes.put('/me', authMiddleware, updateMeController);

export default userRoutes;
import { Router } from 'express';
import { createUserController, loginUserController, getMeController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
// Importaremos o controller de login aqui no futuro

// Cria o roteador específico para usuários
const userRoutes = Router();

// Define a rota POST para / (que será /api/users/)
// Quando um POST chegar, ele chama o createUserController
userRoutes.post('/', createUserController);

userRoutes.post('/login', loginUserController);

// TODO: Adicionar a rota de login
// userRoutes.post('/login', loginUserController);

// --- Rotas Protegidas (precisam de token) ---
// 3. ADICIONE A ROTA
// Note como o 'authMiddleware' vem ANTES do 'getMeController'.
// Isso força o Express a rodar o middleware primeiro.
userRoutes.get('/me', authMiddleware, getMeController);

export default userRoutes;
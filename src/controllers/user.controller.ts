import { Request, Response } from 'express';
import { createUserSchema, loginUserSchema, updateUserSchema, changePasswordSchema, adminUpdateUserSchema } from '../schemas/user.schema'; // 1. Schema do Zod
import { createUserService, loginUserService, getMeService, updateMeService, changePasswordService, deleteMeService, listUsersService, getUserByIdService, updateUserByIdService, deleteUserByIdService, } from '../services/user.service'; // 2. Nosso Serviço
import { ZodError } from 'zod';

/**
 * Handler (controlador) para criar um novo usuário.
 */
export const createUserController = async (req: Request, res: Response) => {
  try {
    // 3. Validar os dados do body com o Zod
    // O .parse() dispara um erro (ZodError) se a validação falhar.
    const validatedData = createUserSchema.parse(req.body);

    // 4. Chamar o Serviço para criar o usuário
    const newUser = await createUserService(validatedData);

    // 5. Se tudo deu certo, retornar o usuário criado
    // Retiramos a senha antes de enviar a resposta
    const { password, ...userWithoutPassword } = newUser;

    // 201 Created - Padrão para criação de recursos
    return res.status(201).json(userWithoutPassword); 

  } catch (error: unknown) {
    // 6. Lidar com erros

    // Se o erro for do Zod (falha na validação)
    if (error instanceof ZodError) {
      // 400 Bad Request - O cliente enviou dados errados
      return res.status(400).json({
        message: 'Erro de validação',
        errors: error.issues, // Mostra os campos que falharam
      });
    }

    // Se o erro for do nosso Serviço (ex: "E-mail já existe")
    if (error instanceof Error) {
      // 409 Conflict - O recurso já existe
      if (error.message === 'Este e-mail já está em uso.') {
        return res.status(409).json({ message: error.message });
      }
    }

    // Erro genérico (ex: falha no banco)
    // 500 Internal Server Error
    console.error('Erro inesperado no createUserController:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};


export const loginUserController = async (req: Request, res: Response) => {
  try {
    // 1. Validar os dados do body com o schema de login
    const validatedData = loginUserSchema.parse(req.body);

    // 2. Chamar o serviço de login
    const token = await loginUserService(validatedData);

    // 3. Retornar o token
    return res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token,
    });
    
  } catch (error: unknown) {
    // Se o erro for do Zod (falha na validação)
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Erro de validação',
        errors: error.issues,
      });
    }

    // Se o erro for do nosso Serviço ("E-mail ou senha inválidos")
    if (error instanceof Error) {
      // 401 Unauthorized - Credenciais inválidas
      if (error.message === 'E-mail ou senha inválidos.') {
        return res.status(401).json({ message: error.message });
      }
    }

    // Erro genérico
    console.error('Erro inesperado no loginUserController:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const getMeController = async (req: Request, res: Response) => {
  try {
    // 2. PEGAR o ID do usuário do token (anexado pelo middleware)
    // O 'req.user' foi definido no authMiddleware!
    const userId = req.user?.id;

    if (!userId) {
      // Isso não deve acontecer se o middleware estiver funcionando
      return res.status(401).json({ message: 'ID do usuário não encontrado no token.' });
    }

    // 3. CHAMAR o serviço
    const user = await getMeService(userId);

    // 4. RETORNAR o usuário
    return res.status(200).json(user);

  } catch (error: unknown) {
    // Se o serviço não encontrar o usuário (ex: foi deletado)
    if (error instanceof Error && error.message === 'Usuário não encontrado.') {
      return res.status(404).json({ message: error.message });
    }

    // Erro genérico
    console.error('Erro inesperado no getMeController:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const updateMeController = async (req: Request, res: Response) => {
  try {
    // 2. VALIDA o body com o schema de update
    const validatedData = updateUserSchema.parse(req.body);

    // 3. PEGA o ID do usuário (do token)
    const userId = req.user!.id;

    // 4. CHAMA o serviço
    const user = await updateMeService(userId, validatedData);

    // 5. RETORNA o usuário atualizado
    return res.status(200).json(user);

  } catch (error: unknown) {
    // 6. TRATA erros (Zod)
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Erro de validação',
        errors: error.issues,
      });
    }

    // Erro genérico
    console.error('Erro inesperado no updateMeController:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const changePasswordController = async (req: Request, res: Response) => {
  try {
    const validatedData = changePasswordSchema.parse(req.body);
    const userId = req.user!.id;

    await changePasswordService(userId, validatedData);

    // 204 No Content - Sucesso, mas sem corpo de resposta
    return res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Erro de validação',
        errors: error.issues,
      });
    }
    // Erro de senha antiga incorreta
    if (error instanceof Error && error.message === 'A senha antiga está incorreta.') {
      // 401 Unauthorized - Credencial inválida
      return res.status(401).json({ message: error.message });
    }

    console.error('Erro inesperado no changePasswordController:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const deleteMeController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    await deleteMeService(userId);

    // 204 No Content
    return res.status(204).send();
  } catch (error: unknown) {
    // Erro de restrição de chave (usuário tem pedidos)
    if (error instanceof Error && error.message.includes('associado a pedidos')) {
      // 409 Conflict - A ação não pode ser concluída
      return res.status(409).json({ message: error.message });
    }
    
    console.error('Erro inesperado no deleteMeController:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * (Admin) Handler para listar todos os usuários
 */
export const listUsersController = async (req: Request, res: Response) => {
  try {
    const users = await listUsersService();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * (Admin) Handler para buscar usuário por ID
 */
export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getUserByIdService(id);
    return res.status(200).json(user);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Usuário não encontrado.') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * (Admin) Handler para atualizar usuário por ID
 */
export const updateUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = adminUpdateUserSchema.parse(req.body);
    
    // Impede o admin de se atualizar por esta rota (deve usar /me)
    if (id === req.user?.id) {
      return res.status(403).json({ message: 'Use a rota /me para atualizar seu próprio perfil.'});
    }

    const user = await updateUserByIdService(id, validatedData);
    return res.status(200).json(user);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: 'Erro de validação', errors: error.issues });
    }
    if (error instanceof Error && error.message === 'Usuário não encontrado.') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * (Admin) Handler para deletar usuário por ID
 */
export const deleteUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Impede o admin de se deletar por esta rota (deve usar /me)
    if (id === req.user?.id) {
      return res.status(403).json({ message: 'Use a rota /me para deletar seu próprio perfil.'});
    }

    await deleteUserByIdService(id);
    return res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Usuário não encontrado.') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes('associado a pedidos')) {
        return res.status(409).json({ message: error.message });
      }
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
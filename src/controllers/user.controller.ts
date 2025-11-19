import { Request, Response } from 'express';
import { createUserSchema, loginUserSchema, updateUserSchema, changePasswordSchema, adminUpdateUserSchema } from '../schemas/user.schema'; // 1. Schema do Zod
import { createUserService, loginUserService, getMeService, updateMeService, changePasswordService, deleteMeService, listUsersService, getUserByIdService, updateUserByIdService, deleteUserByIdService, } from '../services/user.service'; // 2. Nosso Serviço
import { ZodError } from 'zod';

//Criar um novo usuário.
export const createUserController = async (req: Request, res: Response) => {
  try {

    const validatedData = createUserSchema.parse(req.body);

    const newUser = await createUserService(validatedData);

    const { password, ...userWithoutPassword } = newUser;

    return res.status(201).json(userWithoutPassword); 

  } catch (error: unknown) {
  
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Erro de validação',
        errors: error.issues,
      });
    }

    if (error instanceof Error) {
      if (error.message === 'Este e-mail já está em uso.') {
        return res.status(409).json({ message: error.message });
      }
    }

    console.error('Erro inesperado no createUserController:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};


export const loginUserController = async (req: Request, res: Response) => {
  try {
    const validatedData = loginUserSchema.parse(req.body);

    const token = await loginUserService(validatedData);

    return res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token,
    });
    
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Erro de validação',
        errors: error.issues,
      });
    }

    if (error instanceof Error) {
      if (error.message === 'E-mail ou senha inválidos.') {
        return res.status(401).json({ message: error.message });
      }
    }

    console.error('Erro inesperado no loginUserController:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const getMeController = async (req: Request, res: Response) => {
  try {
    //PEGA o ID do usuário (do token)
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'ID do usuário não encontrado no token.' });
    }

    const user = await getMeService(userId);

    return res.status(200).json(user);

  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Usuário não encontrado.') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Erro inesperado no getMeController:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const updateMeController = async (req: Request, res: Response) => {
  try {
    const validatedData = updateUserSchema.parse(req.body);

    const userId = req.user!.id;

    const user = await updateMeService(userId, validatedData);

    return res.status(200).json(user);

  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Erro de validação',
        errors: error.issues,
      });
    }

    console.error('Erro inesperado no updateMeController:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const changePasswordController = async (req: Request, res: Response) => {
  try {
    const validatedData = changePasswordSchema.parse(req.body);
    const userId = req.user!.id;

    await changePasswordService(userId, validatedData);

    return res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Erro de validação',
        errors: error.issues,
      });
    }
    if (error instanceof Error && error.message === 'A senha antiga está incorreta.') {
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

    return res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('associado a pedidos')) {
      return res.status(409).json({ message: error.message });
    }
    
    console.error('Erro inesperado no deleteMeController:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

//listar todos os usuários do sistema
export const listUsersController = async (req: Request, res: Response) => {
  try {
    const users = await listUsersService();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

//buscar usuário por ID
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

//atualizar usuário por ID
export const updateUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = adminUpdateUserSchema.parse(req.body);
    
    // Impede o admin de se atualizar por esta rota 
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


//deletar usuário por ID
export const deleteUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Impede o admin de se deletar por esta rota
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
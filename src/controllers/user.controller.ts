import { Request, Response } from 'express';
import { createUserSchema, loginUserSchema, updateUserSchema } from '../schemas/user.schema'; // 1. Schema do Zod
import { createUserService, loginUserService, getMeService, updateMeService, } from '../services/user.service'; // 2. Nosso Serviço
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
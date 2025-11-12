import bcrypt from 'bcrypt';
import prisma from '../lib/prisma'; // Nosso cliente Prisma
import { CreateUserInput, LoginUserInput } from '../schemas/user.schema'; // Nosso tipo Zod
import jwt from 'jsonwebtoken';

/**
 * Função para criar um novo usuário no banco de dados.
 */
export const createUserService = async (input: CreateUserInput) => {
  // 1. Verificar se o e-mail já está em uso
  const userExists = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (userExists) {
    // É uma boa prática lançar um erro que será tratado depois
    // (no controller) como um status HTTP (ex: 409 Conflict)
    throw new Error('Este e-mail já está em uso.');
  }

  // 2. Criptografar (fazer hash) da senha
  // "salt" é um fator de complexidade, 10-12 é o padrão.
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(input.password, salt);

  // 3. Salvar o usuário no banco de dados
  const newUser = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      phone: input.phone,
      password: hashedPassword,
      // O 'type' é 'CLIENT' por padrão (definido no schema.prisma),
      // então não precisamos especificá-lo aqui.
    },
  });

  // 4. Retornar o usuário criado
  // (Note que o 'newUser' já vem do Prisma sem a senha)
  // Se quiséssemos ter certeza de não vazar, poderíamos fazer:
  // const { password, ...userWithoutPassword } = newUser;
  // return userWithoutPassword;

  return newUser;
};

/**
 * Função para encontrar um usuário pelo e-mail (será útil para o login)
 */
export const findUserByEmailService = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

////

export const loginUserService = async (input: LoginUserInput) => {
  // 1. Encontrar o usuário pelo e-mail
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  // Se o usuário não existir, retorne um erro.
  // Usamos uma mensagem genérica por segurança.
  if (!user) {
    throw new Error('E-mail ou senha inválidos.');
  }

  // 2. Comparar a senha enviada com a senha (hash) no banco
  const passwordMatches = await bcrypt.compare(input.password, user.password);

  // Se as senhas não baterem, retorne o mesmo erro.
  if (!passwordMatches) {
    throw new Error('E-mail ou senha inválidos.');
  }

  // 3. Gerar o Token JWT
  // Pegamos o "segredo" do .env
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('A chave secreta JWT não está configurada.');
  }

  // O "payload" é o que guardamos dentro do token.
  // O 'sub' (subject) é o ID do usuário.
  const token = jwt.sign(
    {
      sub: user.id,
      name: user.name,
      type: user.type,
    },
    secret,
    {
      expiresIn: '8h', // O token expira em 8 horas
    }
  );

  // 4. Retornar o token
  return token;
};

/**
 * Função para buscar um usuário pelo seu ID (para a rota "me")
 */
export const getMeService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    // Usamos 'select' para garantir que NUNCA retornaremos a senha
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      type: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  return user;
};
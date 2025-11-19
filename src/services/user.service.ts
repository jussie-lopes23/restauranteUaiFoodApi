import bcrypt from 'bcrypt';
import prisma from '../lib/prisma'; 
import { CreateUserInput, LoginUserInput, UpdateUserInput, ChangePasswordInput, AdminUpdateUserInput } from '../schemas/user.schema'; // Nosso tipo Zod
import jwt from 'jsonwebtoken';



//Função para criar um novo usuário no banco de dados. 
export const createUserService = async (input: CreateUserInput) => {
  const userExists = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (userExists) {
    throw new Error('Este e-mail já está em uso.');
  }

  //Criptografara senha em hash
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(input.password, salt);

 
  const newUser = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      phone: input.phone,
      password: hashedPassword,
    },
  });


  return newUser;
};

//Função para encontrar um usuário pelo e-mail
export const findUserByEmailService = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};


export const loginUserService = async (input: LoginUserInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    throw new Error('E-mail ou senha inválidos.');
  }

  const passwordMatches = await bcrypt.compare(input.password, user.password);

  if (!passwordMatches) {
    throw new Error('E-mail ou senha inválidos.');
  }

  // Gerar o Token JWT
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('A chave secreta JWT não está configurada.');
  }

  const token = jwt.sign(
    {
      sub: user.id,
      name: user.name,
      type: user.type,
    },
    secret,
    {
      expiresIn: '8h',
    }
  );

  //Retorna o token
  return token;
};


 //Função para buscar um usuário pelo seu ID
export const getMeService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
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

export const updateMeService = async (userId: string, input: UpdateUserInput) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: input.name,
      phone: input.phone,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      type: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

export const changePasswordService = async (
  userId: string,
  input: ChangePasswordInput
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  const passwordMatches = await bcrypt.compare(
    input.oldPassword,
    user.password
  );

  if (!passwordMatches) {
    throw new Error('A senha antiga está incorreta.');
  }

  //Criptografa e salva a nova senha
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(input.newPassword, salt);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });
};

export const deleteMeService = async (userId: string) => {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error: any) {
    if (error.code === 'P2003') { 
      throw new Error(
        'Não é possível deletar este usuário pois ele está associado a pedidos existentes.'
      );
    }
    throw error;
  }
};



//(Admin) Lista todos os usuários do sistema
export const listUsersService = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      type: true,
      createdAt: true,
    },
  });
};


//(Admin) Busca um usuário específico por ID
export const getUserByIdService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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

//(Admin) Atualiza um usuário por ID
export const updateUserByIdService = async (
  userId: string,
  input: AdminUpdateUserInput
) => {
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) {
    throw new Error('Usuário não encontrado.');
  }

  return prisma.user.update({
    where: { id: userId },
    data: input,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      type: true,
    },
  });
};

//(Admin) Deleta um usuário por ID
export const deleteUserByIdService = async (userId: string) => {
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) {
    throw new Error('Usuário não encontrado.');
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error: any) {
    if (error.code === 'P2003') {
      throw new Error(
        'Não é possível deletar este usuário pois ele está associado a pedidos existentes.'
      );
    }
    throw error;
  }
};


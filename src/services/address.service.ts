import prisma from '../lib/prisma';
import { CreateAddressInput, UpdateAddressInput } from '../schemas/address.schema';

// 1. CRIAR Endereço para um Usuário
export const createAddressService = async (input: CreateAddressInput, userId: string) => {
  // Cria o endereço
  const address = await prisma.address.create({
    data: input,
  });

  // Associa o endereço criado ao usuário logado
  await prisma.user.update({
    where: { id: userId },
    data: {
      addresses: {
        // Conecta o endereço existente ao usuário
        connect: { id: address.id },
      },
    },
  });

  return address;
};

// 2. LISTAR Endereços de um Usuário
export const listAddressesByUserService = async (userId: string) => {
  const userWithAddresses = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      addresses: { // Retorna apenas a lista de endereços do usuário
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!userWithAddresses) {
    throw new Error('Usuário não encontrado.');
  }

  return userWithAddresses.addresses;
};

// 3. BUSCAR UM Endereço (e verificar se pertence ao usuário)
export const getAddressByIdService = async (addressId: string, userId: string) => {
  const address = await prisma.address.findUnique({
    where: { id: addressId },
    include: {
      // Inclui os usuários para podermos verificar a posse
      users: {
        where: { id: userId },
      },
    },
  });

  // Se o endereço não existe OU se o usuário não está na lista,
  // significa que ou o endereço não existe ou não pertence a ele.
  if (!address || address.users.length === 0) {
    throw new Error('Endereço não encontrado ou não pertence a este usuário.');
  }

  return address;
};

// 4. ATUALIZAR Endereço
export const updateAddressService = async (addressId: string, userId: string, input: UpdateAddressInput) => {
  // Primeiro, verifica se o endereço pertence ao usuário (usando a função anterior)
  await getAddressByIdService(addressId, userId);

  // Se pertencer, atualiza
  const updatedAddress = await prisma.address.update({
    where: { id: addressId },
    data: input,
  });

  return updatedAddress;
};

// 5. DELETAR Endereço (desassociar do usuário)
export const deleteAddressService = async (addressId: string, userId: string) => {
  // Verifica se o endereço pertence ao usuário
  await getAddressByIdService(addressId, userId);

  // Em vez de deletar o endereço (outra pessoa pode usá-lo),
  // vamos apenas DESCONECTAR o endereço do usuário.
  await prisma.user.update({
    where: { id: userId },
    data: {
      addresses: {
        disconnect: { id: addressId },
      },
    },
  });
  
  // Opcional: Você pode adicionar uma lógica para deletar o endereço
  // se ele não estiver mais conectado a NENHUM usuário.
  // Por enquanto, vamos manter simples.
};
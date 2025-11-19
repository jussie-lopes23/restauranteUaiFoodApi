import prisma from '../lib/prisma';
import { CreateAddressInput, UpdateAddressInput } from '../schemas/address.schema';

//Criar Endereço para um Usuário
export const createAddressService = async (input: CreateAddressInput, userId: string) => {
  const address = await prisma.address.create({
    data: input,
  });
  // Associa o endereço criado ao usuário
  await prisma.user.update({
    where: { id: userId },
    data: {
      addresses: {
        connect: { id: address.id },
      },
    },
  });

  return address;
};

//Lista os endereços de um Usuário
export const listAddressesByUserService = async (userId: string) => {
  const userWithAddresses = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      addresses: { 
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

//Busca endereço
export const getAddressByIdService = async (addressId: string, userId: string) => {
  const address = await prisma.address.findUnique({
    where: { id: addressId },
    include: {
      users: {
        where: { id: userId },
      },
    },
  });

  if (!address || address.users.length === 0) {
    throw new Error('Endereço não encontrado ou não pertence a este usuário.');
  }

  return address;
};

//Atualizar endereço
export const updateAddressService = async (addressId: string, userId: string, input: UpdateAddressInput) => {

  await getAddressByIdService(addressId, userId);

  const updatedAddress = await prisma.address.update({
    where: { id: addressId },
    data: input,
  });

  return updatedAddress;
};

//Deletar endereço
export const deleteAddressService = async (addressId: string, userId: string) => {
  await getAddressByIdService(addressId, userId);

  await prisma.user.update({
    where: { id: userId },
    data: {
      addresses: {
        disconnect: { id: addressId },
      },
    },
  });
  
};
import prisma from '../lib/prisma';
import { CreateItemInput, UpdateItemInput } from '../schemas/item.schema';


const validateCategoryExists = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    throw new Error('Categoria não encontrada.');
  }
};

//CRIAR Item
export const createItemService = async (input: CreateItemInput) => {
  
  await validateCategoryExists(input.categoryId);

  return prisma.item.create({
    data: input,
    include: {
      category: true, 
    },
  });
};

//LISTAR todos os Itens
export const listItemsService = async () => {
  return prisma.item.findMany({
    include: {
      category: {
        select: { description: true }, 
      },
    },
    orderBy: {
      description: 'asc',
    },
  });
};

// 3. BUSCAR UM Item por ID 
export const getItemByIdService = async (id: string) => {
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!item) {
    throw new Error('Item não encontrado.');
  }
  return item;
};

// 4. ATUALIZAR Item
export const updateItemService = async (id: string, input: UpdateItemInput) => {

  if (input.categoryId) {
    await validateCategoryExists(input.categoryId);
  }

  const itemExists = await prisma.item.findUnique({ where: { id } });
  if (!itemExists) {
    throw new Error('Item não encontrado.');
  }

  return prisma.item.update({
    where: { id },
    data: input,
    include: {
      category: true,
    },
  });
};

// 5. DELETAR Item
export const deleteItemService = async (id: string) => {
  
  const itemExists = await prisma.item.findUnique({ where: { id } });
  if (!itemExists) {
    throw new Error('Item não encontrado.');
  }
  // TODO: Adicionar lógica para verificar se o item está em um 'OrderItem'
  return prisma.item.delete({
    where: { id },
  });
};
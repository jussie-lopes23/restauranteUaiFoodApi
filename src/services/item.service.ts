import prisma from '../lib/prisma';
import { CreateItemInput, UpdateItemInput } from '../schemas/item.schema';

/**
 * Valida se uma categoria existe
 * (Função auxiliar interna)
 */
const validateCategoryExists = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    throw new Error('Categoria não encontrada.');
  }
};

// 1. CRIAR Item
export const createItemService = async (input: CreateItemInput) => {
  // Antes de criar, valida se a categoria existe
  await validateCategoryExists(input.categoryId);

  return prisma.item.create({
    data: input,
    include: {
      // Retorna o item já com os dados da categoria
      category: true, 
    },
  });
};

// 2. LISTAR todos os Itens (com suas categorias)
export const listItemsService = async () => {
  return prisma.item.findMany({
    include: {
      category: {
        select: { description: true }, // Pega só a descrição da categoria
      },
    },
    orderBy: {
      description: 'asc',
    },
  });
};

// 3. BUSCAR UM Item por ID (com sua categoria)
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
  // Se o usuário está tentando mudar a categoria,
  // precisamos validar se a NOVA categoria existe.
  if (input.categoryId) {
    await validateCategoryExists(input.categoryId);
  }

  // Garante que o ID do item existe
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
  // Garante que o ID existe
  const itemExists = await prisma.item.findUnique({ where: { id } });
  if (!itemExists) {
    throw new Error('Item não encontrado.');
  }
  
  // TODO: Adicionar lógica para verificar se o item está em um 'OrderItem'
  
  return prisma.item.delete({
    where: { id },
  });
};
import prisma from '../lib/prisma';
import { CreateCategoryInput, UpdateCategoryInput } from '../schemas/category.schema';

// 1. CRIAR Categoria
export const createCategoryService = async (input: CreateCategoryInput) => {
  // Verifica se a categoria já existe
  const categoryExists = await prisma.category.findFirst({
    where: { description: input.description },
  });

  if (categoryExists) {
    throw new Error('Essa categoria já existe.');
  }

  return prisma.category.create({
    data: input,
  });
};

// 2. LISTAR todas as Categorias
export const listCategoriesService = async () => {
  return prisma.category.findMany({
    orderBy: {
      description: 'asc', // Ordena alfabeticamente
    },
  });
};

// 3. BUSCAR UMA Categoria por ID
export const getCategoryByIdService = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error('Categoria não encontrada.');
  }
  return category;
};

// 4. ATUALIZAR Categoria
export const updateCategoryService = async (id: string, input: UpdateCategoryInput) => {
  // Garante que o ID existe antes de atualizar
  const categoryExists = await prisma.category.findUnique({ where: { id } });
  if (!categoryExists) {
    throw new Error('Categoria não encontrada.');
  }

  return prisma.category.update({
    where: { id },
    data: input,
  });
};

// 5. DELETAR Categoria
export const deleteCategoryService = async (id: string) => {
  // Garante que o ID existe antes de deletar
  const categoryExists = await prisma.category.findUnique({ where: { id } });
  if (!categoryExists) {
    throw new Error('Categoria não encontrada.');
  }

  // TODO: Adicionar lógica para verificar se a categoria está em uso por um 'Item'
  // Por enquanto, vamos apenas deletar.
  
  return prisma.category.delete({
    where: { id },
  });
};
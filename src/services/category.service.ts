import prisma from '../lib/prisma';
import { CreateCategoryInput, UpdateCategoryInput } from '../schemas/category.schema';

//Criar Categoria
export const createCategoryService = async (input: CreateCategoryInput) => {
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

//Lista todas as Categorias
export const listCategoriesService = async () => {
  return prisma.category.findMany({
    orderBy: {
      description: 'asc', 
    },
  });
};

//Buscar uma Categoria por ID
export const getCategoryByIdService = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error('Categoria não encontrada.');
  }
  return category;
};

//atualizar Categoria
export const updateCategoryService = async (id: string, input: UpdateCategoryInput) => {

  const categoryExists = await prisma.category.findUnique({ where: { id } });
  if (!categoryExists) {
    throw new Error('Categoria não encontrada.');
  }

  return prisma.category.update({
    where: { id },
    data: input,
  });
};

//Deletar Categoria
export const deleteCategoryService = async (id: string) => {

  const categoryExists = await prisma.category.findUnique({ where: { id } });
  if (!categoryExists) {
    throw new Error('Categoria não encontrada.');
  }

  return prisma.category.delete({
    where: { id },
  });
};
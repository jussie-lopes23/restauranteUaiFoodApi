import { Request, Response } from 'express';
import * as CategoryService from '../services/category.service';
import { ZodError } from 'zod';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';

// 1. CRIAR
export const createCategoryController = async (req: Request, res: Response) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);
    const category = await CategoryService.createCategoryService(validatedData);
    return res.status(201).json(category);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: 'Erro de validação', errors: error.issues });
    }
    if (error instanceof Error && error.message === 'Essa categoria já existe.') {
      return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// 2. LISTAR
export const listCategoriesController = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryService.listCategoriesService();
    return res.status(200).json(categories);
  } catch (error: unknown) {
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// 3. BUSCAR POR ID
export const getCategoryByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await CategoryService.getCategoryByIdService(id);
    return res.status(200).json(category);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Categoria não encontrada.') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// 4. ATUALIZAR
export const updateCategoryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateCategorySchema.parse(req.body);
    const category = await CategoryService.updateCategoryService(id, validatedData);
    return res.status(200).json(category);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: 'Erro de validação', errors: error.issues });
    }
    if (error instanceof Error && error.message === 'Categoria não encontrada.') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// 5. DELETAR
export const deleteCategoryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await CategoryService.deleteCategoryService(id);
    return res.status(204).send(); // 204 No Content (sucesso sem corpo)
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Categoria não encontrada.') {
      return res.status(404).json({ message: error.message });
    }
    // TODO: Capturar erro se a categoria estiver em uso (Foreign Key violation)
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
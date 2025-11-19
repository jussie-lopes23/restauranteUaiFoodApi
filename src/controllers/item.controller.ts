import { Request, Response } from 'express';
import * as ItemService from '../services/item.service';
import { ZodError } from 'zod';
import { createItemSchema, updateItemSchema } from '../schemas/item.schema';


const handleError = (error: unknown, res: Response) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: 'Erro de validação', errors: error.issues });
  }
  if (error instanceof Error) {
    if (error.message === 'Categoria não encontrada.') {
      return res.status(400).json({ message: error.message }); 
    }
    if (error.message === 'Item não encontrado.') {
      return res.status(404).json({ message: error.message });
    }
  }
  return res.status(500).json({ message: 'Erro interno do servidor.' });
};

//CRIAR
export const createItemController = async (req: Request, res: Response) => {
  try {
    const validatedData = createItemSchema.parse(req.body);
    const item = await ItemService.createItemService(validatedData);
    return res.status(201).json(item);
  } catch (error: unknown) {
    return handleError(error, res);
  }
};

//LISTAR
export const listItemsController = async (req: Request, res: Response) => {
  try {
    const items = await ItemService.listItemsService();
    return res.status(200).json(items);
  } catch (error: unknown) {
    return handleError(error, res);
  }
};

//BUSCAR POR ID
export const getItemByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await ItemService.getItemByIdService(id);
    return res.status(200).json(item);
  } catch (error: unknown) {
    return handleError(error, res);
  }
};

//ATUALIZAR
export const updateItemController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateItemSchema.parse(req.body);
    const item = await ItemService.updateItemService(id, validatedData);
    return res.status(200).json(item);
  } catch (error: unknown) {
    return handleError(error, res);
  }
};

//DELETAR
export const deleteItemController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ItemService.deleteItemService(id);
    return res.status(204).send();
  } catch (error: unknown) {
    return handleError(error, res);
  }
};
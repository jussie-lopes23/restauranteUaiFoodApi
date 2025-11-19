import { Request, Response } from 'express';
import * as OrderService from '../services/order.service';
import { ZodError } from 'zod';
import { createOrderSchema, updateOrderStatusSchema } from '../schemas/order.schema';

// // Tratador de erros
// const handleError = (error: unknown, res: Response) => {
//   if (error instanceof ZodError) {
//     return res.status(400).json({ message: 'Erro de validação', errors: error.issues });
//   }
//   if (error instanceof Error) {
//     if (error.message.includes('não encontrado')) {
//       return res.status(404).json({ message: error.message });
//     }
//     if (error.message.includes('Acesso não autorizado')) {
//       return res.status(403).json({ message: error.message });
//     }
//     if (error.message.includes('Um ou mais itens não foram encontrados')) {
//       return res.status(400).json({ message: error.message });
//     }
//   }
//   return res.status(500).json({ message: 'Erro interno do servidor.' });
// };

// src/controllers/order.controller.ts

const handleError = (error: unknown, res: Response) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: 'Erro de validação', errors: error.issues });
  }
  
  if (error instanceof Error) {
    
    console.error('ERRO DETALHADO:', error.message); 
    
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('Acesso não autorizado') || error.message.includes('pertence')) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message.includes('Um ou mais itens')) {
      return res.status(400).json({ message: error.message });
    }
  }

  console.error('Erro inesperado (Stack):', error); 

  
  return res.status(500).json({ 
    message: `Erro interno: ${error instanceof Error ? error.message : 'Desconhecido'}` 
  });
};

// 1. CRIAR
export const createOrderController = async (req: Request, res: Response) => {
  try {
    const validatedData = createOrderSchema.parse(req.body);
  
    const user = req.user!; 
    const order = await OrderService.createOrderService(validatedData, user);
    return res.status(201).json(order);
  } catch (error: unknown) {
    return handleError(error, res);
  }
};

// 2. LISTAR
export const listOrdersController = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const orders = await OrderService.listOrdersService(user);
    return res.status(200).json(orders);
  } catch (error: unknown) {
    return handleError(error, res);
  }
};

// 3. BUSCAR POR ID
export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const order = await OrderService.getOrderByIdService(id, user);
    return res.status(200).json(order);
  } catch (error: unknown) {
    return handleError(error, res);
  }
};

// 4. ATUALIZAR STATUS (Admin)
export const updateOrderStatusController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateOrderStatusSchema.parse(req.body);
    const order = await OrderService.updateOrderStatusService(id, validatedData.status);
    return res.status(200).json(order);
  } catch (error: unknown) {
    return handleError(error, res);
  }
};
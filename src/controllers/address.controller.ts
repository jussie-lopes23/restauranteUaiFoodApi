import { Request, Response } from 'express';
import * as AddressService from '../services/address.service';
import { ZodError } from 'zod';
import { createAddressSchema, updateAddressSchema } from '../schemas/address.schema';

// Tratador de erros
const handleError = (error: unknown, res: Response) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: 'Erro de validação', errors: error.issues });
  }
  if (error instanceof Error) {
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({ message: error.message });
    }
  }
  return res.status(500).json({ message: 'Erro interno do servidor.' });
};

//CRIAR
export const createAddressController = async (req: Request, res: Response) => {
  try {
    const validatedData = createAddressSchema.parse(req.body);
    const userId = req.user!.id; // Pega o usuário do token
    
    const address = await AddressService.createAddressService(validatedData, userId);
    return res.status(201).json(address);
  } catch (error: unknown) {
    return handleError(error, res);
  }
};

//LISTAR
export const listAddressesController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const addresses = await AddressService.listAddressesByUserService(userId);
    return res.status(200).json(addresses);
  } catch (error: unknown) {
    return handleError(error, res);
  }
};

//BUSCAR POR ID
export const getAddressByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const userId = req.user!.id;
    const address = await AddressService.getAddressByIdService(id, userId);
    return res.status(200).json(address);
  } catch (error: unknown) {
    return handleError(error, res);
  }
};

//ATUALIZAR
export const updateAddressController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const userId = req.user!.id;
    const validatedData = updateAddressSchema.parse(req.body);

    const address = await AddressService.updateAddressService(id, userId, validatedData);
    return res.status(200).json(address);
  } catch (error: unknown) {
    return handleError(error, res);
  }
};

//DELETAR
export const deleteAddressController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // ID do endereço
    const userId = req.user!.id;
    
    await AddressService.deleteAddressService(id, userId);
    return res.status(204).send(); // Sucesso sem conteúdo
  } catch (error: unknown) {
    return handleError(error, res);
  }
};
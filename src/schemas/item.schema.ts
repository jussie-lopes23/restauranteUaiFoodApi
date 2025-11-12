import { z } from 'zod';

// Schema base para o item
export const itemSchema = z.object({
  description: z.string().trim().min(3, {
    message: 'A descrição precisa ter no mínimo 3 caracteres.',
  }),
  
  // Zod converte a string (que vem do JSON) para um número
  // e depois valida se é positivo
  unitPrice: z.coerce.number().positive({
    message: 'O preço unitário deve ser um número positivo.',
  }),

  // O ID da categoria à qual o item pertence
  categoryId: z.string().cuid({
    message: 'O ID da categoria é inválido.',
  }),
});

// Schema para CRIAR (todos os campos obrigatórios)
export const createItemSchema = itemSchema;
export type CreateItemInput = z.infer<typeof createItemSchema>;

// Schema para ATUALIZAR (todos os campos opcionais)
export const updateItemSchema = itemSchema.partial();
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
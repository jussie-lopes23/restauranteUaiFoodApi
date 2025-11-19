import { z } from 'zod';

// Schema para criar descrição é obrigatória
export const createCategorySchema = z.object({
  description: z.string().trim().min(2, {
    message: 'A descrição precisa ter no mínimo 2 caracteres.',
  }),
});
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

// Schema para atualizar descrição é opcional
export const updateCategorySchema = createCategorySchema.partial();
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
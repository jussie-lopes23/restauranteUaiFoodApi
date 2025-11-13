import { z } from 'zod';

// Schema base com todos os campos de endereço
export const addressSchema = z.object({
  street: z.string().trim().min(3, {
    message: 'A rua precisa ter no mínimo 3 caracteres.',
  }),
  number: z.string().trim().min(1, {
    message: 'O número é obrigatório.',
  }),
  district: z.string().trim().min(3, {
    message: 'O bairro precisa ter no mínimo 3 caracteres.',
  }),
  city: z.string().trim().min(3, {
    message: 'A cidade precisa ter no mínimo 3 caracteres.',
  }),
  state: z.string().trim().min(2, {
    message: 'O estado precisa ter 2 caracteres (UF).',
  }).max(2, {
    message: 'O estado precisa ter 2 caracteres (UF).',
  }),
  zipCode: z.string().trim().length(8, {
    message: 'O CEP deve ter 8 caracteres (apenas números).',
  }),
});

// Schema para CRIAR (todos os campos obrigatórios)
export const createAddressSchema = addressSchema;
export type CreateAddressInput = z.infer<typeof createAddressSchema>;

// Schema para ATUALIZAR (todos os campos opcionais)
export const updateAddressSchema = addressSchema.partial();
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
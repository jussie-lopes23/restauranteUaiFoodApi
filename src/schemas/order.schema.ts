import { z } from 'zod';
import { PaymentMethod } from '@prisma/client';

//Define o schema para um item dentro do pedido
const orderItemSchema = z.object({
  itemId: z.string().cuid({
    message: 'ID do item inválido.',
  }),
  quantity: z.coerce.number().int().positive({
    message: 'A quantidade deve ser um número inteiro positivo.',
  }),
});

//Define o schema para criar um novo pedido
export const createOrderSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod, {
    message: 'Método de pagamento inválido.',
  }),

  addressId: z.string().cuid({ message: 'ID do endereço inválido.' }),
  
  items: z.array(orderItemSchema).min(1, {
    message: 'O pedido precisa ter pelo menos um item.',
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

//Schema para atualizar o STATUS (Admin)
export const updateOrderStatusSchema = z.object({
  status: z.string().trim().min(3, {
    message: 'O status é obrigatório.',
  }),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
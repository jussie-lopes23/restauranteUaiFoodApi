import { z } from 'zod';
import { PaymentMethod } from '@prisma/client'; // Importa o Enum do Prisma

// 1. Define o schema para UM item dentro do pedido
const orderItemSchema = z.object({
  itemId: z.string().cuid({
    message: 'ID do item inválido.',
  }),
  quantity: z.coerce.number().int().positive({
    message: 'A quantidade deve ser um número inteiro positivo.',
  }),
});

// 2. Define o schema para o pedido principal
export const createOrderSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod, {
    message: 'Método de pagamento inválido.',
  }),

  addressId: z.string().cuid({ message: 'ID do endereço inválido.' }),
  
  // O status não virá do cliente, será definido no backend (ex: 'PENDING')
  // O clientId e createdById virão do token do usuário logado

  // O pedido DEVE conter um array de 'items', e deve ter pelo menos 1 item.
  items: z.array(orderItemSchema).min(1, {
    message: 'O pedido precisa ter pelo menos um item.',
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// 3. Schema para atualizar o STATUS (Admin)
export const updateOrderStatusSchema = z.object({
  status: z.string().trim().min(3, {
    message: 'O status é obrigatório.',
  }),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
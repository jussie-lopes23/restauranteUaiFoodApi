import { z } from 'zod';
import {UserType} from "@prisma/client"



// 2. Schema para criar um novo usuário
export const createUserSchema = z.object({
  // Usaremos .trim() para remover espaços em branco antes e depois
  name: z.string().trim().min(3, {
    message: 'O nome precisa ter no mínimo 3 caracteres.',
  }),

  email: z.string().trim().email({
    message: 'Por favor, insira um e-mail válido.',
  }),

  password: z.string().min(6, {
    message: 'A senha precisa ter no mínimo 6 caracteres.',
  }),

  phone: z.string().trim().min(10, {
    message: 'O telefone precisa ter no mínimo 10 dígitos (DDD + número).',
  }),

  // O tipo (ADMIN/CLIENT) não deve vir do front-end no cadastro
  // Vamos definir 'type' no 'service' como 'CLIENT' por padrão.
  // Se quiséssemos validar, poderíamos adicionar:
  // type: z.nativeEnum(UserType).optional()
});

// 3. Inferindo o TIPO TypeScript a partir do Schema
export type CreateUserInput = z.infer<typeof createUserSchema>;

// 4. (Opcional) Schema para o Login
export const loginUserSchema = z.object({
  email: z.string().trim().email({ message: 'E-mail ou senha inválidos.' }),
  password: z.string().min(1, { message: 'E-mail ou senha inválidos.' }),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().trim().min(3, {
    message: 'O nome precisa ter no mínimo 3 caracteres.',
  }).optional(), // 'optional()' permite que o campo não seja enviado

  phone: z.string().trim().min(10, {
    message: 'O telefone precisa ter no mínimo 10 dígitos.',
  }).optional(),
}).partial(); // '.partial()' torna todos os campos opcionais

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
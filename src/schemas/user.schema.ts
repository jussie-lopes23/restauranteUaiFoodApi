import { z } from 'zod';
import {UserType} from "@prisma/client"

//Schema para criar um novo usuário
export const createUserSchema = z.object({
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

  acceptsTerms: z.literal(true, {
    message: 'Você deve aceitar os termos de privacidade.',
  }),

});


export type CreateUserInput = z.infer<typeof createUserSchema>;


export const loginUserSchema = z.object({
  email: z.string().trim().email({ message: 'E-mail ou senha inválidos.' }),
  password: z.string().min(1, { message: 'E-mail ou senha inválidos.' }),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().trim().min(3, {
    message: 'O nome precisa ter no mínimo 3 caracteres.',
  }).optional(),

  phone: z.string().trim().min(10, {
    message: 'O telefone precisa ter no mínimo 10 dígitos.',
  }).optional(),
}).partial(); 

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, {
    message: 'A senha antiga é obrigatória.',
  }),
  newPassword: z.string().min(6, {
    message: 'A nova senha precisa ter no mínimo 6 caracteres.',
  }),
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;


  export const adminUpdateUserSchema = z.object({
  name: z.string().trim().min(3).optional(),
  type: z.nativeEnum(UserType).optional(),
 }).partial();

// 7. Schema para ADMIN ATUALIZAR um usuário
// export const adminUpdateUserSchema = z.object({
//   name: z.string().trim().min(3).optional(),
//   phone: z.string().trim().min(10).optional(),
//   // Use z.enum com strings literais para evitar problemas de conversão
//   type: z.enum(['CLIENT', 'ADMIN']).optional(), 
// });

export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;
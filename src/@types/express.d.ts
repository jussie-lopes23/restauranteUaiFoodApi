import { UserType } from '@prisma/client'; // 1. IMPORTE O ENUM

// 1. Define o tipo do nosso usuário (que vem do payload do token)
interface UserPayload {
  id: string;
  name: string;
  type: UserType; // 2. MUDE DE 'string' PARA 'UserType'
}

// 2. Sobrescreve o módulo 'express-serve-static-core'
declare module 'express-serve-static-core' {
  // 3. Adiciona a propriedade 'user' na interface 'Request'
  interface Request {
    user?: UserPayload;
  }
}

// É necessário este 'export {}' para o TypeScript
// entender este arquivo como um módulo.
export {};
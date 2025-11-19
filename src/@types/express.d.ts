import { UserType } from '@prisma/client';

interface UserPayload {
  id: string;
  name: string;
  type: UserType; 
}

declare module 'express-serve-static-core' {

  interface Request {
    user?: UserPayload;
  }
}

export {};
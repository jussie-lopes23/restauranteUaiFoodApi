import { Request, Response, NextFunction } from 'express';
import { UserType } from '@prisma/client';


//Middleware para verificar se o usuário é ADMIN.
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Não autorizado.' });
  }

  if (user.type !== UserType.ADMIN) {
    return res.status(403).json({ message: 'Acesso negado. Requer privilégios de administrador.' });
  }

  return next();
};
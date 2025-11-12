import { Request, Response, NextFunction } from 'express';
import { UserType } from '@prisma/client';

/**
 * Middleware para verificar se o usuário é ADMIN.
 * Deve ser usado SOMENTE APÓS o authMiddleware.
 */
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Pega o usuário da requisição (anexado pelo authMiddleware)
  const user = req.user;

  if (!user) {
    // Isso é uma segurança extra, caso o authMiddleware falhe
    return res.status(401).json({ message: 'Não autorizado.' });
  }

  // Verifica se o tipo do usuário é ADMIN
  if (user.type !== UserType.ADMIN) {
    // 403 Forbidden - O usuário está autenticado, mas não tem permissão
    return res.status(403).json({ message: 'Acesso negado. Requer privilégios de administrador.' });
  }

  // Se for ADMIN, permite que a requisição continue
  return next();
};
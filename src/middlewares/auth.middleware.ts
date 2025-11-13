import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

// Vamos definir uma interface para o payload do nosso token
interface TokenPayload {
  sub: string; // ID do usuário
  name: string;
  type: string;
  // iat e exp são adicionados automaticamente pelo jwt
  iat: number;
  exp: number;
}

/**
 * Middleware para verificar a autenticação JWT.
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Pega o header 'authorization'
  const { authorization } = req.headers;

  // 2. Verifica se o header foi enviado
  if (!authorization) {
    // 401 Unauthorized - O token não foi enviado
    return res.status(401).json({ message: 'Token de autenticação não enviado.' });
  }

  // 3. Separa o "Bearer" do token
  // O formato é "Bearer eyJhbGciOi..."
  const parts = authorization.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    // 401 Unauthorized - Formato inválido
    return res.status(401).json({ message: 'Token em formato inválido.' });
  }

  const token = parts[1];

  // 4. Valida o token
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('A chave secreta JWT não está configurada.');
    }

    // Tenta verificar o token com o segredo
    const payload = jwt.verify(token, secret) as TokenPayload;

    let userType: UserType;
    if (payload.type === 'ADMIN') {
      userType = UserType.ADMIN;
    } else if (payload.type === 'CLIENT') {
      userType = UserType.CLIENT;
    } else {
      // Se o token tiver um tipo inválido
      return res.status(401).json({ message: 'Tipo de usuário inválido no token.' });
    }

    // 5. Se for válido, anexa os dados do usuário na requisição
    // (Vamos corrigir o erro do TypeScript no próximo passo)
  
    req.user = {
      id: payload.sub,
      name: payload.name,
      type: payload.type,
    };

    // Chama a próxima função (o controller)
    return next();

  } catch (error) {
    // 401 Unauthorized - Token inválido ou expirado
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};
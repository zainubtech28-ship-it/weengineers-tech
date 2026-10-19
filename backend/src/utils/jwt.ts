import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  role: 'founder' | 'admin';
}

export const signToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET || 'weengineers_secret_fallback_key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET || 'weengineers_secret_fallback_key';
  return jwt.verify(token, secret) as TokenPayload;
};

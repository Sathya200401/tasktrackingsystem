import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { env } from '../config/env';

interface TokenPayload extends jwt.JwtPayload {
  userId: string;
  role: 'admin' | 'viewer';
  name: string;
  email: string;
}

export const generateToken = (payload: TokenPayload) => {
  const numericExpiry = Number(env.tokenExpiresIn);
  const expiresIn: StringValue | number = Number.isNaN(numericExpiry)
    ? (env.tokenExpiresIn as StringValue)
    : numericExpiry;
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, env.jwtSecret as Secret, options);
};


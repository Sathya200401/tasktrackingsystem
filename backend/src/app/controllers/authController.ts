import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';
import { generateToken } from '../../utils/generateToken';

const ADMIN_EMAIL = 'admin@nexus.io';
const ADMIN_PASSWORD = 'aimadmin@123';

const buildResponse = (user: { id: string; name: string; email: string; role: 'admin' | 'viewer' }) => {
  const token = generateToken({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  });

  return {
    success: true,
    data: {
      user,
      token,
    },
  };
};

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing || email === ADMIN_EMAIL) {
    throw new ApiError(409, 'Account already exists. Please log in.');
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role: 'viewer' });

  res.status(201).json(
    buildResponse({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    })
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL) {
    if (password !== ADMIN_PASSWORD) {
      throw new ApiError(401, 'Invalid credentials');
    }
    res.json(
      buildResponse({
        id: 'admin',
        name: 'TaskOps Admin',
        email,
        role: 'admin',
      })
    );
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  res.json(
    buildResponse({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: 'viewer',
    })
  );
});


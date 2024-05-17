import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import handleAsync from '../utils/handleAsync';
import { User } from '@prisma/client';
import { UserService } from '../services/userService';

const userService = container.resolve(UserService);

interface RequestWithUser extends Request {
  user?: User;
}

export const validateLogin = handleAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const jwtAccessToken = req?.headers?.authorization?.split(' ')?.[1];
    if (jwtAccessToken) {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return next(new AppError(500, 'Internal Server Error'));
      }
      try {
        const decoded = jwt.verify(jwtAccessToken, secret);
        if (typeof decoded === 'object' && 'email' in decoded) {
          const user = await userService.getByEmail(decoded.email);
          if (user) req.user = user;
          else return next(new AppError(404, 'User not found'));
        }
      } catch (error) {
        return next(new AppError(400, `Invalid JWT`));
      }
    } else {
      return next(new AppError(401, `Unauthorized`));
    }
    next();
  },
);

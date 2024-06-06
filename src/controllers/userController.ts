import express, { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import { User } from '@prisma/client';
import { UserService } from '../services/userService';
import { AppError } from '../utils/AppError';
import handleAsync from '../utils/handleAsync';
import reactionRouter from './reactionController';
import commentRouter from './commentController';
import { validateLogin } from '../middlewares/validateLogin';

const router = express.Router();
const userService = container.resolve(UserService);

interface RequestWithUser extends Request {
  user?: User;
}

// route middleware
router.use('/:userId/reactions', reactionRouter);
router.use('/:userId/comments', commentRouter);

router.get(
  '/',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    const queries = req.query;
    const users = await userService.getAll(queries);

    if (!users.length) return next(new AppError(404, `No users found.`));

    res.status(200).json({
      results: users.length,
      data: {
        users,
      },
    });
  }),
);

router.get(
  '/:id',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.getById(Number(req.params.id));
    if (!user) return next(new AppError(404, `User not found.`));
    res.status(200).json({
      data: {
        user,
      },
    });
  }),
);

router.post(
  '/',
  handleAsync(async (req: Request, res: Response) => {
    const newUser = await userService.create(req.body);
    res.status(201).json({
      data: {
        newUser,
      },
    });
  }),
);

router.put(
  '/',
  validateLogin,
  handleAsync(
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
      const userId = req?.user?.id;
      if (!userId) return next(new AppError(400, `UserId not present`));
      const updatedUser = await userService.update(userId, req.body);

      res.status(200).json({
        data: {
          updatedUser,
        },
      });
    },
  ),
);

router.delete(
  '/',
  validateLogin,
  handleAsync(
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
      const userId = req?.user?.id;
      if (!userId) return next(new AppError(400, `UserId not present`));
      const deleted = await userService.delete(Number(req.params.id));

      res.status(204).json({
        data: {
          deleted,
        },
      });
    },
  ),
);

export default router;

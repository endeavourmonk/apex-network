import express, { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { UserService } from '../services/userService';
import handleAsync from '../utils/handleAsync';
import { AppError } from '../utils/error';

const router = express.Router();
const userService = container.resolve(UserService);

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
    res.json(newUser);
  }),
);

router.put(
  '/:id',
  handleAsync(async (req: Request, res: Response) => {
    const updatedUser = await userService.update(
      Number(req.params.id),
      req.body,
    );
    res.json(updatedUser);
  }),
);

router.delete(
  '/:id',
  handleAsync(async (req: Request, res: Response) => {
    const deleted = await userService.delete(Number(req.params.id));
    res.json({ deleted });
  }),
);

export default router;

import express, { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import handleAsync from '../utils/handleAsync';
import { AppError } from '../utils/error';
import { CommentService } from '../services/commentService';
import { validateLogin } from '../middlewares/validateLogin';
import { User } from '@prisma/client';

const router = express.Router({ mergeParams: true });

const commentService = container.resolve(CommentService);

interface RequestWithUser extends Request {
  user?: User;
}

router.get(
  '/',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    const queryObject = req.query;
    const comments = await commentService.getAll(queryObject);
    if (!comments) return next(new AppError(404, `Reactions not found`));
    res.status(200).json({
      results: comments.length,
      data: {
        comments,
      },
    });
  }),
);

// just to clean the table leave it as

// router.delete('/deleteAll', async (req: Request, res: Response) => {
//   try {
//     console.log('delete');
//     const prisma = new PrismaClient();
//     await prisma.reaction.deleteMany({
//       where: {},
//     });
//     res.status(200).send('All reactions deleted successfully');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('An error occurred while deleting reactions');
//   }
// });

export default router;

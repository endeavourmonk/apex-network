import express, { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { fromError } from 'zod-validation-error';
import { z } from 'zod';

import handleAsync from '../utils/handleAsync';
import { Comment, User } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { CommentService } from '../services/commentService';
import { validateLogin } from '../middlewares/validateLogin';
import reactionRouter from './reactionController';

// route middleware
const router = express.Router({ mergeParams: true });
router.use('/:commentId/reactions', reactionRouter);

const commentService = container.resolve(CommentService);

interface RequestWithUser extends Request {
  user?: User;
}

/* Routes will be like:
 * /posts/:postId/comments
 * /users/:userId/reactions
 */

router.get(
  '/',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    // PENDING: add more filtering and sorting
    // const queryObject = req.query;

    const filters = {
      postId: req.params?.postId && parseInt(req.params.postId),
      authorId: req.params?.userId && parseInt(req.params.userId),
      parentId: req?.query?.parentId ? Number(req?.query?.parentId) : null,
    };
    console.log('filter: ', filters);
    const ReactionFilterSchema = z.object({
      postId: z.number().optional(),
      authorId: z.number().optional(),
      parentId: z.number().optional().nullable(),
    });

    const validatedFilters = ReactionFilterSchema.safeParse(filters);
    if (!validatedFilters.success) {
      const validationError = fromError(validatedFilters.error);
      return next(
        new AppError(400, `Invalid filter parameters: ${validationError}`),
      );
    }

    const comments = await commentService.getAll(filters);
    if (!comments) return next(new AppError(404, `Comments not found`));
    res.status(200).json({
      results: comments.length,
      data: {
        comments,
      },
    });
  }),
);

router.get(
  '/:id',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    const comment = await commentService.getById(Number(req.params.id));
    if (!comment) return next(new AppError(404, `Comment not found`));
    res.status(200).json({
      data: {
        comment,
      },
    });
  }),
);

router.post(
  '/',
  validateLogin,
  handleAsync(
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
      const authorId = req.user?.id;
      // Validate request data
      const CommentCreateSchema = z.object({
        postId: z.number(),
        authorId: z.number(),
        parentId: z.number().optional().nullable(),
        commentText: z.string().max(5000),
      });

      const validatedData = CommentCreateSchema.safeParse({
        postId: Number(req.params?.postId),
        authorId: Number(authorId),
        parentId: req?.body?.parentId ? Number(req.body.parentId) : null, // Optional field
        commentText: req?.body?.commentText,
      });

      // console.log('validatedData: ', validatedData);
      if (!validatedData.success) {
        const validationError = fromError(validatedData.error);
        return next(new AppError(400, `Invalid data: ${validationError}`));
      }

      const commentData = validatedData.data;

      const [newComment, commentCount] =
        await commentService.createCommentAndIncrementCount(
          commentData as Comment,
        );
      res.status(201).json({
        data: {
          newComment,
          commentCount,
        },
      });
    },
  ),
);

router.put(
  '/:id',
  validateLogin,
  handleAsync(
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
      const commentId = Number(req?.params?.id);
      const authorId = req.user?.id;

      // Validate request data
      const CommentUpdateSchema = z.object({
        commentText: z.string().max(5000),
      });

      const validatedData = CommentUpdateSchema.safeParse({
        commentText: req?.body?.commentText,
      });

      console.log('validatedData: ', validatedData);
      if (!validatedData.success) {
        const validationError = fromError(validatedData.error);
        return next(new AppError(400, `Invalid data: ${validationError}`));
      }

      const commentData = validatedData.data;
      const updatedComment = await commentService.update(
        commentId,
        authorId!,
        commentData as Comment,
      );

      res.status(200).json({
        data: {
          updatedComment,
        },
      });
    },
  ),
);

router.delete(
  '/:id',
  validateLogin,
  handleAsync(async (req: RequestWithUser, res: Response) => {
    const commentId = Number(req?.params?.id);
    const postId = Number(req?.params?.postId);
    const authorId = req.user?.id;
    await commentService.deleteCommentAndDecrementCount(
      commentId,
      postId,
      authorId!,
    );
    res.status(204).end();
  }),
);

// just to clean the table leave it as

// router.delete('/deleteAll', async (req: Request, res: Response) => {
//   try {
//     console.log('delete');
//     const prisma = new PrismaClient();
//     await prisma.comment.deleteMany({
//       where: {},
//     });
//     res.status(200).send('All reactions deleted successfully');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('An error occurred while deleting reactions');
//   }
// });

export default router;

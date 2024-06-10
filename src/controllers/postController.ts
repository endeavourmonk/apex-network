import express, { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import handleAsync from '../utils/handleAsync';
import { AppError } from '../utils/AppError';
import { validateLogin } from '../middlewares/validateLogin';
import { User } from '@prisma/client';
import { PostService } from '../services/postService';
import reactionRouter from './reactionController';
import commentRouter from './commentController';

const router = express.Router();

const postService = container.resolve(PostService);

interface RequestWithUser extends Request {
  user?: User;
}

// route middleware
router.use('/:postId/reactions', reactionRouter);
router.use('/:postId/comments', commentRouter);

router.get(
  '/',
  validateLogin,
  handleAsync(
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
      const queries = req.query;
      const posts = await postService.getAll(queries);
      if (!posts) return next(new AppError(404, `Posts not found`));
      console.log(req.user);

      res.status(200).json({
        results: posts.length,
        data: {
          posts,
        },
      });
    },
  ),
);

router.get(
  '/:id',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    const post = await postService.getById(Number(req.params.id));
    if (!post) return next(new AppError(404, `Post not found`));
    res.status(200).json({
      data: {
        post,
      },
    });
  }),
);

router.post(
  '/',
  validateLogin,
  handleAsync(async (req: RequestWithUser, res: Response) => {
    req.body.authorId = req.user?.id;
    const newPost = await postService.create(req.body);
    res.status(201).json({
      data: {
        newPost,
      },
    });
  }),
);

router.put(
  '/:id',
  validateLogin,
  handleAsync(
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
      const postId = Number(req?.params?.id);
      const authorId = req.user?.id;
      if (!authorId) return next(new AppError(400, `authorId not found.`));
      const updatedPost = await postService.update(postId, authorId, req?.body);

      res.status(200).json({
        data: {
          updatedPost,
        },
      });
    },
  ),
);

router.delete(
  '/:id',
  validateLogin,
  handleAsync(
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
      const postId = Number(req?.params?.id);
      const authorId = req.user?.id;
      if (!authorId) return next(new AppError(400, `authorId not found.`));
      await postService.delete(postId, authorId);
      res.status(204).end();
    },
  ),
);

export default router;

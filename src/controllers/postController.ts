import express, { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { PostService } from '../services/postService';
import handleAsync from '../utils/handleAsync';
import { AppError } from '../utils/error';

import { ReactionService } from '../services/reactionService';
import { validateLogin } from '../middlewares/validateLogin';
import { User } from '@prisma/client';

const router = express.Router();
const postService = container.resolve(PostService);
const reactionService = container.resolve(ReactionService);
interface RequestWithUser extends Request {
  user?: User;
}

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
  handleAsync(async (req: Request, res: Response) => {
    console.log(req.body);
    const updatedPost = await postService.update(
      Number(req.params.id),
      req.body,
    );
    res.status(200).json({
      data: {
        updatedPost,
      },
    });
  }),
);

router.delete(
  '/:id',
  handleAsync(async (req: Request, res: Response) => {
    await postService.delete(Number(req.params.id));
    res.status(204).end();
  }),
);

// Reactions
router.get(
  '/:postId/reactions',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    const reactions = await reactionService.getAll(Number(req.params.postId));
    if (!reactions) return next(new AppError(404, `Post not found`));
    res.status(200).json({
      results: reactions.length,
      data: {
        reactions,
      },
    });
  }),
);

// Updating the reactionsCount in the Post table on creating of a reaction.
// router.post(
//   '/:postId/reactions',
//   handleAsync(async (req: Request, res: Response, next: NextFunction) => {
//     // const postId = req.params.postId;
//     // const userId = req.user.id;
//     const { postId, userId } = req.body;
//     if (!postId || !userId)
//       return next(new AppError(400, `Missing postId or userId`));

//     const newReaction = await reactionService.create(req.body);
//     req.body = { reactionCount: { increment: 1 } };
//     await postService.update(Number(postId), req.body);

//     res.status(201).json({
//       data: {
//         newReaction,
//       },
//     });
//   }),
// );

router.post(
  '/:postId/reactions',
  validateLogin,
  handleAsync(
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
      req.body.authorId = req.user?.id;
      const postId = req.params.postId;
      if (!req.body.postId) req.body.postId = Number(postId);

      if (!postId || !req.user?.id)
        return next(new AppError(400, `Missing postId or userId`));
      const isReactionCreated =
        await reactionService.createAndIncrementPostReactionCount(
          Number(postId),
          req.body,
        );
      if (!isReactionCreated)
        return next(new AppError(500, `Reaction not created`));

      res.status(201).json({
        message: `success`,
      });
    },
  ),
);

router.put(
  '/:postId/reactions/:reactionId',
  handleAsync(async (req: Request, res: Response) => {
    const updatedReaction = await reactionService.update(
      Number(req.params.reactionId),
      req.body,
    );

    res.status(200).json({
      data: {
        updatedReaction,
      },
    });
  }),
);

// Updating the reactionsCount in the Post table on deletion of a reaction.
router.delete(
  '/:postId/reactions/:reactionId',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { postId, reactionId } = req.params;
    const isReactionDeleted =
      await reactionService.deleteAndDecrementPostReactionCount(
        Number(reactionId),
        Number(postId),
      );

    if (!isReactionDeleted)
      return next(new AppError(500, `Reaction not deleted`));
    res.status(204).end();
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

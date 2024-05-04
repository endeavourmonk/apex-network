import express, { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { PostService } from '../services/postService';
import handleAsync from '../utils/handleAsync';
import { AppError } from '../utils/error';

import { ReactionService } from '../services/reactionService';

const router = express.Router();
const postService = container.resolve(PostService);
const reactionService = container.resolve(ReactionService);

router.get(
  '/',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    const queries = req.query;
    const posts = await postService.getAll(queries);
    if (!posts) return next(new AppError(404, `Posts not found`));

    res.status(200).json({
      results: posts.length,
      data: {
        posts,
      },
    });
  }),
);

router.get(
  '/:id',
  handleAsync(async (req: Request, res: Response) => {
    const post = await postService.getById(Number(req.params.id));
    if (!post) return new AppError(404, `Post not found`);
    res.status(200).json({
      data: {
        post,
      },
    });
  }),
);

router.post(
  '/',
  handleAsync(async (req: Request, res: Response) => {
    const newPost = await postService.create(req.body);
    res.status(200).json({
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
    const deleted = await postService.delete(Number(req.params.id));
    res.status(204).json({
      data: {
        deleted,
      },
    });
  }),
);

// Reactions
router.get(
  '/:postId/reactions',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    const reactions = await reactionService.getAll(Number(req.params.postId));
    if (!reactions) return next(new AppError(404, `Posts not found`));
    res.status(200).json({
      results: reactions.length,
      data: {
        reactions,
      },
    });
  }),
);

// Updating the reactionsCount in the Post table on creating and deletion of a reaction.
router.post(
  '/reactions',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { postId, userId } = req.body;
    if (!postId || !userId)
      return next(new AppError(400, `Missing postId or userId`));

    const newReaction = await reactionService.create(req.body);
    const reactionCount = (await reactionService.getAll(postId)).length;
    req.body = { reactionCount: reactionCount };
    await postService.update(Number(postId), req.body);

    res.status(201).json({
      data: {
        newReaction,
      },
    });
  }),
);

router.put(
  '/:postId/reactions/:reactionId',
  handleAsync(async (req: Request, res: Response) => {
    const updatedReaction = await reactionService.update(
      Number(req.params.id),
      req.body,
    );

    res.status(200).json({
      data: {
        updatedReaction,
      },
    });
  }),
);

router.delete(
  '/:postId/reactions/:reactionId',
  handleAsync(async (req: Request, res: Response) => {
    const { postId, reactionId } = req.params;
    const deleted = await reactionService.delete(Number(reactionId));
    const reactionCount = (await reactionService.getAll(Number(postId))).length;
    req.body = { reactionCount: reactionCount };
    await postService.update(Number(postId), req.body);
    res.status(204).json({
      data: {
        deleted,
      },
    });
  }),
);

export default router;

import express, { Request, Response, NextFunction } from 'express';
import { Reaction, User } from '@prisma/client';
import { container } from 'tsyringe';
import { fromError } from 'zod-validation-error';
import { z } from 'zod';

import handleAsync from '../utils/handleAsync';
import { AppError } from '../utils/AppError';
import { ReactionService } from '../services/reactionService';
import { validateLogin } from '../middlewares/validateLogin';

const router = express.Router({ mergeParams: true });

const reactionService = container.resolve(ReactionService);

interface RequestWithUser extends Request {
  user?: User;
}

/* Routes will be like:
 * /posts/:postId/reactions
 * /posts/:postId/comments/:commentId/reactions
 * /users/:userId/reactions
 */

// get all the reactions on a post or comment
router.get(
  '/',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filters = {
      postId: req.params?.commentId ? undefined : parseInt(req.params?.postId),
      commentId: req.params?.commentId && parseInt(req.params.commentId),
      authorId: req.params?.userId && parseInt(req.params.userId),
    };
    console.log({ filters });
    const ReactionFilterSchema = z.object({
      postId: z.number().optional(),
      commentId: z.number().optional(),
      authorId: z.number().optional(),
    });

    const validatedFilters = ReactionFilterSchema.safeParse(filters);
    if (!validatedFilters.success) {
      const validationError = fromError(validatedFilters.error);
      return next(
        new AppError(400, `Invalid filter parameters: ${validationError}`),
      );
    }

    const reactions = await reactionService.getAll(filters);

    if (!reactions || !reactions.length)
      return next(new AppError(404, `Reactions not found`));
    res.status(200).json({
      results: reactions.length,
      data: {
        reactions,
      },
    });
  }),
);

router.put(
  '/:reactionId',
  validateLogin,
  handleAsync(
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
      const authorId = req?.user?.id;
      const reactionId = parseInt(req.params.reactionId);

      const ReactionUpdateSchema = z.object({
        reaction: z.string(),
      });

      const validatedData = ReactionUpdateSchema.safeParse(req.body);
      if (!validatedData.success) {
        const validationError = fromError(validatedData.error);
        return next(
          new AppError(400, `Invalid update data: ${validationError}`),
        );
      }

      const updateData = validatedData.data;
      const updatedReaction = await reactionService.update(
        reactionId,
        authorId!,
        updateData as Reaction,
      );

      res.status(200).json({
        data: {
          updatedReaction,
        },
      });
    },
  ),
);

router.post(
  '/',
  validateLogin,
  handleAsync(
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
      const authorId = req.user?.id;
      const postId = Number(req.params.postId);
      const commentId = Number(req.params.commentId);

      const reactionData = {
        authorId,
        reaction: req.body.reaction,
        ...(commentId ? { commentId } : { postId }),
      };

      const ReactionCreateSchema = z
        .object({
          authorId: z.number(),
          reaction: z.string(),
          postId: z.number().optional(),
          commentId: z.number().optional(),
        })
        .refine((data) => data.postId || data.commentId, {
          message: 'At least one of postId or commentId must be present',
        });

      // console.log('reactiondata: ', reactionData);
      const validatedData = ReactionCreateSchema.safeParse(reactionData);
      if (!validatedData.success) {
        const validationError = fromError(validatedData.error);
        return next(new AppError(400, `Invalid data: ${validationError}`));
      }

      const reactionToCreate = validatedData.data;

      console.log('reactionToCreate', reactionToCreate);
      let createdData = [];
      reactionToCreate.commentId
        ? (createdData = await reactionService.addCommentReaction(
            reactionToCreate as Reaction,
          ))
        : (createdData = await reactionService.addPostReaction(
            reactionToCreate as Reaction,
          ));

      if (!createdData) return next(new AppError(500, `Reaction not created`));

      res.status(201).json({
        message: `success`,
        data: {
          reaction: createdData[0],
          reactionCount: createdData[1],
        },
      });
    },
  ),
);

router.delete(
  '/:reactionId',
  validateLogin,
  handleAsync(
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
      const authorId = req.user?.id;
      const postId = Number(req.params.postId);
      const commentId = Number(req.params.commentId);
      const reactionId = Number(req.params.reactionId);

      let isReactionDeleted = false;
      postId && commentId
        ? (isReactionDeleted = await reactionService.removeCommentReaction(
            reactionId,
            commentId,
            authorId!,
          ))
        : (isReactionDeleted = await reactionService.removePostReaction(
            reactionId,
            postId!,
            authorId!,
          ));

      if (!isReactionDeleted)
        return next(new AppError(500, `Reaction not deleted`));

      res.status(204).json({
        message: `success`,
      });
    },
  ),
);

export default router;

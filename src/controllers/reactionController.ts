import express, { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { z } from 'zod';

import handleAsync from '../utils/handleAsync';
import { AppError } from '../utils/AppError';
import { ReactionService } from '../services/reactionService';
import { validateLogin } from '../middlewares/validateLogin';
import { Reaction, User } from '@prisma/client';
import { fromError } from 'zod-validation-error';

const router = express.Router({ mergeParams: true });

const reactionService = container.resolve(ReactionService);

interface RequestWithUser extends Request {
  user?: User;
}

/* Routes will be like:
 * /posts/:postId/reactions
 * /posts/:posiId/comments/:commentId/reactions
 * /users/:userId/reactions
 */

// get all the reactions on a post or comment
router.get(
  '/',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filters = {
      postId:
        req.params?.postId &&
        !req.params.commentId &&
        parseInt(req.params.postId),
      commentId: req.params?.commentId && parseInt(req.params.commentId),
      authorId: req.params?.authorId && parseInt(req.params.authorId),
    };
    console.log(filters);
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
      if (!authorId) return next(new AppError(400, `authorId is required `));

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
        authorId,
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

      const reactionData = {
        authorId,
        reaction: req.body.reaction,
        ...(postId ? { postId } : { commentId }),
      };

      console.log('reactiondata: ', reactionData);
      const validatedData = ReactionCreateSchema.safeParse(reactionData);
      if (!validatedData.success) {
        const validationError = fromError(validatedData.error);
        return next(new AppError(400, `Invalid data: ${validationError}`));
      }

      const reactionToCreate = validatedData.data;
      let isReactionCreated = false;

      reactionToCreate.postId && reactionToCreate.commentId
        ? (isReactionCreated = await reactionService.addCommentReaction(
            reactionToCreate as Reaction,
          ))
        : (isReactionCreated = await reactionService.addPostReaction(
            reactionToCreate as Reaction,
          ));

      if (!isReactionCreated)
        return next(new AppError(500, `Reaction not created`));

      res.status(201).json({
        message: `success`,
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

      const ReactionDeleteSchema = z
        .object({
          authorId: z.number(),
          reactionId: z.number(),
          postId: z.number().optional(),
          commentId: z.number().optional(),
        })
        .refine((data) => data.postId || data.commentId, {
          message: 'At least one of postId or commentId must be present',
        });

      const reactionData = {
        authorId,
        reactionId,
        ...(postId ? { postId } : { commentId }),
      };

      console.log('reactionToDelete : ', reactionData);
      const validatedData = ReactionDeleteSchema.safeParse(reactionData);
      if (!validatedData.success) {
        const validationError = fromError(validatedData.error);
        return next(new AppError(400, `Invalid data: ${validationError}`));
      }

      const reactionToDelete = validatedData.data;
      let isReactionCreated = false;

      reactionToDelete.postId && reactionToDelete.commentId
        ? (isReactionCreated = await reactionService.removeCommentReaction(
            reactionToDelete.reactionId,
            reactionToDelete.commentId,
            reactionToDelete.authorId,
          ))
        : (isReactionCreated = await reactionService.removePostReaction(
            reactionToDelete.reactionId,
            reactionToDelete.postId!,
            reactionToDelete.authorId,
          ));

      if (!isReactionCreated)
        return next(new AppError(500, `Reaction not deleted`));

      res.status(204).json({
        message: `success`,
      });
    },
  ),
);

export default router;

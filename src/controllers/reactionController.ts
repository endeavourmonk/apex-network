import express, { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { z } from 'zod';

import handleAsync from '../utils/handleAsync';
import { AppError } from '../utils/error';
import { ReactionService } from '../services/reactionService';
import { validateLogin } from '../middlewares/validateLogin';
import { Reaction, User } from '@prisma/client';

const router = express.Router({ mergeParams: true });

const reactionService = container.resolve(ReactionService);

interface RequestWithUser extends Request {
  user?: User;
}

/* Routes will be like:
 * /posts/:postId/reactions
 * /users/:userId/reactions
 */

// get all the reactions on a post or comment
router.get(
  '/',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { params } = req;
    const filters = {
      postId: params.postId && parseInt(params.postId),
      authorId: params.authorId && parseInt(params.authorId),
    };

    const ReactionFilterSchema = z.object({
      postId: z.number().optional(),
      authorId: z.number().optional(),
    });

    const validatedFilters = ReactionFilterSchema.safeParse(filters);
    if (!validatedFilters.success)
      return next(new AppError(400, `Invalid filter parameters`));

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

      const validationResult = ReactionUpdateSchema.safeParse(req.body);
      if (!validationResult.success)
        return next(
          new AppError(
            400,
            `Invalid update data: ${validationResult.error.message}`,
          ),
        );

      const updateData = validationResult.data;
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
      if (!authorId || !req.body.reaction)
        return next(
          new AppError(400, 'Missing required data: authorId or reaction'),
        );

      const { params } = req;
      const { postId, commentId } = params;
      if (!postId && !commentId)
        return next(new AppError(400, `either postId or commentId required.`));

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

      console.log(reactionData);
      const validatedData = ReactionCreateSchema.safeParse(reactionData);
      if (!validatedData.success)
        return next(
          new AppError(
            400,
            `Invalid reaction data: ${validatedData.error.message}`,
          ),
        );

      const createData = validatedData.data;

      let isReactionCreated = false;
      if (createData.postId) {
        isReactionCreated = await reactionService.addPostReaction(
          createData as Reaction,
        );
      } else if (createData.commentId) {
        isReactionCreated = await reactionService.addCommentReaction(
          createData as Reaction,
        );
      }

      if (!isReactionCreated)
        return next(new AppError(500, `Reaction not created`));

      res.status(201).json({
        message: `success`,
      });
    },
  ),
);

// Updating the reactionsCount in the Post table on deletion of a reaction.
// router.delete(
//   '/:reactionId',
//   handleAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const { postId, reactionId } = req.params;
//     const isReactionDeleted =
//       await reactionService.deleteAndDecrementPostReactionCount(
//         Number(reactionId),
//         Number(postId),
//       );

//     if (!isReactionDeleted)
//       return next(new AppError(500, `Reaction not deleted`));
//     res.status(204).end();
//   }),
// );

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

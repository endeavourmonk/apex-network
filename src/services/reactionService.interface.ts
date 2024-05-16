import { Reaction } from '@prisma/client';

export interface IReactionService {
  getAll(postId?: number, userId?: number): Promise<Reaction[]>;
  create(data: Reaction): Promise<Reaction>;
  update(id: number, data: Reaction): Promise<Reaction | null>;
  delete(id: number): Promise<Reaction>;
  createAndIncrementPostReactionCount(
    postId: number,
    data: Reaction,
  ): Promise<boolean>;
  deleteAndDecrementPostReactionCount(
    reactionId: number,
    postId: number,
  ): Promise<boolean>;
}

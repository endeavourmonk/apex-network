import { Reaction } from '@prisma/client';

export interface IReactionService {
  getAll(filters?: { [key: string]: unknown }): Promise<Reaction[]>;

  update(
    id: number,
    authorId: number,
    data: Reaction,
  ): Promise<Reaction | null>;

  addPostReaction(data: Reaction): Promise<boolean>;
  removePostReaction(
    reactionId: number,
    postId: number,
    authorId: number,
  ): Promise<boolean>;

  addCommentReaction(data: Reaction): Promise<boolean>;
  removeCommentReaction(
    reactionId: number,
    commentId: number,
    authorId: number,
  ): Promise<boolean>;
}

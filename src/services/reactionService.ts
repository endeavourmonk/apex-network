import { Reaction } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { ReactionRepository } from '../repositories/reactionRepository.interface';
import { IReactionService } from '../services/reactionService.interface';

@injectable()
export class ReactionService implements IReactionService {
  constructor(
    @inject('ReactionRepository')
    private reactionRepository: ReactionRepository,
  ) {}

  getAll(filters?: { [key: string]: unknown }): Promise<Reaction[]> {
    const whereClause: { [key: string]: unknown } = {};
    if (filters?.postId) whereClause.postId = filters.postId;
    if (filters?.authorId) whereClause.authorId = filters.authorId;

    return this.reactionRepository.getAll();
  }

  update(
    id: number,
    authorId: number,
    data: Reaction,
  ): Promise<Reaction | null> {
    return this.reactionRepository.update(id, authorId, data);
  }

  addPostReaction(data: Reaction): Promise<boolean> {
    return this.reactionRepository.addPostReaction(data);
  }

  removePostReaction(
    reactionId: number,
    postId: number,
    authorId: number,
  ): Promise<boolean> {
    return this.reactionRepository.removePostReaction(
      reactionId,
      postId,
      authorId,
    );
  }

  addCommentReaction(data: Reaction): Promise<boolean> {
    return this.reactionRepository.addCommentReaction(data);
  }

  removeCommentReaction(
    reactionId: number,
    commentId: number,
    authorId: number,
  ): Promise<boolean> {
    return this.reactionRepository.removeCommentReaction(
      reactionId,
      commentId,
      authorId,
    );
  }
}

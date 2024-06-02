import { Prisma, PrismaClient, Reaction } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { ReactionRepository } from './reactionRepository.interface';
// import { PostService } from '../services/postService';

// const postService = container.resolve(PostService);

@injectable()
export class ReactionRepositoryPrisma implements ReactionRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async getAll(whereClause?: object): Promise<Reaction[]> {
    return this.prisma.reaction.findMany({
      where: whereClause,
    });
  }

  async update(
    id: number,
    authorId: number,
    data: Reaction,
  ): Promise<Reaction | null> {
    return this.prisma.reaction.update({ where: { id, authorId }, data: data });
  }

  async addPostReaction(data: Reaction): Promise<[Reaction, number]> {
    try {
      // unique author for every post is handled at schema layer
      const [createdReaction, updatedPost] = await this.prisma.$transaction(
        [
          // Create a new reaction for the Post
          this.prisma.reaction.create({ data: data }),
          // Increment the reaction count for the corresponding Post
          this.prisma.post.update({
            where: { id: data.postId! },
            data: { reactionCount: { increment: 1 } },
          }),
        ],
        {
          isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
        },
      );
      return [createdReaction, updatedPost.reactionCount];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async removePostReaction(
    reactionId: number,
    postId: number,
    authorId: number,
  ): Promise<boolean> {
    try {
      await this.prisma.$transaction(
        [
          // Delete a reaction for the Post
          this.prisma.reaction.delete({
            where: { id: reactionId, postId, authorId },
          }),
          // Decrement the reaction count for the corresponding Post
          this.prisma.post.update({
            where: { id: postId },
            data: { reactionCount: { decrement: 1 } },
          }),
        ],
        {
          isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
        },
      );
      return true;
    } catch (error) {
      console.error(`Transaction failed: ${error}`);
      throw error;
    }
  }

  async addCommentReaction(data: Reaction): Promise<[Reaction, number]> {
    try {
      // unique author for every post is handled at schema layer
      const [createdReaction, updatedComment] = await this.prisma.$transaction(
        [
          // Create a new reaction for the Comment
          this.prisma.reaction.create({ data: data }),
          // Increment the reaction count for the corresponding Comment
          this.prisma.comment.update({
            where: { id: data.commentId! },
            data: { reactionCount: { increment: 1 } },
          }),
        ],
        {
          isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
        },
      );
      return [createdReaction, updatedComment.reactionCount];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async removeCommentReaction(
    reactionId: number,
    commentId: number,
    authorId: number,
  ): Promise<boolean> {
    try {
      await this.prisma.$transaction(
        [
          // Delete a reaction for the Comment
          this.prisma.reaction.delete({
            where: { id: reactionId, commentId, authorId },
          }),
          // Decrement the reaction count for the corresponding Comment
          this.prisma.comment.update({
            where: { id: commentId },
            data: { reactionCount: { decrement: 1 } },
          }),
        ],
        {
          isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
        },
      );
      return true;
    } catch (error) {
      console.error(`Transaction failed: ${error}`);
      throw error;
    }
  }
}

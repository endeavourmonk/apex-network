import { PrismaClient, Comment, Prisma } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { CommentRepository } from './commentRepository.interface';

@injectable()
export class CommentRepositoryPrisma implements CommentRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async getAll(whereClause?: object): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: whereClause,
    });
  }

  async getById(id: number): Promise<Comment | null> {
    return this.prisma.comment.findUnique({ where: { id } });
  }

  async createCommentAndIncrementCount(
    data: Comment,
  ): Promise<[Comment, number]> {
    try {
      const [createdComment, updatedPost] = await this.prisma.$transaction(
        [
          // Create a new comment for the Post
          this.prisma.comment.create({ data: data }),
          // Increment the comment count for the corresponding Post
          this.prisma.post.update({
            where: { id: data.postId },
            data: { commentCount: { increment: 1 } },
          }),
        ],
        {
          isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
        },
      );
      return [createdComment, updatedPost.commentCount];
    } catch (error) {
      console.error('Error creating comment and updating post count:', error);
      throw error;
    }
  }

  async update(
    id: number,
    authorId: number,
    data: Comment,
  ): Promise<Comment | null> {
    return this.prisma.comment.update({ where: { id, authorId }, data });
  }

  async deleteCommentAndDecrementCount(
    commentId: number,
    postId: number,
    authorId: number,
  ): Promise<boolean> {
    try {
      await this.prisma.$transaction(
        [
          // Delete a Comment for the Post
          this.prisma.reaction.delete({
            where: { id: commentId, postId, authorId },
          }),
          // Decrement the comment count for the corresponding Post
          this.prisma.post.update({
            where: { id: postId },
            data: { commentCount: { decrement: 1 } },
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

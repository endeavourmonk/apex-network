import { PrismaClient, Reaction } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { ReactionRepository } from './reactionRepository.interface';
// import { PostService } from '../services/postService';

// const postService = container.resolve(PostService);

@injectable()
export class ReactionRepositoryPrisma implements ReactionRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  getAll(postId?: number, userId?: number): Promise<Reaction[]> {
    const whereClause: { [key: string]: unknown } = {};

    if (postId !== undefined) whereClause.postId = postId;
    if (userId !== undefined) whereClause.userId = userId;

    return this.prisma.reaction.findMany({
      where: whereClause,
    });
  }

  create(data: Reaction): Promise<Reaction> {
    return this.prisma.reaction.create({ data: data });
  }

  update(id: number, data: Reaction): Promise<Reaction | null> {
    return this.prisma.reaction.update({ where: { id }, data: data });
  }

  delete(id: number): Promise<Reaction> {
    return this.prisma.reaction.delete({
      where: { id },
    });
  }

  // async createAndIncrementPostReactionCount(
  //   postId: number,
  //   data: Reaction,
  // ): Promise<boolean> {
  //   try {
  //     await this.prisma.$transaction([
  //       this.prisma.reaction.create({ data: data }),
  //       postService.update(postId, { reactionCount: { decrement: 1 } }),
  //     ]);
  //     return true;
  //   } catch (error) {
  //     console.error(error);
  //     return false;
  //   }
  // }

  async createAndIncrementPostReactionCount(
    postId: number,
    data: Reaction,
  ): Promise<boolean> {
    try {
      await this.prisma.$transaction([
        this.prisma.reaction.create({ data: data }),
        this.prisma.post.update({
          where: { id: postId },
          data: { reactionCount: { increment: 1 } },
        }),
      ]);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteAndDecrementPostReactionCount(
    reactionId: number,
    postId: number,
  ): Promise<boolean> {
    try {
      await this.prisma.$transaction([
        this.prisma.reaction.delete({ where: { id: reactionId } }),
        this.prisma.post.update({
          where: { id: postId },
          data: { reactionCount: { decrement: 1 } },
        }),
      ]);
      return true;
    } catch (error) {
      console.error(`Transaction failed: ${error}`);
      return false;
    }
  }
}

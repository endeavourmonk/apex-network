import { PrismaClient, Reaction } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { ReactionRepository } from './reactionRepository.interface';

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
  async delete(id: number): Promise<boolean> {
    const deletedReaction = await this.prisma.reaction.delete({
      where: { id },
    });
    return !!deletedReaction;
  }
}

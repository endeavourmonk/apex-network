import { PrismaClient, Comment } from '@prisma/client';
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

  async create(data: Comment): Promise<Comment> {
    return this.prisma.comment.create({ data });
  }

  async update(
    id: number,
    authorId: number,
    data: Comment,
  ): Promise<Comment | null> {
    return this.prisma.comment.update({ where: { id, authorId }, data });
  }

  async delete(id: number, authorId: number): Promise<boolean> {
    const deletedPosts = await this.prisma.comment.delete({
      where: { id, authorId },
    });
    return !!deletedPosts;
  }
}

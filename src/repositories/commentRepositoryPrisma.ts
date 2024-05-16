import { PrismaClient, Comment } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { CommentRepository } from './commentRepository.interface';

@injectable()
export class CommentRepositoryPrisma implements CommentRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async getAll(queryObject?: {
    postId?: number;
    userId?: number;
  }): Promise<Comment[]> {
    // creating prisma filters
    const whereClause: { [key: string]: unknown } = {};
    if (queryObject?.postId) whereClause.postId = queryObject.postId;
    if (queryObject?.userId) whereClause.authorId = queryObject.userId;

    console.log(whereClause);
    return this.prisma.comment.findMany({
      where: whereClause,
    });
  }

  async getById(id: number): Promise<Comment | null> {
    return this.prisma.comment.findUnique({ where: { id } });
  }

  async create(Comment: Comment): Promise<Comment> {
    return this.prisma.comment.create({ data: Comment });
  }

  async update(id: number, Comment: Comment): Promise<Comment | null> {
    return this.prisma.comment.update({ where: { id }, data: Comment });
  }

  async delete(id: number): Promise<boolean> {
    const deletedPosts = await this.prisma.comment.delete({ where: { id } });
    return !!deletedPosts;
  }
}

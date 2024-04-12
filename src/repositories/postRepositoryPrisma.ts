import { PrismaClient, Post } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { PostRepository } from './postRepository.interface.ts';

@injectable()
export class PostRepositoryPrisma implements PostRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async getAll(): Promise<Post[]> {
    return this.prisma.post.findMany();
  }

  async getById(PostID: number): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { PostID } });
  }

  async create(Post: Omit<Post, 'PostID'>): Promise<Post> {
    return this.prisma.post.create({ data: Post });
  }

  async update(PostID: number, Posts: Post): Promise<Post | null> {
    return this.prisma.post.update({ where: { PostID }, data: Posts });
  }

  async delete(PostID: number): Promise<boolean> {
    const deletedPosts = await this.prisma.post.delete({ where: { PostID } });
    return !!deletedPosts;
  }
}

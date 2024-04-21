import { PrismaClient, Post } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { PostRepository } from './postRepository.interface';

@injectable()
export class PostRepositoryPrisma implements PostRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async getAll(): Promise<Post[]> {
    return this.prisma.post.findMany();
  }

  async getById(postId: number): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { postId } });
  }

  async create(Post: Omit<Post, 'postId'>): Promise<Post> {
    return this.prisma.post.create({ data: Post });
  }

  async update(postId: number, Posts: Post): Promise<Post | null> {
    return this.prisma.post.update({ where: { postId }, data: Posts });
  }

  async delete(postId: number): Promise<boolean> {
    const deletedPosts = await this.prisma.post.delete({ where: { postId } });
    return !!deletedPosts;
  }
}

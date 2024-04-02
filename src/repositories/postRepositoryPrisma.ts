import { PrismaClient, Post } from '@prisma/client';
import { PostRepository } from './postRepository.interface';
import { injectable, inject } from 'tsyringe';

@injectable()
export class PostRepositoryPrisma implements PostRepository {
  // private prisma: PrismaClient;

  // constructor() {
  //   this.prisma = new PrismaClient();
  // }

  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async getAll(): Promise<Post[]> {
    return this.prisma.post.findMany();
  }

  async getById(PostID: number): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { PostID } });
  }

  async create(Posts: Omit<Post, 'PostID'>): Promise<Post> {
    return this.prisma.post.create({ data: Posts });
  }

  async update(PostID: number, Posts: Post): Promise<Post | null> {
    return this.prisma.post.update({ where: { PostID }, data: Posts });
  }

  async delete(PostID: number): Promise<boolean> {
    const deletedPosts = await this.prisma.post.delete({ where: { PostID } });
    return !!deletedPosts;
  }
}

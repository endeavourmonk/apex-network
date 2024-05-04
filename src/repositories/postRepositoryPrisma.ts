import { PrismaClient, Post } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { PostRepository } from './postRepository.interface';

interface PostFilters {
  postTitle?: string;
  postDate?: string;
  postType?: string;
}

const createPostPrismaFilter = (filters: PostFilters) => {
  const whereClause: { [key: string]: unknown } = {};

  if (filters.postTitle)
    whereClause.name = {
      startsWith: filters.postTitle,
      mode: 'insensitive',
    };
  if (filters.postDate) whereClause.createdAt = filters.postDate;
  if (filters.postType)
    whereClause.userType = {
      equals: filters.postType,
    };

  return whereClause;
};

@injectable()
export class PostRepositoryPrisma implements PostRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async getAll(queryObject?: object): Promise<Post[]> {
    const whereClause = createPostPrismaFilter(queryObject!);
    return this.prisma.post.findMany({
      where: whereClause,
    });
  }

  async getById(id: number): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async create(Post: Post): Promise<Post> {
    return this.prisma.post.create({ data: Post });
  }

  async update(id: number, Post: Post): Promise<Post | null> {
    return this.prisma.post.update({ where: { id }, data: Post });
  }

  async delete(id: number): Promise<boolean> {
    const deletedPosts = await this.prisma.post.delete({ where: { id } });
    return !!deletedPosts;
  }
}

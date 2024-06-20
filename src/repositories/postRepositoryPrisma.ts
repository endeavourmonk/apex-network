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

  // PENDING: including reactions with post needs optimized approach
  async getAll(queryObject?: object): Promise<Post[]> {
    const whereClause = createPostPrismaFilter(queryObject!);
    return this.prisma.post.findMany({
      where: whereClause,
      include: {
        reactions: true,
      },
    });
  }

  async getById(id: number): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async create(Post: Post): Promise<Post> {
    return this.prisma.post.create({ data: Post });
  }

  async update(id: number, authorId: number, Post: Post): Promise<Post | null> {
    return this.prisma.post.update({ where: { id, authorId }, data: Post });
  }

  async delete(id: number, authorId: number): Promise<boolean> {
    const deletedPost = await this.prisma.post.delete({
      where: { id, authorId },
    });
    return !!deletedPost;
  }
}

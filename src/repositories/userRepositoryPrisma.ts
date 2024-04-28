import { PrismaClient, User } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { UserRepository } from './userRepository.interface';

// TODO: make name filter case insensitive
interface PostFilters {
  name?: string;
  username?: string;
  createdAt_gt?: string;
}

const createPrismaFilter = (filters: PostFilters) => {
  const whereClause: { [key: string]: unknown } = {};

  if (filters.name) {
    whereClause.name = {
      contains: filters.name,
    };
  }

  if (filters.username) {
    whereClause.username = {
      contains: filters.username,
    };
  }

  if (filters.createdAt_gt) {
    whereClause.createdAt = {
      gt: filters.createdAt_gt,
    };
  }
  return whereClause;
};

@injectable()
export class UserRepositoryPrisma implements UserRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async getAll(queryObject?: Record<string, unknown>): Promise<User[]> {
    // const validKeys = ['name', 'username', 'createdAt_gt'];
    const whereClause = createPrismaFilter(queryObject!) ?? {};
    console.log('created filter', whereClause);

    return this.prisma.user.findMany({
      where: whereClause,
    });
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { email } });
  }

  async getById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });
  }

  async create(user: User): Promise<User> {
    return this.prisma.user.create({ data: user });
  }

  async update(id: number, user: User): Promise<User | null> {
    return this.prisma.user.update({ where: { id }, data: user });
  }

  async delete(id: number): Promise<boolean> {
    const deletedUser = await this.prisma.user.delete({ where: { id } });
    return !!deletedUser;
  }
}

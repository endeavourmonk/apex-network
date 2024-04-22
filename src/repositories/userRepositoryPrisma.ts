import { Prisma, PrismaClient, User } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { UserRepository } from './userRepository.interface';

// TODO: make name filter case insensitive
function createPrismaFilter(queryObject: {
  name?: string;
  username?: string;
  CreatedAt?: string; // ISO date string
}): Prisma.UserWhereInput {
  const filter: Prisma.UserWhereInput = {};

  // Explicitly defining the keys we're interested in as a const array
  const validKeys: Array<'name' | 'username'> = ['name', 'username'];

  Object.keys(queryObject).forEach((key) => {
    if (validKeys.includes(key as 'name' | 'username')) {
      const validKey = key as 'name' | 'username';
      const value = queryObject[validKey];
      if (value) {
        filter[validKey] = { contains: value };
      }
    } else if (key === 'CreatedAt' && queryObject.CreatedAt) {
      const dateValue = queryObject.CreatedAt;
      filter['createdAt'] = {
        gte: new Date(dateValue),
      };
    }
  });
  console.log('filter', filter);
  return filter;
}

@injectable()
export class UserRepositoryPrisma implements UserRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async getAll(filter?: object): Promise<User[]> {
    const whereClause = createPrismaFilter(filter!) ?? {};

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

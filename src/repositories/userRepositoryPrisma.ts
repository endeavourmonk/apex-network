import { PrismaClient, User } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { UserRepository } from './userRepository.interface';

@injectable()
export class UserRepositoryPrisma implements UserRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async getAll(filter?: object): Promise<User[]> {
    const whereClause = filter ?? {};

    return this.prisma.user.findMany({
      where: whereClause,
    });
  }

  async getById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        Posts: true,
      },
    });
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
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

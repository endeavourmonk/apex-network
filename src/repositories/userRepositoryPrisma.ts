import { PrismaClient, User } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { UserRepository } from './userRepository.interface';

@injectable()
export class UserRepositoryPrisma implements UserRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async getAll(whereClause: object): Promise<User[]> {
    console.log(whereClause);
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

  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}

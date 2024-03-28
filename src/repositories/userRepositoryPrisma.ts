import { PrismaClient, User } from '@prisma/client';
import { UserRepository } from './userRepository.interface';
import { injectable } from 'tsyringe';

@injectable()
export class UserRepositoryPrisma implements UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
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

import { PrismaClient, Job, Prisma } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { JobRepository } from './jobRepository.interface';

@injectable()
export class JobRepositoryPrisma implements JobRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async getAll(): Promise<Job[]> {
    return this.prisma.job.findMany();
  }

  async getById(id: number): Promise<Job | null> {
    return this.prisma.job.findUnique({ where: { id } });
  }

  async create(Job: Job, prisma: Prisma.TransactionClient): Promise<Job> {
    return prisma.job.create({ data: Job });
  }

  async update(id: number, Jobs: Job): Promise<Job | null> {
    return this.prisma.job.update({ where: { id }, data: Jobs });
  }

  async delete(id: number): Promise<boolean> {
    const deletedJobs = await this.prisma.job.delete({ where: { id } });
    return !!deletedJobs;
  }
}

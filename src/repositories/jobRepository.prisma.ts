import { PrismaClient, Job } from '@prisma/client';
import { JobRepository } from './jobRepository.interface';
import { injectable, inject } from 'tsyringe';

@injectable()
export class JobRepositoryPrisma implements JobRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async getAll(): Promise<Job[]> {
    return this.prisma.job.findMany();
  }

  async getById(JobID: number): Promise<Job | null> {
    return this.prisma.job.findUnique({ where: { JobID } });
  }

  async create(Job: Omit<Job, 'JobID'>): Promise<Job> {
    return this.prisma.job.create({ data: Job });
  }

  async update(JobID: number, Jobs: Job): Promise<Job | null> {
    return this.prisma.job.update({ where: { JobID }, data: Jobs });
  }

  async delete(JobID: number): Promise<boolean> {
    const deletedJobs = await this.prisma.job.delete({ where: { JobID } });
    return !!deletedJobs;
  }
}

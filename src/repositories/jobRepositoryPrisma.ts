import { PrismaClient, Job } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { JobRepository } from './jobRepository.interface';

@injectable()
export class JobRepositoryPrisma implements JobRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async getAll(): Promise<Job[]> {
    return this.prisma.job.findMany();
  }

  async getById(jobId: number): Promise<Job | null> {
    return this.prisma.job.findUnique({ where: { jobId } });
  }

  async create(Job: Omit<Job, 'JobID'>): Promise<Job> {
    return this.prisma.job.create({ data: Job });
  }

  async update(jobId: number, Jobs: Job): Promise<Job | null> {
    return this.prisma.job.update({ where: { jobId }, data: Jobs });
  }

  async delete(jobId: number): Promise<boolean> {
    const deletedJobs = await this.prisma.job.delete({ where: { jobId } });
    return !!deletedJobs;
  }
}

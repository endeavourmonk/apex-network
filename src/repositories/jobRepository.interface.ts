import { Job, Prisma } from '@prisma/client';

export interface JobRepository {
  getAll(): Promise<Job[]>;
  getById(jobId: number): Promise<Job | null>;
  create(Job: Job, prisma: Prisma.TransactionClient): Promise<Job>;
  update(jobId: number, Jobs: Job): Promise<Job | null>;
  delete(jobId: number): Promise<boolean>;
}

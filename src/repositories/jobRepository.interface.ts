import { Job } from '@prisma/client';

export interface JobRepository {
  getAll(): Promise<Job[]>;
  getById(jobId: number): Promise<Job | null>;
  create(Job: Omit<Job, 'jobId'>): Promise<Job>;
  update(jobId: number, Jobs: Job): Promise<Job | null>;
  delete(jobId: number): Promise<boolean>;
}

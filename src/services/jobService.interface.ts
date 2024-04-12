import { Job } from '@prisma/client';

export interface IJobService {
  getAll(): Promise<Job[]>;
  getById(JobID: number): Promise<Job | null>;
  create(Job: Omit<Job, 'JobID'>): Promise<Job>;
  update(JobID: number, Jobs: Job): Promise<Job | null>;
  delete(JobID: number): Promise<boolean>;
}

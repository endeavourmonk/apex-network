import { Job } from '@prisma/client';

export interface IJobService {
  getAll(): Promise<Job[]>;
  getById(jobId: number): Promise<Job | null>;
  create(JobDetails: Job, skillIds: number[]): Promise<Job>;
  update(jobId: number, Jobs: Job): Promise<Job | null>;
  delete(jobId: number): Promise<boolean>;
}

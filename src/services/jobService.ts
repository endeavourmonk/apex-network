import { Job } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { JobRepository } from '../repositories/jobRepository.interface';
import { IJobService } from './jobService.interface';

@injectable()
export class JobService implements IJobService {
  constructor(@inject('JobRepository') private JobRepository: JobRepository) {}

  getAll(): Promise<Job[]> {
    return this.JobRepository.getAll();
  }
  getById(JobID: number): Promise<Job | null> {
    return this.JobRepository.getById(JobID);
  }
  create(Job: Omit<Job, 'JobID'>): Promise<Job> {
    return this.JobRepository.create(Job);
  }
  update(JobID: number, Job: Job): Promise<Job | null> {
    return this.JobRepository.update(JobID, Job);
  }
  delete(JobID: number): Promise<boolean> {
    return this.JobRepository.delete(JobID);
  }
}

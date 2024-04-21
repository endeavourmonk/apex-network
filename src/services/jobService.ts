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
  getById(jobId: number): Promise<Job | null> {
    return this.JobRepository.getById(jobId);
  }
  create(Job: Omit<Job, 'jobId'>): Promise<Job> {
    return this.JobRepository.create(Job);
  }
  update(jobId: number, Job: Job): Promise<Job | null> {
    return this.JobRepository.update(jobId, Job);
  }
  delete(jobId: number): Promise<boolean> {
    return this.JobRepository.delete(jobId);
  }
}

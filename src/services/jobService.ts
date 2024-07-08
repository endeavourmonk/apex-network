import { Job, JobSkill, Prisma, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { JobRepository } from '../repositories/jobRepository.interface';
import { IJobService } from './jobService.interface';
import { JobSkillRepository } from '../repositories/jobSkillRepository.interface';

@injectable()
export class JobService implements IJobService {
  constructor(
    @inject('JobRepository') private JobRepository: JobRepository,
    @inject('JobSkillRepository')
    private JobSkillRepository: JobSkillRepository,
    @inject('PrismaClient') private prisma: PrismaClient,
  ) {}

  getAll(): Promise<Job[]> {
    return this.JobRepository.getAll();
  }

  getById(jobId: number): Promise<Job | null> {
    return this.JobRepository.getById(jobId);
  }

  async create(
    JobDetails: Job,
    skillIds: number[],
  ): Promise<Job & { skills: JobSkill[] }> {
    try {
      const newJob = await this.prisma.$transaction(
        async (tx) => {
          const createdJob = await this.JobRepository.create(JobDetails, tx);

          const jobSkills = skillIds.map((skillId: number) => ({
            jobId: createdJob.id,
            skillId,
          }));

          const skills = await this.JobSkillRepository.addSkillsToJob(
            jobSkills,
            tx,
          );

          const jobWithSkills = {
            ...createdJob,
            skills: skills,
          };

          return jobWithSkills;
        },
        {
          maxWait: 5000,
          timeout: 10000,
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );

      return newJob;
    } catch (error) {
      console.error(error);
      throw new Error(`Job not Created. ${error}`);
    }
  }

  update(jobId: number, Job: Job): Promise<Job | null> {
    return this.JobRepository.update(jobId, Job);
  }

  delete(jobId: number): Promise<boolean> {
    return this.JobRepository.delete(jobId);
  }
}

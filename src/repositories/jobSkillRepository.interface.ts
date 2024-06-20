import { JobSkill, Prisma } from '@prisma/client';

export interface JobSkillRepository {
  addSkillsToJob(
    jobSkills: JobSkill[],
    prisma: Prisma.TransactionClient,
  ): Promise<JobSkill[]>;
  removeSkillsFromJob(jobId: number, skillId: number): Promise<boolean>;
}

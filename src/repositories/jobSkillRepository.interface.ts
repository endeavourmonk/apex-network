import { JobSkill } from '@prisma/client';

export interface JobSkillRepository {
  addSkillToJob(jobId: number, skillId: number): Promise<JobSkill>;
  removeSkillFromJob(jobId: number, skillId: number): Promise<JobSkill>;
}

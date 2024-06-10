import { PrismaClient, JobSkill } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { JobSkillRepository } from './jobSkillRepository.interface';

@injectable()
export class JobSkillRepositoryPrisma implements JobSkillRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async addSkillToJob(jobId: number, skillId: number): Promise<JobSkill> {
    return this.prisma.jobSkill.create({
      data: { jobId, skillId },
    });
  }

  async removeSkillFromJob(jobId: number, skillId: number): Promise<JobSkill> {
    return this.prisma.jobSkill.delete({
      where: { jobId_skillId: { jobId, skillId } },
    });
  }
}

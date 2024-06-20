import { PrismaClient, JobSkill, Prisma } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { JobSkillRepository } from './jobSkillRepository.interface';

@injectable()
export class JobSkillRepositoryPrisma implements JobSkillRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async addSkillsToJob(
    jobSkills: JobSkill[],
    prisma: Prisma.TransactionClient,
  ): Promise<JobSkill[]> {
    return prisma.jobSkill.createManyAndReturn({
      data: jobSkills,
    });
  }

  async removeSkillsFromJob(jobId: number, skillId: number): Promise<boolean> {
    const deletedJobSkill = await this.prisma.jobSkill.delete({
      where: { jobId_skillId: { jobId, skillId } },
    });
    return !!deletedJobSkill;
  }
}

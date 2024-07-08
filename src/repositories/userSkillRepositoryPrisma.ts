import { PrismaClient, UserSkill } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { UserSkillRepository } from './userSkillRepository.interface';

@injectable()
export class UserSkillRepositoryPrisma implements UserSkillRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async addSkillToUser(userId: number, skillId: number): Promise<UserSkill> {
    return this.prisma.userSkill.create({
      data: { userId, skillId },
    });
  }

  async removeSkillFromUser(
    userId: number,
    skillId: number,
  ): Promise<UserSkill> {
    return this.prisma.userSkill.delete({
      where: { userId_skillId: { userId, skillId } },
    });
  }
}

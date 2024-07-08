import { PrismaClient, Skill } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { SkillRepository } from './skillRepository.interface';

@injectable()
export class SkillRepositoryPrisma implements SkillRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async getAllSkills(): Promise<Skill[]> {
    return this.prisma.skill.findMany();
  }

  async getSkillById(id: number): Promise<Skill | null> {
    return this.prisma.skill.findUnique({ where: { id } });
  }

  async createSkill(skill: Skill): Promise<Skill> {
    return this.prisma.skill.create({ data: skill });
  }

  async updateSkill(id: number, skill: Skill): Promise<Skill | null> {
    return this.prisma.skill.update({ where: { id }, data: skill });
  }

  async deleteSkill(id: number): Promise<Skill> {
    return this.prisma.skill.delete({ where: { id } });
  }
}

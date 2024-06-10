import { Skill } from '@prisma/client';

export interface SkillRepository {
  getAllSkills(): Promise<Skill[]>;
  getSkillById(id: number): Promise<Skill | null>;
  createSkill(skill: Skill): Promise<Skill>;
  updateSkill(id: number, skill: Skill): Promise<Skill | null>;
  deleteSkill(id: number): Promise<Skill>;
}

import { UserSkill } from '@prisma/client';

export interface UserSkillRepository {
  addSkillToUser(userId: number, skillId: number): Promise<UserSkill>;
  removeSkillFromUser(userId: number, skillId: number): Promise<UserSkill>;
}

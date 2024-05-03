import { Reaction } from '@prisma/client';

export interface ReactionRepository {
  getAll(postId?: number, userId?: number): Promise<Reaction[]>;
  create(data: Reaction): Promise<Reaction>;
  update(id: number, data: Reaction): Promise<Reaction | null>;
  delete(id: number): Promise<boolean>;
}

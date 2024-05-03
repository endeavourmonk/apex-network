import { Reaction } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { ReactionRepository } from '../repositories/reactionRepository.interface';
import { IReactionService } from '../services/reactionService.interface';

@injectable()
export class ReactionService implements IReactionService {
  constructor(
    @inject('ReactionRepository')
    private reactionRepository: ReactionRepository,
  ) {}

  getAll(postId?: number, userId?: number): Promise<Reaction[]> {
    return this.reactionRepository.getAll(postId, userId);
  }
  create(data: Reaction): Promise<Reaction> {
    return this.reactionRepository.create(data);
  }
  update(id: number, data: Reaction): Promise<Reaction | null> {
    return this.reactionRepository.update(id, data);
  }
  async delete(id: number): Promise<boolean> {
    return this.reactionRepository.delete(id);
  }
}

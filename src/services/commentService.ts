import { Comment } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { ICommentService } from './commentService.interface';
import { CommentRepository } from '../repositories/commentRepository.interface';

@injectable()
export class CommentService implements ICommentService {
  constructor(
    @inject('CommentRepository') private commentRepository: CommentRepository,
  ) {}

  getAll(queryObject?: {
    postId?: number;
    userId?: number;
  }): Promise<Comment[]> {
    const whereClause = queryObject ?? {};
    return this.commentRepository.getAll(whereClause);
  }

  getById(postId: number): Promise<Comment | null> {
    return this.commentRepository.getById(postId);
  }
  create(Comment: Comment): Promise<Comment> {
    return this.commentRepository.create(Comment);
  }
  update(commentId: number, updatedComent: Comment): Promise<Comment | null> {
    return this.commentRepository.update(commentId, updatedComent);
  }
  delete(commentId: number): Promise<boolean> {
    return this.commentRepository.delete(commentId);
  }
}

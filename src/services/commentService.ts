import { Comment } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { ICommentService } from './commentService.interface';
import { CommentRepository } from '../repositories/commentRepository.interface';

@injectable()
export class CommentService implements ICommentService {
  constructor(
    @inject('CommentRepository') private commentRepository: CommentRepository,
  ) {}

  getAll(queryObject?: { [key: string]: unknown }): Promise<Comment[]> {
    const whereClause: { [key: string]: unknown } = {};
    if (queryObject?.postId) whereClause.postId = queryObject.postId;
    if (queryObject?.userId) whereClause.authorId = queryObject.userId;
    console.log(whereClause);
    return this.commentRepository.getAll(whereClause);
  }

  getById(id: number): Promise<Comment | null> {
    return this.commentRepository.getById(id);
  }

  create(data: Comment): Promise<Comment> {
    return this.commentRepository.create(data);
  }

  update(
    commentId: number,
    authorId: number,
    updatedComent: Comment,
  ): Promise<Comment | null> {
    return this.commentRepository.update(commentId, authorId, updatedComent);
  }

  delete(commentId: number, authorId: number): Promise<boolean> {
    return this.commentRepository.delete(commentId, authorId);
  }
}

import { Comment } from '@prisma/client';

export interface ICommentService {
  getAll(queryObject?: {
    postId?: number;
    userId?: number;
  }): Promise<Comment[]>;
  getById(postId: number): Promise<Comment | null>;
  create(Comment: Comment): Promise<Comment>;
  update(postId: number, Posts: Comment): Promise<Comment | null>;
  delete(postId: number): Promise<boolean>;
}

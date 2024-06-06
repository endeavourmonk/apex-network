import { Comment } from '@prisma/client';

export interface ICommentService {
  getAll(whereClause?: object): Promise<Comment[]>;
  getById(id: number): Promise<Comment | null>;
  createCommentAndIncrementCount(data: Comment): Promise<[Comment, number]>;
  update(id: number, authorId: number, data: Comment): Promise<Comment | null>;
  deleteCommentAndDecrementCount(
    commentId: number,
    postId: number,
    authorId: number,
  ): Promise<boolean>;
}

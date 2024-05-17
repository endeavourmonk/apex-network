import { Comment } from '@prisma/client';

export interface ICommentService {
  getAll(whereClause?: object): Promise<Comment[]>;
  getById(id: number): Promise<Comment | null>;
  create(data: Comment): Promise<Comment>;
  update(id: number, authorId: number, data: Comment): Promise<Comment | null>;
  delete(id: number, authorId: number): Promise<boolean>;
}

import { Post } from '@prisma/client';

export interface IPostService {
  getAll(): Promise<Post[]>;
  getById(PostID: number): Promise<Post | null>;
  create(Posts: Omit<Post, 'PostID'>): Promise<Post>;
  update(PostID: number, Posts: Post): Promise<Post | null>;
  delete(PostID: number): Promise<boolean>;
}

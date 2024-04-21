import { Post } from '@prisma/client';

export interface IPostService {
  getAll(): Promise<Post[]>;
  getById(postId: number): Promise<Post | null>;
  create(Post: Omit<Post, 'postId'>): Promise<Post>;
  update(postId: number, Post: Post): Promise<Post | null>;
  delete(postId: number): Promise<boolean>;
}

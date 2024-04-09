import { Post } from '@prisma/client';

export interface PostRepository {
  getAll(): Promise<Post[]>;
  getById(PostID: number): Promise<Post | null>;
  create(Post: Omit<Post, 'PostID'>): Promise<Post>;
  update(PostID: number, Posts: Post): Promise<Post | null>;
  delete(PostID: number): Promise<boolean>;
}

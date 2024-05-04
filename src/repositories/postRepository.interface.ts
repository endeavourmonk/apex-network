import { Post } from '@prisma/client';

export interface PostRepository {
  getAll(queryObject?: object): Promise<Post[]>;
  getById(postId: number): Promise<Post | null>;
  create(Post: Post): Promise<Post>;
  update(postId: number, Posts: Post): Promise<Post | null>;
  delete(postId: number): Promise<boolean>;
}

import { IPostService } from './postService.interface';
import { Post } from '@prisma/client';
import { PostRepository } from '../repositories/postRepository.interface';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PostService implements IPostService {
  constructor(
    @inject('PostRepository') private postRepository: PostRepository,
  ) {}

  getAll(): Promise<Post[]> {
    return this.postRepository.getAll();
  }
  getById(PostID: number): Promise<Post | null> {
    return this.postRepository.getById(PostID);
  }
  create(Posts: Omit<Post, 'PostID'>): Promise<Post> {
    return this.postRepository.create(Posts);
  }
  update(PostID: number, Post: Post): Promise<Post | null> {
    return this.postRepository.update(PostID, Post);
  }
  delete(PostID: number): Promise<boolean> {
    return this.postRepository.delete(PostID);
  }
}

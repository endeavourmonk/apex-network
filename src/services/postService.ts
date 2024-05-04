import { Post } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { PostRepository } from '../repositories/postRepository.interface';
import { IPostService } from './postService.interface';

@injectable()
export class PostService implements IPostService {
  constructor(
    @inject('PostRepository') private postRepository: PostRepository,
  ) {}

  getAll(filter?: object): Promise<Post[]> {
    const whereClause = filter ?? {};
    return this.postRepository.getAll(whereClause);
  }
  getById(postId: number): Promise<Post | null> {
    return this.postRepository.getById(postId);
  }
  create(Post: Post): Promise<Post> {
    return this.postRepository.create(Post);
  }
  update(postId: number, updateData: Post): Promise<Post | null> {
    return this.postRepository.update(postId, updateData);
  }

  delete(postId: number): Promise<boolean> {
    return this.postRepository.delete(postId);
  }
}

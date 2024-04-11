import { container } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../repositories/userRepository.interface';
import { UserRepositoryPrisma } from '../repositories/userRepositoryPrisma.ts';
import { IUserService } from '../services/userService.interface.ts';
import { UserService } from '../services/userService.ts';
import { PostRepository } from '../repositories/postRepository.interface.ts';
import { PostRepositoryPrisma } from '../repositories/postRepositoryPrisma.ts';
import { PostService } from '../services/postService.ts';
import { IPostService } from '../services/postService.interface.ts';
import { JobRepository } from '../repositories/jobRepository.interface.ts';
import { JobRepositoryPrisma } from '../repositories/jobRepository.prisma.ts';
import { IJobService } from '../services/jobService.interface.ts';
import { JobService } from '../services/jobService.ts';

// prisma client setup
container.register('PrismaClient', { useValue: new PrismaClient() });

// user setup
container.register<UserRepository>('UserRepository', {
  useClass: UserRepositoryPrisma,
});

container.register<IUserService>('IUserService', {
  useClass: UserService,
});

// post setup
container.register<PostRepository>('PostRepository', {
  useClass: PostRepositoryPrisma,
});

container.register<IPostService>('IPostService', {
  useClass: PostService,
});

// jobs setup
container.register<JobRepository>('JobRepository', {
  useClass: JobRepositoryPrisma,
});

container.register<IJobService>('IJobService', {
  useClass: JobService,
});

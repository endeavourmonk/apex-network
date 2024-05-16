import { container } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../repositories/userRepository.interface';
import { UserRepositoryPrisma } from '../repositories/userRepositoryPrisma';
import { IUserService } from '../services/userService.interface';
import { UserService } from '../services/userService';
import { PostRepository } from '../repositories/postRepository.interface';
import { PostRepositoryPrisma } from '../repositories/postRepositoryPrisma';
import { IPostService } from '../services/postService.interface';
import { PostService } from '../services/postService';
import { JobRepository } from '../repositories/jobRepository.interface';
import { JobRepositoryPrisma } from '../repositories/jobRepositoryPrisma';
import { IJobService } from '../services/jobService.interface';
import { JobService } from '../services/jobService';
import { ApplicationRepository } from '../repositories/applicationRepository.interface';
import { ApplicationRepositoryPrisma } from '../repositories/applicationRepositoryPrisma';
import { IApplicationService } from '../services/applicationService.interface';
import { ApplicationService } from '../services/applicationService';
import { ReactionRepository } from '../repositories/reactionRepository.interface';
import { ReactionRepositoryPrisma } from '../repositories/reactionRepositoryPrisma';
import { IReactionService } from '../services/reactionService.interface';
import { ReactionService } from '../services/reactionService';

// Prisma Client Setup
container.register('PrismaClient', { useValue: new PrismaClient() });

// User Setup
container.register<UserRepository>('UserRepository', {
  useClass: UserRepositoryPrisma,
});

container.register<IUserService>('IUserService', {
  useClass: UserService,
});

// Post Setup
container.register<PostRepository>('PostRepository', {
  useClass: PostRepositoryPrisma,
});

container.register<IPostService>('IPostService', {
  useClass: PostService,
});

// Job Setup
container.register<JobRepository>('JobRepository', {
  useClass: JobRepositoryPrisma,
});

container.register<IJobService>('IJobService', {
  useClass: JobService,
});

// Application Setup
container.register<ApplicationRepository>('ApplicationRepository', {
  useClass: ApplicationRepositoryPrisma,
});

container.register<IApplicationService>('IApplicationService', {
  useClass: ApplicationService,
});

// Connectoin Setup

// Reaction Setup
container.register<ReactionRepository>('ReactionRepository', {
  useClass: ReactionRepositoryPrisma,
});

container.register<IReactionService>('IReactionService', {
  useClass: ReactionService,
});

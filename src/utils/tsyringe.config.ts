import { container } from 'tsyringe';
import { UserRepository } from '../repositories/userRepository.interface';
import { UserRepositoryPrisma } from '../repositories/userRepositoryPrisma.ts';
import { IUserService } from '../services/userService.interface.ts';
import { UserService } from '../services/userService.ts';

container.register<UserRepository>('UserRepository', {
  useClass: UserRepositoryPrisma,
});

container.register<IUserService>('IUserService', {
  useClass: UserService,
});

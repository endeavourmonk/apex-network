import { User } from '@prisma/client';
import { UserRepository } from '../repositories/userRepository.interface';
import { inject, injectable } from 'tsyringe';
import { IUserService } from './userService.interface';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject('UserRepository') private userRepository: UserRepository,
  ) {}

  getAll(): Promise<User[]> {
    return this.userRepository.getAll();
  }

  getById(id: number): Promise<User | null> {
    return this.userRepository.getById(id);
  }

  create(user: Omit<User, 'id'>): Promise<User> {
    return this.userRepository.create(user);
  }

  update(id: number, user: User): Promise<User | null> {
    return this.userRepository.update(id, user);
  }

  delete(id: number): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}

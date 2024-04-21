import { User } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { UserRepository } from '../repositories/userRepository.interface';
import { IUserService } from './userService.interface';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject('UserRepository') private userRepository: UserRepository,
  ) {}

  getAll(filter?: object): Promise<User[]> {
    const whereClause = filter ?? {};
    return this.userRepository.getAll(whereClause);
  }

  getByEmail(email: string): Promise<User | null> {
    return this.userRepository.getByEmail(email);
  }

  getById(id: number): Promise<User | null> {
    return this.userRepository.getById(id);
  }

  create(user: User): Promise<User> {
    return this.userRepository.create(user);
  }

  registerUser(email: string, name: string, picture: string): Promise<User> {
    const newUser: Partial<User> = {
      username: email.split('@')[0] as string,
      email: email,
      name: name,
      photoUrl: picture,
    };

    return this.userRepository.create(newUser as User);
  }

  update(id: number, user: User): Promise<User | null> {
    return this.userRepository.update(id, user);
  }

  delete(id: number): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}

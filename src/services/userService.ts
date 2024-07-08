import { User } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { UserRepository } from '../repositories/userRepository.interface';
import { IUserService } from './userService.interface';

interface UserFilters {
  name?: string;
  username?: string;
  createdAt?: string;
  userLevel?: number;
  userType?: string;
}

const createUserPrismaFilter = (filters: UserFilters) => {
  const whereClause: { [key: string]: unknown } = {};

  if (filters.name)
    whereClause.name = {
      startsWith: filters.name,
      mode: 'insensitive',
    };
  if (filters.username)
    whereClause.username = {
      startsWith: filters.username,
      mode: 'insensitive',
    };
  if (filters.createdAt) whereClause.createdAt = filters.createdAt;
  if (filters.userLevel) whereClause.userLevel = Number(filters.userLevel);
  if (filters.userType)
    whereClause.userType = {
      equals: filters.userType,
    };

  return whereClause;
};

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject('UserRepository') private userRepository: UserRepository,
  ) {}

  getAll(queryObject?: object): Promise<User[]> {
    const whereClause = queryObject ?? {};
    createUserPrismaFilter(queryObject!);
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

  delete(id: number): Promise<User> {
    return this.userRepository.delete(id);
  }
}

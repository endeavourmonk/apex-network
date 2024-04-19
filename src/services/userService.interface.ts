import { User } from '@prisma/client';

export interface IUserService {
  getAll(filter?: object): Promise<User[]>;
  getById(id: number): Promise<User | null>;
  create(user: Omit<User, 'id'>): Promise<User>;
  update(id: number, user: User): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}

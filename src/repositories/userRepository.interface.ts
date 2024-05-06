import { User } from '@prisma/client';

export interface UserRepository {
  getAll(filter?: object): Promise<User[]>;
  getByEmail(email: string): Promise<User | null>;
  getById(id: number): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: number, user: User): Promise<User | null>;
  delete(id: number): Promise<User>;
}

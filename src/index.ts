import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';

import { container, inject } from 'tsyringe';
import { UserRepository } from './repositories/userRepository.interface';
import { UserRepositoryPrisma } from './repositories/userRepositoryPrisma.ts';
import { User } from '@prisma/client';
container.register<UserRepository>('UserRepository', {
  useClass: UserRepositoryPrisma,
});

const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: '10kb' }));

export interface IUserService {
  create(user: any): Promise<User>;
}

class UserService implements IUserService {
  constructor(
    @inject('UserRepository') private userRepository: UserRepository,
  ) {}

  async create(user: any) {
    return this.userRepository.create(user);
  }
}

container.register<IUserService>('IUserService', {
  useClass: UserService,
});

app.post('/', async (req, res) => {
  try {
    const val: IUserService = container.resolve('IUserService');
    console.log(val);
    // await val.create(req.body);
    res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    console.log(error);
  }
});

console.log(process.env.PORT);

app.listen(PORT, () => {
  console.log(`🖥  Server is running at http://localhost:${PORT}⛁`);
});

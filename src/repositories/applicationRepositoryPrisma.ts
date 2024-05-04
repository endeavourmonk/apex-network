import { PrismaClient, Application } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { ApplicationRepository } from './applicationRepository.interface';

@injectable()
export class ApplicationRepositoryPrisma implements ApplicationRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async getAll(): Promise<Application[]> {
    return this.prisma.application.findMany();
  }

  async getById(id: number): Promise<Application | null> {
    return this.prisma.application.findUnique({ where: { id } });
  }

  async create(Application: Application): Promise<Application> {
    return this.prisma.application.create({ data: Application });
  }

  async update(
    id: number,
    Application: Application,
  ): Promise<Application | null> {
    return this.prisma.application.update({
      where: { id },
      data: Application,
    });
  }

  async delete(id: number): Promise<boolean> {
    const deletedApplications = await this.prisma.application.delete({
      where: { id },
    });
    return !!deletedApplications;
  }
}

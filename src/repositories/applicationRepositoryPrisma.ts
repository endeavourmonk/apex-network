import { PrismaClient, Application } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { ApplicationRepository } from './applicationRepository.interface';

@injectable()
export class ApplicationRepositoryPrisma implements ApplicationRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async getAll(): Promise<Application[]> {
    return this.prisma.application.findMany();
  }

  async getById(ApplicationID: number): Promise<Application | null> {
    return this.prisma.application.findUnique({ where: { ApplicationID } });
  }

  async create(
    Application: Omit<Application, 'ApplicationID'>,
  ): Promise<Application> {
    return this.prisma.application.create({ data: Application });
  }

  async update(
    ApplicationID: number,
    Application: Application,
  ): Promise<Application | null> {
    return this.prisma.application.update({
      where: { ApplicationID },
      data: Application,
    });
  }

  async delete(ApplicationID: number): Promise<boolean> {
    const deletedApplications = await this.prisma.application.delete({
      where: { ApplicationID },
    });
    return !!deletedApplications;
  }
}

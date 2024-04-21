import { PrismaClient, Application } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { ApplicationRepository } from './applicationRepository.interface';

@injectable()
export class ApplicationRepositoryPrisma implements ApplicationRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async getAll(): Promise<Application[]> {
    return this.prisma.application.findMany();
  }

  async getById(applicationId: number): Promise<Application | null> {
    return this.prisma.application.findUnique({ where: { applicationId } });
  }

  async create(
    Application: Omit<Application, 'applicationId'>,
  ): Promise<Application> {
    return this.prisma.application.create({ data: Application });
  }

  async update(
    applicationId: number,
    Application: Application,
  ): Promise<Application | null> {
    return this.prisma.application.update({
      where: { applicationId },
      data: Application,
    });
  }

  async delete(applicationId: number): Promise<boolean> {
    const deletedApplications = await this.prisma.application.delete({
      where: { applicationId },
    });
    return !!deletedApplications;
  }
}

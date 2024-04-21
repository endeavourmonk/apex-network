import { Application } from '@prisma/client';

export interface ApplicationRepository {
  getAll(): Promise<Application[]>;
  getById(applicationId: number): Promise<Application | null>;
  create(Application: Omit<Application, 'applicationId'>): Promise<Application>;
  update(
    applicationId: number,
    Application: Application,
  ): Promise<Application | null>;
  delete(applicationId: number): Promise<boolean>;
}

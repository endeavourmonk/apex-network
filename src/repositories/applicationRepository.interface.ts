import { Application } from '@prisma/client';

export interface ApplicationRepository {
  getAll(): Promise<Application[]>;
  getById(ApplicationID: number): Promise<Application | null>;
  create(Application: Omit<Application, 'ApplicationID'>): Promise<Application>;
  update(
    ApplicationID: number,
    Application: Application,
  ): Promise<Application | null>;
  delete(ApplicationID: number): Promise<boolean>;
}

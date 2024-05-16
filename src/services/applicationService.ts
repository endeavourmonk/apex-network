import { inject, injectable } from 'tsyringe';
import { Application } from '@prisma/client';
import { ApplicationRepository } from '../repositories/applicationRepository.interface';
import { IApplicationService } from './applicationService.interface';

@injectable()
export class ApplicationService implements IApplicationService {
  constructor(
    @inject('ApplicationRepository')
    private applicationRepository: ApplicationRepository,
  ) {}

  getAll(): Promise<Application[]> {
    return this.applicationRepository.getAll();
  }
  getById(applicationId: number): Promise<Application | null> {
    return this.applicationRepository.getById(applicationId);
  }
  create(Application: Application): Promise<Application> {
    return this.applicationRepository.create(Application);
  }
  update(
    applicationId: number,
    Application: Application,
  ): Promise<Application | null> {
    return this.applicationRepository.update(applicationId, Application);
  }
  delete(applicationId: number): Promise<boolean> {
    return this.applicationRepository.delete(applicationId);
  }
}

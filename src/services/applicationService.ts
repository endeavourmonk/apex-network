import { inject, injectable } from 'tsyringe';
import { Application } from '@prisma/client';
import { ApplicationRepository } from '../repositories/applicationRepository.interface.ts';
import { IApplicationService } from './applicationService.interface.ts';

@injectable()
export class ApplicationService implements IApplicationService {
  constructor(
    @inject('ApplicationRepository')
    private applicationRepository: ApplicationRepository,
  ) {}

  getAll(): Promise<Application[]> {
    return this.applicationRepository.getAll();
  }
  getById(ApplicationID: number): Promise<Application | null> {
    return this.applicationRepository.getById(ApplicationID);
  }
  create(
    Application: Omit<Application, 'ApplicationID'>,
  ): Promise<Application> {
    return this.applicationRepository.create(Application);
  }
  update(
    ApplicationID: number,
    Application: Application,
  ): Promise<Application | null> {
    return this.applicationRepository.update(ApplicationID, Application);
  }
  delete(ApplicationID: number): Promise<boolean> {
    return this.applicationRepository.delete(ApplicationID);
  }
}

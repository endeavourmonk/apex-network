import express, { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { ApplicationService } from '../services/applicationService.ts';
import handleAsync from '../utils/handleAsync.ts';
import { AppError } from '../utils/error.ts';

const router = express.Router();
const applicationService = container.resolve(ApplicationService);

router.get(
  '/',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const applications = await applicationService.getAll();
      res.status(200).json(applications);
    } catch (err) {
      next(err);
    }
  }),
);

router.get(
  '/:id',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params.id);
    const application = await applicationService.getById(Number(req.params.id));
    if (!application) return next(new AppError(404, `application not found`));
    res.status(200).json(application);
  }),
);

router.post(
  '/',
  handleAsync(async (req: Request, res: Response) => {
    const newApplication = await applicationService.create(req.body);
    res.status(201).json(newApplication);
  }),
);

router.put(
  '/:id',
  handleAsync(async (req: Request, res: Response) => {
    const updatedApplication = await applicationService.update(
      Number(req.params.id),
      req.body,
    );
    res.status(200).json(updatedApplication);
  }),
);

router.delete(
  '/:id',
  handleAsync(async (req: Request, res: Response) => {
    const deleted = await applicationService.delete(Number(req.params.id));
    res.status(200).json({ deleted });
  }),
);

export default router;

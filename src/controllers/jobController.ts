import express, { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import handleAsync from '../utils/handleAsync';
import { JobService } from '../services/jobService';
import { AppError } from '../utils/error';

const router = express.Router();
const jobService = container.resolve(JobService);

router.get(
  '/',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobs = await jobService.getAll();
      res.json(jobs);
    } catch (err) {
      next(err);
    }
  }),
);

router.get(
  '/:id',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    const job = await jobService.getById(Number(req.params.id));
    if (!job) return next(new AppError(404, `job not found.`));
    res.json(job);
  }),
);

router.post(
  '/',
  handleAsync(async (req: Request, res: Response) => {
    const newJob = await jobService.create(req.body);
    res.json(newJob);
  }),
);

router.put(
  '/:id',
  handleAsync(async (req: Request, res: Response) => {
    const updatedJob = await jobService.update(Number(req.params.id), req.body);
    res.json(updatedJob);
  }),
);

router.delete(
  '/:id',
  handleAsync(async (req: Request, res: Response) => {
    const deleted = await jobService.delete(Number(req.params.id));
    res.json({ deleted });
  }),
);

export default router;

import express, { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { fromError } from 'zod-validation-error';
import { z } from 'zod';
import { Job, User } from '@prisma/client';

import { JobService } from '../services/jobService';
import handleAsync from '../utils/handleAsync';
import { AppError } from '../utils/AppError';
import { validateLogin } from '../middlewares/validateLogin';

const router = express.Router();
const jobService = container.resolve(JobService);

interface RequestWithUser extends Request {
  user?: User;
}

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
  validateLogin,
  handleAsync(
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
      const authorId = req?.user?.id;

      const JobSchema = z.object({
        title: z.string().max(100),
        description: z.string(),
        role: z.string().max(50),
        location: z.string().max(100),
        locationType: z.string().max(50),
        experienceRequired: z.string().max(100),
        salaryRange: z.string().max(100),
        salaryCurrency: z.string().max(10),
        jobDate: z.date().optional(),
        authorId: z.number().int(),
        skillsIds: z.array(z.number().int()),
      });

      const jobData = {
        title: req.body.title,
        description: req.body.description,
        role: req.body.role,
        location: req.body.location,
        locationType: req.body.locationType,
        experienceRequired: req.body.experienceRequired,
        salaryRange: req.body.salaryRange,
        salaryCurrency: req.body.salaryCurrency,
        // jobDate: new Date(req.body.jobDate),
        authorId: authorId,
        skillsIds: req.body.skillsIds?.map((id: string) => parseInt(id)),
      };

      const validatedData = JobSchema.safeParse(jobData);
      if (!validatedData.success) {
        const validationError = fromError(validatedData.error);
        return next(new AppError(400, `Invalid data: ${validationError}`));
      }

      const { skillsIds, ...jobDetails } = validatedData.data;

      const newJob = await jobService.create(jobDetails as Job, skillsIds);
      res.status(201).json({
        status: 'success',
        message: 'Job created successfully',
        data: {
          newJob,
        },
      });
    },
  ),
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

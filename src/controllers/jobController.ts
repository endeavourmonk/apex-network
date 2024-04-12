import express, { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import handleAsync from '../utils/handleAsync.ts';
import { JobService } from '../services/jobService.ts';

const router = express.Router();
const jobService = container.resolve(JobService);

router.get(
  '/',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await jobService.getAll();
      res.json(posts);
    } catch (err) {
      next(err);
    }
  }),
);

router.get(
  '/:id',
  handleAsync(async (req: Request, res: Response) => {
    const post = await jobService.getById(Number(req.params.id));
    res.json(post);
  }),
);

router.post(
  '/',
  handleAsync(async (req: Request, res: Response) => {
    const newPost = await jobService.create(req.body);
    res.json(newPost);
  }),
);

router.put(
  '/:id',
  handleAsync(async (req: Request, res: Response) => {
    const updatedPost = await jobService.update(
      Number(req.params.id),
      req.body,
    );
    res.json(updatedPost);
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

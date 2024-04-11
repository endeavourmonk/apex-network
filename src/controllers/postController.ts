import express, { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { PostService } from '../services/postService.ts';
import handleAsync from '../utils/handleAsync.ts';

const router = express.Router();
const postService = container.resolve(PostService);

router.get(
  '/',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await postService.getAll();
      res.json(posts);
    } catch (err) {
      next(err);
    }
  }),
);

router.get(
  '/:id',
  handleAsync(async (req: Request, res: Response) => {
    const post = await postService.getById(Number(req.params.id));
    res.json(post);
  }),
);

router.post(
  '/',
  handleAsync(async (req: Request, res: Response) => {
    const newPost = await postService.create(req.body);
    res.json(newPost);
  }),
);

router.put(
  '/:id',
  handleAsync(async (req: Request, res: Response) => {
    const updatedPost = await postService.update(
      Number(req.params.id),
      req.body,
    );
    res.json(updatedPost);
  }),
);

router.delete(
  '/:id',
  handleAsync(async (req: Request, res: Response) => {
    const deleted = await postService.delete(Number(req.params.id));
    res.json({ deleted });
  }),
);

export default router;

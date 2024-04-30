import express, { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { PostService } from '../services/postService';
import handleAsync from '../utils/handleAsync';
import { AppError } from '../utils/error';

const router = express.Router();
const postService = container.resolve(PostService);

router.get(
  '/',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    const queries = req.query;
    const posts = await postService.getAll(queries);
    if (!posts) return next(new AppError(404, `Posts not found`));
    res.json(posts);
  }),
);

router.get(
  '/:id',
  handleAsync(async (req: Request, res: Response) => {
    const post = await postService.getById(Number(req.params.id));
    if (!post) return new AppError(404, `Post not found`);
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

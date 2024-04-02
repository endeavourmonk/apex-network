import 'dotenv/config';
import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';

import './utils/tsyringe.config.ts';

import userRouter from './controllers/userController.ts';
import postRouter from './controllers/postController.ts';

const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: '10kb' }));

console.log(process.env.PORT);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Apex Network',
  });
});

// global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log('-----------------------GEH--------------------');
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('error', { error: err });
});

app.listen(PORT, () => {
  console.log(`🖥  Server is running at http://localhost:${PORT}⛁`);
});

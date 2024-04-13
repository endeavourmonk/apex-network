import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';

import './utils/tsyringe.config';

import userRouter from './controllers/userController';
import postRouter from './controllers/postController';
import jobRouter from './controllers/jobController';
import applicationRouter from './controllers/applicationController';
import { globalErrorHandler } from './utils/errorHandler';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json({ limit: '10kb' }));

console.log(process.env.PORT);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/applications', applicationRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Apex Network',
  });
});

// global error handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`🖥  Server is running at http://localhost:${PORT}⛁`);
});

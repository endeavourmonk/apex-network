import { Request, Response, NextFunction } from 'express';
import { AppError, AppErrorInterface } from './error';

const sendErrorDev = (err: AppErrorInterface, res: Response) => {
  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppErrorInterface, res: Response) => {
  // operational trusted error: send to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: 'failed',
      message: err.message,
    });
  } else {
    // Programming or other error: don't send whole error, send generic message to client
    console.error('ERROR: ', err);
    res.status(500).json({
      status: 'failed',
      message: 'Something went wrong',
    });
  }
};

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  process.env.NODE_ENV === 'production'
    ? sendErrorProd(err, res)
    : sendErrorDev(err, res);
};

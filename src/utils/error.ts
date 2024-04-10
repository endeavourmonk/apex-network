export interface AppErrorInterface {
  statusCode: number;
  status: string;
  message: string;
  isOperational: boolean;
  stack?: string;
}

export class AppError extends Error implements AppErrorInterface {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this);
  }
}

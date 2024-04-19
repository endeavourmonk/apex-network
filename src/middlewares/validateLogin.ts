import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/error';
import { UserService } from '../services/userService';

const userService = container.resolve(UserService);

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const jwtAccessToken = req?.headers?.authorization?.split(' ')?.[1];
  // console.log(jwtAccessToken);
  if (jwtAccessToken) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next(new AppError(500, 'Internal Server Error'));
    }
    jwt.verify(jwtAccessToken, secret, async function (err, decoded) {
      if (err) {
        console.log('err');
        return next(new AppError(400, `Invalid JWT.`));
      }
      console.log(decoded.email);
      // verify that user exist in database
      // const filter = {
      //   email: decoded?.email,
      // };
      // const user = await userService.getAll(filter);
    });
  } else {
    return next(new AppError(401, `Unauthorized`));
  }
  next();
};

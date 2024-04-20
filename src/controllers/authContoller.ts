import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { container } from 'tsyringe';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import handleAsync from '../utils/handleAsync';
import { UserService } from '../services/UserService';
import { AppError } from '../utils/error';
import { UserRepositoryPrisma } from '../repositories/userRepositoryPrisma';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.NODE_ENV
    ? process.env.GOOGLE_CALLBACK_URL_DEV
    : process.env.GOOGLE_CALLBACK_URL_PROD,
);

console.log(process.env.GOOGLE_CALLBACK_URL);

router.get(
  '/google/callback',
  handleAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.query;

    try {
      const { tokens } = await client.getToken(code as string);
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token as string,
        audience: process.env.CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { email, name, sub: googleId } = payload as TokenPayload;
      console.log(payload);

      // Check if user exists in database otherwise create user
      if (email) {
        const user = await userService.getByEmail(email);
        console.log('user: ', user);
        if (!user) {
          console.log('creating user');
          const us = new UserService(
            new UserRepositoryPrisma(new PrismaClient()),
          );
          await 
        }
      } else {
        return next(new AppError(400, `Error signing with google`));
      }

      // Generate JWT and Redirect to frontend with JWT.
      const user = { email, name, googleId };
      const jwtAccessToken = jwt.sign(user, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRY_TIME,
      });

      const redirectURI = `${req.protocol}://${req.hostname}:${process.env.PORT}?token=${jwtAccessToken}`;
      res.redirect(redirectURI);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error authenticating with Google');
    }
  }),
);

export default router;

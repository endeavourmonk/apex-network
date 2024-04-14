import express, { Request, Response } from 'express';
import handleAsync from '../utils/handleAsync';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import jwt from 'jsonwebtoken';
const router = express.Router();
const client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'http://localhost:8000/auth/google/callback',
);

router.get(
  '/google/callback',
  handleAsync(async (req: Request, res: Response) => {
    const { code } = req.query;

    try {
      const { tokens } = await client.getToken(code as string);
      // console.log('tokens', tokens);
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token as string,
        audience: process.env.CLIENT_ID,
      });
      // console.log('verified', ticket);
      const payload = ticket.getPayload();

      // Extract user information from payload
      const { email, name, sub: googleId } = payload as TokenPayload;

      // Check if user exists in your database (optional)
      // Create user if necessary

      // Generate JWT
      const user = { email, name, googleId };
      const accessToken = jwt.sign(user, process.env.JWT_SECRET as string, {
        expiresIn: '30m',
      });
      console.log(accessToken);
      res.redirect(`http://localhost:8000?token=${accessToken}`); // Redirect to frontend with JWT
    } catch (error) {
      console.error(error);
      res.status(500).send('Error authenticating with Google');
    }
  }),
);

export default router;

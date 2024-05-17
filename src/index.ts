import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';

import './utils/tsyringe.config';

import userRouter from './controllers/userController';
import postRouter from './controllers/postController';
import jobRouter from './controllers/jobController';
import applicationRouter from './controllers/applicationController';
import authRouter from './controllers/authContoller';
import { globalErrorHandler } from './middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/applications', applicationRouter);
app.use('/auth', authRouter);
// app.use(express.static()); // Replace with your public directory if needed

app.get('/', (req, res) => {
  // Check if query parameter "token" exists
  const token = req.query.token;

  if (token) {
    // If token exists, create HTML content with token
    const htmlContent = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="icon"
          type="image/x-icon"
          href="https://img.freepik.com/premium-vector/pawn-chess-icon_535345-3365.jpg"
        />
        <title>Home</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 50px;
          }
    
          h2 {
            color: #333;
          }
        </style>
      </head>
      <body>
        <h2>Welcome to the Home Page LoggedIn</h2>
        <div>
          <p>Token: ${token as string}</p>
        </div>
      </body>
    </html>
    `;

    // Send the HTML response with token
    res.send(htmlContent);
  } else {
    // If token does not exist, render the login button
    const htmlContent = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="icon"
          type="image/x-icon"
          href="https://img.freepik.com/premium-vector/pawn-chess-icon_535345-3365.jpg"
        />
        <title>Home</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 50px;
          }
    
          h2 {
            color: #333;
          }
    
          .button-container {
            margin-top: 20px;
          }
    
          .button-container a {
            background-color: #4caf50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <h2>Welcome to the Home Page</h2>
        <div class="button-container">
          <a id="googleSignInBtn">Google</a>
          <a href="/auth/logout">Log out now</a>
          <a href="/users">all users</a>
        </div>
        <script>
          const signInBtn = document.getElementById('googleSignInBtn');
      
          signInBtn.addEventListener('click', () => {
            const googleLoginUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
            const clientId =
              '352780535822-vh7uvtn43m191uusm576oo3fu9ltmdbh.apps.googleusercontent.com'; // Replace with your actual client ID
            const redirectUri = 'http://localhost:8000/auth/google/callback'; // Replace with your redirect URI
            const scope = 'profile email'; // Adjust scopes as needed
      
            const url = new URL(googleLoginUrl);
            url.searchParams.set('client_id', clientId);
            url.searchParams.set('redirect_uri', redirectUri);
            url.searchParams.set('scope', scope);
            url.searchParams.set('response_type', 'code');
            url.searchParams.set('access_type', 'offline'); // Optional: request a refresh token
      
            window.location.href = url.toString();
          });
        </script>
      </body>
    </html>
    `;

    // Send the HTML response with login button
    res.send(htmlContent);
  }
});
// global error handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`🖥  Server is running at http://localhost:${PORT}⛁`);
});

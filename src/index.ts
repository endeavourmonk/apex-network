import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';

import './utils/tsyringe.config';

import userRouter from './controllers/userController';
import postRouter from './controllers/postController';
import jobRouter from './controllers/jobController';
import applicationRouter from './controllers/applicationController';
import authRouter from './controllers/authContoller';
import { globalErrorHandler } from './utils/errorHandler';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json({ limit: '10kb' }));

console.log(process.env.PORT);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/applications', applicationRouter);
app.use('/auth', authRouter);
// app.use(express.static()); // Replace with your public directory if needed

app.get('/', (req, res) => {
  // Create the HTML content
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
          display: flex;
          justify-content: space-around;
          margin-top: 20px;
        }
  
        .button-container a,
        .button-container form {
          text-decoration: none;
          color: #fff;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          border-radius: 5px;
          font-size: 16px;
          transition: background-color 0.3s;
        }
  
        .button-container a {
          background-color: #4caf50; /* Green */
        }
  
        .button-container form {
          background-color: #f44336; /* Red */
        }
  
        .button-container a:hover,
        .button-container form:hover {
          background-color: #45a049; /* Darker green */
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
    </body>
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
  </html>
    `;

  // Send the HTML response
  res.send(htmlContent);
});

// global error handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`🖥  Server is running at http://localhost:${PORT}⛁`);
});

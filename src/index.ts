import 'dotenv/config';
import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

console.log(process.env.PORT);

app.listen(port, () => {
  console.log(`🖥  Server is running at http://localhost:${port}⛁`);
});

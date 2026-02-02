import express from 'express';
import cors from 'cors';
import env from '../config/env';
import { routes } from './routes';

console.log('Iniciando app.ts...');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(env.port, () => {
  console.log(`🚀 Server running on port ${env.port}`);
});

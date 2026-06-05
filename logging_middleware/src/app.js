import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import { loggingMiddleware } from './middleware/loggingMiddleware.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggingMiddleware);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Logging Middleware Service is running'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

export default app;

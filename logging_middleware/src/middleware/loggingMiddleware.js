import { Log } from '../services/logger.js';

export async function loggingMiddleware(req, res, next) {
  try {
    const logMessage = `${req.method} ${req.originalUrl}`;
    await Log('backend', 'info', 'middleware', logMessage);
  } catch (error) {
    console.error('Logging middleware error:', error.message);
  }

  next();
}

import dotenv from 'dotenv';

dotenv.config();

export default {
  NODE_ENV: process.env.NODE_ENV || 'development', // environment (development, production, etc.)
  PORT: process.env.PORT || 5000, // port for the server to listen on
  SERVER_URL: process.env.SERVER_URL || 'http://4.224.186.213/evaluation-service', // base URL for API requests
  CLIENT_ID: process.env.CLIENT_ID,     // client ID for authentication
  CLIENT_SECRET: process.env.CLIENT_SECRET, // client secret for authentication
  EMAIL: process.env.EMAIL, // email for registration/authentication
  NAME: process.env.NAME,
  ROLL_NO: process.env.ROLL_NO,
  MOBILE_NO: process.env.MOBILE_NO,
  GITHUB_USERNAME: process.env.GITHUB_USERNAME,
  ACCESS_CODE: process.env.ACCESS_CODE, // access code for registration/authentication
  LOG_LEVEL: process.env.LOG_LEVEL || 'info' // logging level (info, debug, error, etc.)
};
